'use client';

import { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const accentBars = [
  'bg-primary-container',
  'bg-primary-fixed-dim',
  'bg-primary',
  'bg-secondary-container',
];

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 animate-pulse">
      <div className="w-12 h-1 bg-surface-container-highest rounded-full mb-4" />
      <div className="h-6 w-2/3 bg-surface-container-highest rounded-lg mb-2" />
      <div className="h-3 w-1/3 bg-surface-container-high rounded mb-6" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-surface-container-high rounded" />
        <div className="h-4 w-3/4 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

export default function ClientTable({ clients, isLoading, onEdit, onDelete }: ClientTableProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary text-4xl">person_search</span>
        </div>
        <p className="text-on-surface font-bold text-lg mb-1">Nenhum cliente ainda</p>
        <p className="text-on-surface-variant text-sm">Clique em &quot;+&quot; para adicionar o primeiro cliente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clients.map((client, idx) => (
        <div
          key={client.id}
          className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0px_12px_32px_rgba(0,61,155,0.04)] hover:shadow-[0px_20px_48px_rgba(0,61,155,0.08)] transition-all duration-300 border border-outline-variant/10 hover:border-primary/20 group relative overflow-hidden"
        >
          {/* Edit / Delete buttons (appear on hover) */}
          <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(client)}
              className="p-2 text-primary hover:bg-primary-fixed rounded-xl transition-colors"
              aria-label="Editar"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              onClick={() => onDelete(client)}
              className="p-2 text-error hover:bg-error-container/50 rounded-xl transition-colors"
              aria-label="Excluir"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>

          {/* Accent bar */}
          <div className={`w-12 h-1 ${accentBars[idx % accentBars.length]} rounded-full mb-4`} />

          {/* Name */}
          <h3 className="text-xl font-bold text-on-surface mb-1 pr-16">{client.name}</h3>

          {/* Contact info */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-primary/70">mail</span>
              <span className="text-sm font-medium truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-primary/70">call</span>
              <span className="text-sm font-medium">{client.phone}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
