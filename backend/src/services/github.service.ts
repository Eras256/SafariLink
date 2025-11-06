import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  html_url: string;
  private: boolean;
}

interface GitHubLanguageStats {
  [language: string]: number;
}

interface GitHubActivity {
  totalCommits: number;
  recentCommits: number;
  totalRepos: number;
  publicRepos: number;
  languages: GitHubLanguageStats;
  mostActiveRepo: string | null;
  lastActivity: string | null;
}

interface GitHubAnalysis {
  username: string;
  profileUrl: string;
  repos: GitHubRepo[];
  languages: GitHubLanguageStats;
  activity: GitHubActivity;
  skills: string[];
  skillLevels: { [skill: string]: string };
  qualityScore: number; // 0-1
  lastAnalyzed: Date;
}

export class GitHubService {
  private readonly apiUrl = 'https://api.github.com';
  private readonly token = process.env.GITHUB_TOKEN; // Optional GitHub token for higher rate limits

  /**
   * Extract username from GitHub URL
   */
  private extractUsername(githubUrl: string): string | null {
    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length > 0) {
        return pathParts[0];
      }
      return null;
    } catch {
      // If it's not a full URL, assume it's just a username
      return githubUrl.replace(/^@/, '').trim();
    }
  }

  /**
   * Get GitHub user repositories
   */
  private async getUserRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const headers: any = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.token) {
        headers.Authorization = `token ${this.token}`;
      }

      const response = await axios.get(
        `${this.apiUrl}/users/${username}/repos?per_page=100&sort=updated`,
        { headers }
      );

      return response.data.filter((repo: GitHubRepo) => !repo.private);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`GitHub user "${username}" not found`);
      }
      if (error.response?.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to fetch GitHub repos: ${error.message}`);
    }
  }

  /**
   * Get language statistics for a repository
   */
  private async getRepoLanguages(languagesUrl: string): Promise<GitHubLanguageStats> {
    try {
      const headers: any = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.token) {
        headers.Authorization = `token ${this.token}`;
      }

      const response = await axios.get(languagesUrl, { headers });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching repo languages:', error.message);
      return {};
    }
  }

  /**
   * Aggregate languages from all repositories
   */
  private async aggregateLanguages(repos: GitHubRepo[]): Promise<GitHubLanguageStats> {
    const languageMap: { [key: string]: number } = {};

    // Get languages for top 10 most recently updated repos
    const topRepos = repos
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 10);

    for (const repo of topRepos) {
      try {
        const languages = await this.getRepoLanguages(repo.languages_url);
        for (const [lang, bytes] of Object.entries(languages)) {
          languageMap[lang] = (languageMap[lang] || 0) + (bytes as number);
        }
      } catch (error) {
        // Continue with other repos if one fails
        console.error(`Error fetching languages for ${repo.name}:`, error);
      }
    }

    return languageMap;
  }

  /**
   * Extract skills from GitHub data
   */
  private extractSkills(
    languages: GitHubLanguageStats,
    repos: GitHubRepo[]
  ): { skills: string[]; skillLevels: { [skill: string]: string } } {
    const skills: string[] = [];
    const skillLevels: { [skill: string]: string } = {};

    // Map programming languages to skills
    const languageToSkill: { [key: string]: string } = {
      JavaScript: 'JavaScript',
      TypeScript: 'TypeScript',
      Solidity: 'Solidity',
      Rust: 'Rust',
      Python: 'Python',
      Java: 'Java',
      'C++': 'C++',
      C: 'C',
      Go: 'Go',
      Swift: 'Swift',
      Kotlin: 'Kotlin',
      PHP: 'PHP',
      Ruby: 'Ruby',
      HTML: 'HTML',
      CSS: 'CSS',
      SCSS: 'SCSS',
      Vue: 'Vue.js',
      React: 'React',
      Angular: 'Angular',
    };

    // Calculate total bytes for normalization
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    // Extract skills from languages
    for (const [lang, bytes] of Object.entries(languages)) {
      const skill = languageToSkill[lang] || lang;
      if (!skills.includes(skill)) {
        skills.push(skill);
      }

      // Determine skill level based on percentage of code
      const percentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
      if (percentage > 30) {
        skillLevels[skill] = 'expert';
      } else if (percentage > 15) {
        skillLevels[skill] = 'advanced';
      } else if (percentage > 5) {
        skillLevels[skill] = 'intermediate';
      } else {
        skillLevels[skill] = 'beginner';
      }
    }

    // Extract framework/technology skills from repo descriptions and names
    const techKeywords: { [key: string]: string } = {
      'hardhat': 'Hardhat',
      'foundry': 'Foundry',
      'truffle': 'Truffle',
      'ethers': 'Ethers.js',
      'web3': 'Web3.js',
      'wagmi': 'Wagmi',
      'viem': 'Viem',
      'next': 'Next.js',
      'react': 'React',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'express': 'Express.js',
      'nestjs': 'NestJS',
      'graphql': 'GraphQL',
      'ipfs': 'IPFS',
      'defi': 'DeFi',
      'nft': 'NFT',
      'dao': 'DAO',
      'smart-contract': 'Smart Contracts',
    };

    for (const repo of repos) {
      const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
      for (const [keyword, skill] of Object.entries(techKeywords)) {
        if (text.includes(keyword) && !skills.includes(skill)) {
          skills.push(skill);
          skillLevels[skill] = skillLevels[skill] || 'intermediate';
        }
      }
    }

    return { skills, skillLevels };
  }

  /**
   * Calculate quality score based on GitHub activity
   */
  private calculateQualityScore(activity: GitHubActivity): number {
    let score = 0;

    // Repo count (max 20 points)
    score += Math.min(activity.publicRepos / 10, 1) * 20;

    // Recent activity (max 30 points)
    const daysSinceLastActivity = activity.lastActivity
      ? (Date.now() - new Date(activity.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
      : 365;
    if (daysSinceLastActivity < 7) score += 30;
    else if (daysSinceLastActivity < 30) score += 20;
    else if (daysSinceLastActivity < 90) score += 10;

    // Language diversity (max 20 points)
    const languageCount = Object.keys(activity.languages).length;
    score += Math.min(languageCount / 5, 1) * 20;

    // Stars and forks (max 15 points)
    // This would require additional API calls, simplified for now
    score += 10;

    // Recent commits (max 15 points)
    if (activity.recentCommits > 10) score += 15;
    else if (activity.recentCommits > 5) score += 10;
    else if (activity.recentCommits > 0) score += 5;

    return Math.min(score / 100, 1); // Normalize to 0-1
  }

  /**
   * Analyze GitHub profile
   */
  async analyzeGitHubProfile(githubUrl: string): Promise<GitHubAnalysis> {
    const username = this.extractUsername(githubUrl);
    if (!username) {
      throw new Error('Invalid GitHub URL or username');
    }

    // Fetch repositories
    const repos = await this.getUserRepos(username);

    // Aggregate languages
    const languages = await this.aggregateLanguages(repos);

    // Calculate activity metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentRepos = repos.filter(
      (repo) => new Date(repo.pushed_at) > thirtyDaysAgo
    );

    const mostActiveRepo = repos.length > 0
      ? repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0].name
      : null;

    const lastActivity = repos.length > 0
      ? repos.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())[0].pushed_at
      : null;

    const activity: GitHubActivity = {
      totalCommits: 0, // Would require additional API calls
      recentCommits: recentRepos.length,
      totalRepos: repos.length,
      publicRepos: repos.length,
      languages,
      mostActiveRepo,
      lastActivity,
    };

    // Extract skills
    const { skills, skillLevels } = this.extractSkills(languages, repos);

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(activity);

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      repos: repos.slice(0, 20), // Limit to top 20 repos
      languages,
      activity,
      skills,
      skillLevels,
      qualityScore,
      lastAnalyzed: new Date(),
    };
  }

  /**
   * Update user's GitHub data in database
   */
  async updateUserGitHubData(
    userId: string,
    hackathonId: string,
    githubUrl: string
  ): Promise<void> {
    try {
      const analysis = await this.analyzeGitHubProfile(githubUrl);

      // Get or create matching profile
      const profile = await prisma.teamMatchingProfile.upsert({
        where: { userId },
        update: {
          githubUsername: analysis.username,
          githubUrl: analysis.profileUrl,
          githubData: {
            repos: analysis.repos,
            languages: analysis.languages,
            activity: analysis.activity,
            qualityScore: analysis.qualityScore,
          },
          githubAnalyzedAt: analysis.lastAnalyzed,
          // Update skills if not already set
          skills: {
            set: analysis.skills,
          },
          skillLevels: analysis.skillLevels,
        },
        create: {
          userId,
          hackathonId,
          githubUsername: analysis.username,
          githubUrl: analysis.profileUrl,
          githubData: {
            repos: analysis.repos,
            languages: analysis.languages,
            activity: analysis.activity,
            qualityScore: analysis.qualityScore,
          },
          githubAnalyzedAt: analysis.lastAnalyzed,
          skills: analysis.skills,
          skillLevels: analysis.skillLevels,
          isActive: true,
          isLookingForTeam: true,
        },
      });

      console.log(`Updated GitHub data for user ${userId}`);
    } catch (error: any) {
      console.error('Error updating GitHub data:', error);
      throw error;
    }
  }
}

