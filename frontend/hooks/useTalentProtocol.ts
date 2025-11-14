'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { TalentProtocolProfile } from '@/lib/talent-protocol/talentProtocol';

interface UseTalentProtocolReturn {
  profile: TalentProtocolProfile | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  syncProfile: () => Promise<void>;
}

export function useTalentProtocol(addressOverride?: string): UseTalentProtocolReturn {
  const { address: wagmiAddress } = useAccount();
  const address = (addressOverride || wagmiAddress)?.toLowerCase();

  const [profile, setProfile] = useState<TalentProtocolProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!address);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!address) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use direct Next.js endpoint (without proxy/backend)
      const fetchUrl = `/api/talent-protocol/profile/by-address?address=${encodeURIComponent(address)}`;
      console.log('Fetching Talent Protocol profile:', { address, fetchUrl });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

      const response = await fetch(fetchUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch {
        // If parsing fails, treat as error
        if (response.status === 404) {
          setProfile(null);
          setLoading(false);
          setError(null);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (response.status === 404) {
        setProfile(null);
        setLoading(false);
        setError(null); // 404 is not an error, just means no profile exists
        return;
      }

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Failed to fetch Talent Protocol profile';
        throw new Error(errorMessage);
      }
      
      setProfile(data.profile);
      setError(null); // Clear errors on success
    } catch (err: any) {
      console.error('Error fetching Talent Protocol profile:', err);
      
      // Improve error messages
      let errorMessage = err.message || 'Error fetching Talent Protocol profile';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Could not connect to server. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const syncProfile = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Use direct Next.js endpoint (without proxy/backend)
      const syncUrl = '/api/talent-protocol/sync-address';
      console.log('Syncing Talent Protocol profile:', { address, syncUrl });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds for sync

      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch {
        // If parsing fails, treat as error
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Failed to sync Talent Protocol profile';
        throw new Error(errorMessage);
      }

      console.log('Sync response:', data);
      
      // Use the profile returned from sync directly
      if (data.profile) {
        setProfile(data.profile);
        setError(null); // Clear any previous errors
      } else if (data.hasProfile === false) {
        // Explicitly no profile found
        setProfile(null);
        setError('No Talent Protocol profile found for this address. Make sure you have created a profile on Talent Protocol with this wallet address.');
      } else {
        // If no profile returned, fetch it
        await fetchProfile();
      }
    } catch (err: any) {
      console.error('Error syncing Talent Protocol profile:', err);
      
      // Improve error messages
      let errorMessage = 'Error syncing Talent Protocol profile';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'Sync timed out. Please try again.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Could not connect to server. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address, fetchProfile]);

  return {
    profile,
    loading,
    error,
    hasProfile: profile !== null,
    syncProfile,
  };
}

