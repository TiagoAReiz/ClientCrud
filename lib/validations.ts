import { CreateClientDTO } from '@/types/client';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-().]{7,20}$/;

export function validateClientDTO(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: { _form: 'Dados inválidos.' } };
  }

  const d = data as Record<string, unknown>;

  if (!d.name || typeof d.name !== 'string' || d.name.trim().length === 0) {
    errors.name = 'Nome é obrigatório.';
  } else if (d.name.trim().length > 100) {
    errors.name = 'Nome deve ter no máximo 100 caracteres.';
  }

  if (!d.email || typeof d.email !== 'string' || d.email.trim().length === 0) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!EMAIL_REGEX.test(d.email.trim())) {
    errors.email = 'E-mail inválido.';
  }

  if (!d.phone || typeof d.phone !== 'string' || d.phone.trim().length === 0) {
    errors.phone = 'Telefone é obrigatório.';
  } else if (!PHONE_REGEX.test(d.phone.trim())) {
    errors.phone = 'Telefone inválido (mín. 7 dígitos).';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeClientDTO(data: Record<string, unknown>): CreateClientDTO {
  return {
    name: String(data.name).trim(),
    email: String(data.email).trim().toLowerCase(),
    phone: String(data.phone).trim(),
  };
}
