'use client';

import { useState, useEffect, FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
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
      setForm(
        mode === 'edit' && client
          ? { name: client.name, email: client.email, phone: client.phone }
          : emptyForm
      );
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
      <form onSubmit={handleSubmit} noValidate className="px-8 pb-10 space-y-6">
        {errors._form && (
          <p className="text-sm text-error bg-error-container/50 border border-error/20 rounded-xl px-4 py-3">
            {errors._form}
          </p>
        )}

        <Input
          label="Nome completo"
          id="client-name"
          type="text"
          placeholder="Ex: Rodrigo Andrade"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoFocus
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="E-mail"
            id="client-email"
            type="email"
            placeholder="nome@empresa.com"
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
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-on-primary bg-primary shadow-[0px_8px_24px_rgba(0,61,155,0.2)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {mode === 'create' ? 'Salvar' : 'Atualizar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-primary bg-primary-fixed/50 hover:bg-primary-fixed transition-colors active:scale-[0.98] disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
