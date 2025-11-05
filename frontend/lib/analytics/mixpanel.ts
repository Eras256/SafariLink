import mixpanel from 'mixpanel-browser';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  });
}

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      mixpanel.track(event, properties);
    }
  },

  identify: (userId: string) => {
    if (typeof window !== 'undefined') {
      mixpanel.identify(userId);
    }
  },

  setUserProperties: (properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      mixpanel.people.set(properties);
    }
  },

  // Hackathon events
  trackHackathonRegistration: (hackathonId: string, hackathonName: string) => {
    analytics.track('Hackathon Registration', {
      hackathonId,
      hackathonName,
      timestamp: new Date().toISOString(),
    });
  },

  trackProjectSubmission: (projectId: string, hackathonId: string) => {
    analytics.track('Project Submission', {
      projectId,
      hackathonId,
      timestamp: new Date().toISOString(),
    });
  },

  trackGrantApplication: (grantProgram: string, amount: number) => {
    analytics.track('Grant Application', {
      grantProgram,
      amount,
      timestamp: new Date().toISOString(),
    });
  },

  trackWalletConnection: (address: string, chainId: number) => {
    analytics.track('Wallet Connected', {
      address: address.slice(0, 10) + '...', // Privacy
      chainId,
    });
  },
};

