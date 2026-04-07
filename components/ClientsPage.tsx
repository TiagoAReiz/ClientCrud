'use client';

import { useEffect, useState, useMemo } from 'react';
import { Client, CreateClientDTO } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import ClientTable from '@/components/ClientTable';
import ClientModal from '@/components/ClientModal';
import ConfirmDialog from '@/components/ConfirmDialog';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  client?: Client;
}

interface ConfirmState {
  isOpen: boolean;
  client?: Client;
  isDeleting: boolean;
}

export default function ClientsPage() {
  const { clients, isLoading, error, fetchClients, createClient, updateClient, deleteClient } = useClients();

  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'create' });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, isDeleting: false });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [clients, search]);

  function openCreate() {
    setModal({ isOpen: true, mode: 'create', client: undefined });
  }

  function openEdit(client: Client) {
    setModal({ isOpen: true, mode: 'edit', client });
  }

  function openDelete(client: Client) {
    setConfirm({ isOpen: true, client, isDeleting: false });
  }

  async function handleSubmit(data: CreateClientDTO) {
    if (modal.mode === 'create') {
      await createClient(data);
    } else if (modal.client) {
      await updateClient(modal.client.id, data);
    }
  }

  async function handleConfirmDelete() {
    if (!confirm.client) return;
    setConfirm((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteClient(confirm.client!.id);
      setConfirm({ isOpen: false, isDeleting: false });
    } catch {
      setConfirm((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full">
              <span className="material-symbols-outlined text-primary">people</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-on-surface">Clientes</h1>
          </div>
          <div className="flex items-center gap-1">
            {!isLoading && (
              <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-8">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">CRM</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mt-1 mb-2">
            Meus Clientes
          </h2>
          <div className="h-1.5 w-16 bg-primary rounded-full" />
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative flex items-center bg-primary-fixed/40 border border-outline-variant/30 rounded-2xl px-5 py-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-primary/5">
            <span className="material-symbols-outlined text-primary mr-3">search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 w-full text-on-surface placeholder:text-on-surface-variant/50 font-medium text-sm"
              placeholder="Buscar por nome, e-mail ou telefone..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-2xl bg-error-container border border-error/20 px-5 py-4 text-sm text-on-error-container flex items-center gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <span className="flex-1">{error}</span>
            <button onClick={fetchClients} className="font-bold underline hover:no-underline">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Card Grid */}
        <ClientTable
          clients={filtered}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </main>

      {/* FAB */}
      <button
        onClick={openCreate}
        className="fixed bottom-32 right-6 w-16 h-16 rounded-2xl bg-primary text-on-primary shadow-[0px_16px_32px_rgba(0,61,155,0.3)] hover:shadow-[0px_20px_40px_rgba(0,61,155,0.4)] active:scale-90 transition-all z-40 flex items-center justify-center border border-white/20"
        aria-label="Novo cliente"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-white/95 backdrop-blur-2xl rounded-t-[2rem] shadow-[0px_-8px_32px_rgba(0,61,155,0.06)] border-t border-outline-variant/10 z-40">
        <NavItem icon="dashboard" label="Portfolio" />
        <NavItem icon="list_alt" label="Activity" active filled />
        <NavItem icon="insights" label="Analytics" />
        <NavItem icon="settings" label="Settings" />
      </nav>

      {/* Modals */}
      <ClientModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        client={modal.client}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        isLoading={confirm.isDeleting}
        clientName={confirm.client?.name}
      />
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  filled = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
  filled?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-colors cursor-pointer ${
        active ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      <span
        className="material-symbols-outlined text-[26px]"
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wider uppercase">{label}</span>
    </div>
  );
}
