import Link from 'next/link';

export function Footer() {
  return (
    <footer className="glassmorphic border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold gradient-text">SafariLink</span>
            </div>
            <p className="text-white/60 text-sm">
              Empowering Web3 Builders Worldwide
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                Twitter
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                Discord
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hackathons" className="text-white/60 hover:text-white transition text-sm">
                  Browse Hackathons
                </Link>
              </li>
              <li>
                <Link href="/hackathons/create" className="text-white/60 hover:text-white transition text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white/60 hover:text-white transition text-sm">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/grants" className="text-white/60 hover:text-white transition text-sm">
                  Grant Opportunities
                </Link>
              </li>
              <li>
                <Link href="/dao" className="text-white/60 hover:text-white transition text-sm">
                  Builder DAO
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-white/60 hover:text-white transition text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-white/60 hover:text-white transition text-sm">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-white/60 hover:text-white transition text-sm">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/60 hover:text-white transition text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-white/60 hover:text-white transition text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-white transition text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-white/60 hover:text-white transition text-sm">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white transition text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 SafariLink Platform. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-2 md:mt-0">
            Built on Arbitrum, Base, and Optimism
          </p>
        </div>
      </div>
    </footer>
  );
}

