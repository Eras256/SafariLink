'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { TalentProtocolProfile } from '@/lib/talent-protocol/talentProtocol';
import { getApiUrl, getApiEndpoint } from '@/lib/api/config';
import { API_ENDPOINTS } from '@/lib/constants';

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

  const apiUrl = getApiUrl();

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

      const fetchUrl = getApiEndpoint(API_ENDPOINTS.TALENT_PROTOCOL.PROFILE_BY_ADDRESS(address));
      console.log('Obteniendo perfil de Talent Protocol:', { address, fetchUrl });

      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const response = await fetch(fetchUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        setProfile(null);
        setLoading(false);
        setError(null); // 404 is not an error, just means no profile exists
        return;
      }

      if (!response.ok) {
        let errorMessage = 'Failed to fetch Talent Protocol profile';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setProfile(data.profile);
      setError(null); // Clear errors on success
    } catch (err: any) {
      console.error('Error fetching Talent Protocol profile:', err);
      
      // Mejorar mensajes de error
      let errorMessage = err.message || 'Error al obtener el perfil de Talent Protocol';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'La solicitud tardó demasiado. Por favor intenta de nuevo.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        // Verificar si es un error del proxy (backend no configurado)
        if (err.message.includes('Backend not configured') || err.message.includes('503')) {
          errorMessage = 'El backend no está configurado en producción. Esta funcionalidad requiere un backend desplegado.';
        } else {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
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

      const syncUrl = getApiEndpoint(API_ENDPOINTS.TALENT_PROTOCOL.SYNC_ADDRESS);
      console.log('Sincronizando perfil de Talent Protocol:', { address, syncUrl });

      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos para sync

      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Failed to sync Talent Protocol profile';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Si no se puede parsear el JSON, usar el status
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Respuesta de sincronización:', data);
      
      // Use the profile returned from sync directly
      if (data.profile) {
        setProfile(data.profile);
        setError(null); // Clear any previous errors
      } else if (data.hasProfile === false) {
        // Explicitly no profile found
        setProfile(null);
        setError('No se encontró un perfil de Talent Protocol para esta dirección. Asegúrate de haber creado un perfil en Talent Protocol con esta dirección de wallet.');
      } else {
        // If no profile returned, fetch it
        await fetchProfile();
      }
    } catch (err: any) {
      console.error('Error syncing Talent Protocol profile:', err);
      
      // Mejorar mensajes de error
      let errorMessage = 'Error al sincronizar el perfil de Talent Protocol';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'La sincronización tardó demasiado. Por favor intenta de nuevo.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        // Verificar si es un error del proxy (backend no configurado)
        if (err.message.includes('Backend not configured') || err.message.includes('503')) {
          errorMessage = 'El backend no está configurado en producción. Esta funcionalidad requiere un backend desplegado.';
        } else {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
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

