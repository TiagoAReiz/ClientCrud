export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; // ISO 8601
}

export type CreateClientDTO = Omit<Client, 'id' | 'createdAt'>;
export type UpdateClientDTO = Partial<CreateClientDTO>;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
