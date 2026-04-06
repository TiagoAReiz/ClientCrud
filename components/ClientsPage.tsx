'use client';

import { useEffect, useState } from 'react';
import { Client, CreateClientDTO } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import ClientTable from '@/components/ClientTable';
import ClientModal from '@/components/ClientModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/ui/Button';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  client?: Client;
}

interface ConfirmState {
  isOpen: boolean;
  clientId?: string;
  isDeleting: boolean;
}

export default function ClientsPage() {
  const { clients, isLoading, error, fetchClients, createClient, updateClient, deleteClient } = useClients();

  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'create' });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, isDeleting: false });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  function openCreate() {
    setModal({ isOpen: true, mode: 'create', client: undefined });
  }

  function openEdit(client: Client) {
    setModal({ isOpen: true, mode: 'edit', client });
  }

  function openDelete(id: string) {
    setConfirm({ isOpen: true, clientId: id, isDeleting: false });
  }

  async function handleSubmit(data: CreateClientDTO) {
    if (modal.mode === 'create') {
      await createClient(data);
    } else if (modal.client) {
      await updateClient(modal.client.id, data);
    }
  }

  async function handleConfirmDelete() {
    if (!confirm.clientId) return;
    setConfirm((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteClient(confirm.clientId);
      setConfirm({ isOpen: false, isDeleting: false });
    } catch {
      setConfirm((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {!isLoading && `${clients.length} cliente${clients.length !== 1 ? 's' : ''} cadastrado${clients.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button onClick={openCreate}>+ Novo Cliente</Button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={fetchClients} className="ml-2 underline hover:no-underline">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Table */}
        <ClientTable clients={clients} isLoading={isLoading} onEdit={openEdit} onDelete={openDelete} />
      </div>

      {/* Create / Edit Modal */}
      <ClientModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        client={modal.client}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        isLoading={confirm.isDeleting}
      />
    </main>
  );
}
