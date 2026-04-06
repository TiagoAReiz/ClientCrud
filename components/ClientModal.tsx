'use client';

import { useState, useEffect, FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Client, CreateClientDTO } from '@/types/client';
import { validateClientDTO } from '@/lib/validations';

interface ClientModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  client?: Client;
  onClose: () => void;
  onSubmit: (data: CreateClientDTO) => Promise<void>;
}

const emptyForm = { name: '', email: '', phone: '' };

export default function ClientModal({ isOpen, mode, client, onClose, onSubmit }: ClientModalProps) {
  const [form, setForm] = useState<CreateClientDTO>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(mode === 'edit' && client ? { name: client.name, email: client.email, phone: client.phone } : emptyForm);
      setErrors({});
    }
  }, [isOpen, mode, client]);

  function handleChange(field: keyof CreateClientDTO) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateClientDTO(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim() });
      onClose();
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : 'Erro ao salvar cliente.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors._form && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{errors._form}</p>
        )}
        <Input
          label="Nome"
          id="client-name"
          type="text"
          placeholder="João Silva"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoFocus
        />
        <Input
          label="E-mail"
          id="client-email"
          type="email"
          placeholder="joao@exemplo.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <Input
          label="Telefone"
          id="client-phone"
          type="tel"
          placeholder="+55 11 99999-9999"
          value={form.phone}
          onChange={handleChange('phone')}
          error={errors.phone}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {mode === 'create' ? 'Criar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
