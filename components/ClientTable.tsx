'use client';

import { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso));
}

export default function ClientTable({ clients, isLoading, onEdit, onDelete }: ClientTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {['Nome', 'E-mail', 'Telefone', 'Criado em', 'Ações'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 rounded bg-gray-200 animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                Nenhum cliente cadastrado. Clique em &quot;Novo Cliente&quot; para adicionar.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{client.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{client.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(client)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
