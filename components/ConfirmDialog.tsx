'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Confirmar exclusão',
  message = 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Excluir
        </Button>
      </div>
    </Modal>
  );
}
