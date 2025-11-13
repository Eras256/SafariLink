-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "ens" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "location" TEXT,
    "timezone" TEXT,
    "builderScore" INTEGER NOT NULL DEFAULT 0,
    "humanPassportScore" REAL,
    "worldIdVerified" BOOLEAN NOT NULL DEFAULT false,
    "talentProtocolId" TEXT,
    "talentProtocolUsername" TEXT,
    "talentProtocolVerified" BOOLEAN NOT NULL DEFAULT false,
    "talentTokenBalance" TEXT,
    "talentSupporterCount" INTEGER NOT NULL DEFAULT 0,
    "talentTotalRaised" TEXT,
    "talentProtocolScore" INTEGER NOT NULL DEFAULT 0,
    "talentProtocolSyncedAt" DATETIME,
    "talentProtocolData" TEXT,
    "kycStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "kycProvider" TEXT,
    "kycData" TEXT,
    "taxCountry" TEXT,
    "ofacScreened" BOOLEAN NOT NULL DEFAULT false,
    "ofacScreenedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    "gamificationScore" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Hackathon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "bannerImage" TEXT,
    "logoImage" TEXT,
    "organizerId" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerEmail" TEXT NOT NULL,
    "organizerWallet" TEXT NOT NULL,
    "registrationStart" DATETIME NOT NULL,
    "registrationEnd" DATETIME NOT NULL,
    "eventStart" DATETIME NOT NULL,
    "eventEnd" DATETIME NOT NULL,
    "submissionDeadline" DATETIME NOT NULL,
    "judgingStart" DATETIME NOT NULL,
    "judgingEnd" DATETIME NOT NULL,
    "winnersAnnounced" DATETIME,
    "locationType" TEXT NOT NULL,
    "location" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "chains" TEXT NOT NULL,
    "totalPrizePool" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDC',
    "prizeDistribution" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "minTeamSize" INTEGER NOT NULL DEFAULT 1,
    "maxTeamSize" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT NOT NULL,
    "sponsors" TEXT,
    "judges" TEXT,
    "schedule" TEXT,
    "resources" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hackathonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prizeAmount" TEXT NOT NULL,
    CONSTRAINT "Track_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HackathonRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" DATETIME,
    "teamId" TEXT,
    "teamRole" TEXT,
    "applicationData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HackathonRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HackathonRegistration_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HackathonRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "hackathonId" TEXT NOT NULL,
    "trackId" TEXT,
    "teamId" TEXT,
    "creatorId" TEXT NOT NULL,
    "demoUrl" TEXT,
    "videoUrl" TEXT,
    "githubUrl" TEXT,
    "figmaUrl" TEXT,
    "contracts" TEXT,
    "techStack" TEXT NOT NULL,
    "judgeScores" TEXT,
    "finalScore" REAL,
    "rank" INTEGER,
    "prizeWon" TEXT,
    "plagiarismScore" REAL,
    "plagiarismReport" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedAt" DATETIME,
    "continued" BOOLEAN NOT NULL DEFAULT false,
    "fundingRaised" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Project_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "feedbackType" TEXT NOT NULL DEFAULT 'COMMENT',
    "userRole" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrantApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "grantProgram" TEXT NOT NULL,
    "amountRequested" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "milestones" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedAt" DATETIME,
    "decidedAt" DATETIME,
    "amountApproved" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GrantApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GrantApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NetworkingRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hackathonId" TEXT NOT NULL,
    "trackId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "track" TEXT,
    "roomType" TEXT NOT NULL DEFAULT 'GENERAL',
    "maxParticipants" INTEGER DEFAULT 50,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "videoEnabled" BOOLEAN NOT NULL DEFAULT true,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NetworkingRoom_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NetworkingRoom_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    "videoEnabled" BOOLEAN NOT NULL DEFAULT true,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "peerId" TEXT,
    "streamId" TEXT,
    "metadata" TEXT,
    CONSTRAINT "RoomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomParticipant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "NetworkingRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'TEXT',
    "attachments" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RoomMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "NetworkingRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BreakoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "parentRoomId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxParticipants" INTEGER DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "metadata" TEXT,
    CONSTRAINT "BreakoutSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "NetworkingRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BreakoutSession_parentRoomId_fkey" FOREIGN KEY ("parentRoomId") REFERENCES "NetworkingRoom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hackathonId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "badgeType" TEXT NOT NULL,
    "requirement" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "nftReward" BOOLEAN NOT NULL DEFAULT false,
    "nftMetadata" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Badge_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "hackathonId" TEXT,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nftTokenId" TEXT,
    "nftTxHash" TEXT,
    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hackathonId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "challengeType" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 50,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isDaily" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nftReward" BOOLEAN NOT NULL DEFAULT false,
    "nftMetadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Challenge_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "hackathonId" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointsEarned" INTEGER NOT NULL,
    "nftTokenId" TEXT,
    "nftTxHash" TEXT,
    CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallenge_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "badgeCount" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "challengeCount" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "previousRank" INTEGER,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeaderboardEntry_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMatchingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "skillLevels" TEXT,
    "githubUsername" TEXT,
    "githubUrl" TEXT,
    "githubData" TEXT,
    "githubAnalyzedAt" DATETIME,
    "lookingFor" TEXT NOT NULL,
    "preferredRole" TEXT,
    "teamSize" TEXT,
    "availability" TEXT,
    "availableHours" TEXT,
    "bio" TEXT,
    "experience" TEXT,
    "previousProjects" TEXT,
    "interests" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isLookingForTeam" BOOLEAN NOT NULL DEFAULT true,
    "aiAnalysis" TEXT,
    "lastAnalyzedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeamMatchingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMatchingProfile_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "matchScore" REAL NOT NULL,
    "skillScore" REAL NOT NULL,
    "timezoneScore" REAL NOT NULL,
    "githubScore" REAL,
    "aiReasoning" TEXT,
    "strengths" TEXT NOT NULL,
    "considerations" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "senderAction" TEXT,
    "receiverAction" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "respondedAt" DATETIME,
    CONSTRAINT "TeamMatch_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMatch_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMatch_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_builderScore_idx" ON "User"("builderScore");

