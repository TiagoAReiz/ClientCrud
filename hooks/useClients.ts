'use client';

import { useState, useCallback } from 'react';
import { Client, CreateClientDTO, UpdateClientDTO } from '@/types/client';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Falha ao buscar clientes.');
      const data: Client[] = await res.json();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClient = useCallback(async (dto: CreateClientDTO): Promise<void> => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Erro ao criar cliente.');
    }
    await fetchClients();
  }, [fetchClients]);

  const updateClient = useCallback(async (id: string, dto: UpdateClientDTO): Promise<void> => {
    const res = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Erro ao atualizar cliente.');
    }
    await fetchClients();
  }, [fetchClients]);

  const deleteClient = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Erro ao excluir cliente.');
    }
    await fetchClients();
  }, [fetchClients]);

  return { clients, isLoading, error, fetchClients, createClient, updateClient, deleteClient };
}
