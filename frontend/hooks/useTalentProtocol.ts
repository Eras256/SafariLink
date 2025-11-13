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

      // Parsear respuesta primero para verificar si es un error del proxy
      let data;
      try {
        data = await response.json();
      } catch {
        // Si no se puede parsear, tratar como error
        if (response.status === 404) {
          setProfile(null);
          setLoading(false);
          setError(null);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Verificar si es un error del proxy (backend no disponible)
      if (data.error === 'Backend not available' || data.error === 'Backend not configured' || data.error === 'Proxy error') {
        setError(null); // No mostrar error, simplemente no hay backend
        setProfile(null);
        setLoading(false);
        return; // Salir silenciosamente
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
      
      // Intentar parsear el error si viene del proxy
      let errorData;
      try {
        if (err.response) {
          errorData = await err.response.json();
        }
      } catch {
        // No se puede parsear
      }
      
      // Si es un error del proxy indicando que no hay backend, no mostrar error
      if (errorData?.error === 'Backend not available' || errorData?.error === 'Backend not configured') {
        setError(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      // Mejorar mensajes de error
      let errorMessage = err.message || 'Error al obtener el perfil de Talent Protocol';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'La solicitud tardó demasiado. Por favor intenta de nuevo.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        // Verificar si es un error del proxy (backend no configurado)
        if (err.message.includes('Backend not configured') || err.message.includes('Backend not available') || err.message.includes('503')) {
          // No mostrar error, simplemente no hay backend disponible
          setError(null);
          setProfile(null);
          setLoading(false);
          return;
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

      // Parsear respuesta primero para verificar si es un error del proxy
      let data;
      try {
        data = await response.json();
      } catch {
        // Si no se puede parsear, tratar como error
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        throw new Error('Invalid response from server');
      }

      // Verificar si es un error del proxy (backend no disponible)
      if (data.error === 'Backend not available' || data.error === 'Backend not configured' || data.error === 'Proxy error') {
        setError(null); // No mostrar error
        setProfile(null);
        setLoading(false);
        return; // Salir silenciosamente
      }

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Failed to sync Talent Protocol profile';
        throw new Error(errorMessage);
      }

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
      
      // Intentar parsear el error si viene del proxy
      let errorData;
      try {
        if (err.response) {
          errorData = await err.response.json();
        }
      } catch {
        // No se puede parsear
      }
      
      // Si es un error del proxy indicando que no hay backend, no mostrar error
      if (errorData?.error === 'Backend not available' || errorData?.error === 'Backend not configured') {
        setError(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      // Mejorar mensajes de error
      let errorMessage = 'Error al sincronizar el perfil de Talent Protocol';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'La sincronización tardó demasiado. Por favor intenta de nuevo.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        // Verificar si es un error del proxy (backend no configurado)
        if (err.message.includes('Backend not configured') || err.message.includes('Backend not available') || err.message.includes('503')) {
          // No mostrar error, simplemente no hay backend disponible
          setError(null);
          setProfile(null);
          setLoading(false);
          return;
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

