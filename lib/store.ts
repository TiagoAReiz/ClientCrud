import { Client } from '@/types/client';

declare global {
  // eslint-disable-next-line no-var
  var __clientStore: Client[] | undefined;
}

function getStore(): Client[] {
  if (!global.__clientStore) {
    global.__clientStore = [];
  }
  return global.__clientStore;
}

export const store = {
  findAll(): Client[] {
    return [...getStore()];
  },

  findById(id: string): Client | undefined {
    return getStore().find((c) => c.id === id);
  },

  create(client: Client): Client {
    getStore().push(client);
    return { ...client };
  },

  update(id: string, patch: Partial<Omit<Client, 'id' | 'createdAt'>>): Client | null {
    const arr = getStore();
    const idx = arr.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch };
    return { ...arr[idx] };
  },

  delete(id: string): boolean {
    const arr = getStore();
    const idx = arr.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  },
};