-- CreateIndex
CREATE INDEX "User_gamificationScore_idx" ON "User"("gamificationScore");

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_slug_key" ON "Hackathon"("slug");

-- CreateIndex
CREATE INDEX "Hackathon_status_idx" ON "Hackathon"("status");

-- CreateIndex
CREATE INDEX "Hackathon_eventStart_idx" ON "Hackathon"("eventStart");

-- CreateIndex
CREATE INDEX "Track_hackathonId_idx" ON "Track"("hackathonId");

-- CreateIndex
CREATE INDEX "HackathonRegistration_hackathonId_idx" ON "HackathonRegistration"("hackathonId");

-- CreateIndex
CREATE INDEX "HackathonRegistration_teamId_idx" ON "HackathonRegistration"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonRegistration_userId_hackathonId_key" ON "HackathonRegistration"("userId", "hackathonId");

-- CreateIndex
CREATE INDEX "Team_hackathonId_idx" ON "Team"("hackathonId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_hackathonId_idx" ON "Project"("hackathonId");

-- CreateIndex
CREATE INDEX "Project_trackId_idx" ON "Project"("trackId");

-- CreateIndex
CREATE INDEX "Project_teamId_idx" ON "Project"("teamId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Vote_projectId_idx" ON "Vote"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_projectId_key" ON "Vote"("userId", "projectId");

-- CreateIndex
CREATE INDEX "Comment_projectId_idx" ON "Comment"("projectId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_feedbackType_idx" ON "Comment"("feedbackType");

-- CreateIndex
CREATE INDEX "Comment_userRole_idx" ON "Comment"("userRole");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "GrantApplication_projectId_idx" ON "GrantApplication"("projectId");

-- CreateIndex
CREATE INDEX "GrantApplication_status_idx" ON "GrantApplication"("status");

-- CreateIndex
CREATE INDEX "NetworkingRoom_hackathonId_idx" ON "NetworkingRoom"("hackathonId");

-- CreateIndex
CREATE INDEX "NetworkingRoom_trackId_idx" ON "NetworkingRoom"("trackId");

-- CreateIndex
CREATE INDEX "NetworkingRoom_isActive_idx" ON "NetworkingRoom"("isActive");

-- CreateIndex
CREATE INDEX "RoomParticipant_roomId_idx" ON "RoomParticipant"("roomId");

-- CreateIndex
CREATE INDEX "RoomParticipant_userId_idx" ON "RoomParticipant"("userId");

-- CreateIndex
CREATE INDEX "RoomParticipant_isActive_idx" ON "RoomParticipant"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_roomId_userId_key" ON "RoomParticipant"("roomId", "userId");

-- CreateIndex
CREATE INDEX "RoomMessage_roomId_idx" ON "RoomMessage"("roomId");

-- CreateIndex
CREATE INDEX "RoomMessage_userId_idx" ON "RoomMessage"("userId");

-- CreateIndex
CREATE INDEX "RoomMessage_createdAt_idx" ON "RoomMessage"("createdAt");

-- CreateIndex
CREATE INDEX "BreakoutSession_roomId_idx" ON "BreakoutSession"("roomId");

-- CreateIndex
CREATE INDEX "BreakoutSession_parentRoomId_idx" ON "BreakoutSession"("parentRoomId");

-- CreateIndex
CREATE INDEX "BreakoutSession_isActive_idx" ON "BreakoutSession"("isActive");

-- CreateIndex
CREATE INDEX "Badge_hackathonId_idx" ON "Badge"("hackathonId");

-- CreateIndex
CREATE INDEX "Badge_badgeType_idx" ON "Badge"("badgeType");

-- CreateIndex
CREATE INDEX "Badge_rarity_idx" ON "Badge"("rarity");

-- CreateIndex
CREATE INDEX "Badge_isActive_idx" ON "Badge"("isActive");

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE INDEX "UserBadge_hackathonId_idx" ON "UserBadge"("hackathonId");

-- CreateIndex
CREATE INDEX "UserBadge_earnedAt_idx" ON "UserBadge"("earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_hackathonId_key" ON "UserBadge"("userId", "badgeId", "hackathonId");

-- CreateIndex
CREATE INDEX "Challenge_hackathonId_idx" ON "Challenge"("hackathonId");

-- CreateIndex
CREATE INDEX "Challenge_challengeType_idx" ON "Challenge"("challengeType");

-- CreateIndex
CREATE INDEX "Challenge_startDate_idx" ON "Challenge"("startDate");

-- CreateIndex
CREATE INDEX "Challenge_endDate_idx" ON "Challenge"("endDate");

-- CreateIndex
CREATE INDEX "Challenge_isActive_idx" ON "Challenge"("isActive");

-- CreateIndex
CREATE INDEX "UserChallenge_userId_idx" ON "UserChallenge"("userId");

-- CreateIndex
CREATE INDEX "UserChallenge_challengeId_idx" ON "UserChallenge"("challengeId");

-- CreateIndex
CREATE INDEX "UserChallenge_hackathonId_idx" ON "UserChallenge"("hackathonId");

-- CreateIndex
CREATE INDEX "UserChallenge_completedAt_idx" ON "UserChallenge"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallenge_userId_challengeId_hackathonId_key" ON "UserChallenge"("userId", "challengeId", "hackathonId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_userId_idx" ON "LeaderboardEntry"("userId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_hackathonId_idx" ON "LeaderboardEntry"("hackathonId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_totalScore_idx" ON "LeaderboardEntry"("totalScore");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_rank_idx" ON "LeaderboardEntry"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_hackathonId_key" ON "LeaderboardEntry"("userId", "hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMatchingProfile_userId_key" ON "TeamMatchingProfile"("userId");

-- CreateIndex
CREATE INDEX "TeamMatchingProfile_hackathonId_idx" ON "TeamMatchingProfile"("hackathonId");

-- CreateIndex
CREATE INDEX "TeamMatchingProfile_userId_idx" ON "TeamMatchingProfile"("userId");

-- CreateIndex
CREATE INDEX "TeamMatchingProfile_isActive_idx" ON "TeamMatchingProfile"("isActive");

-- CreateIndex
CREATE INDEX "TeamMatchingProfile_isLookingForTeam_idx" ON "TeamMatchingProfile"("isLookingForTeam");

-- CreateIndex
CREATE INDEX "TeamMatchingProfile_createdAt_idx" ON "TeamMatchingProfile"("createdAt");

-- CreateIndex
CREATE INDEX "TeamMatch_senderId_idx" ON "TeamMatch"("senderId");

-- CreateIndex
CREATE INDEX "TeamMatch_receiverId_idx" ON "TeamMatch"("receiverId");

-- CreateIndex
CREATE INDEX "TeamMatch_hackathonId_idx" ON "TeamMatch"("hackathonId");

-- CreateIndex
CREATE INDEX "TeamMatch_status_idx" ON "TeamMatch"("status");

-- CreateIndex
CREATE INDEX "TeamMatch_matchScore_idx" ON "TeamMatch"("matchScore");

-- CreateIndex
CREATE INDEX "TeamMatch_createdAt_idx" ON "TeamMatch"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMatch_senderId_receiverId_hackathonId_key" ON "TeamMatch"("senderId", "receiverId", "hackathonId");
