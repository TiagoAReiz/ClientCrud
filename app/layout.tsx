import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClientCrud',
  description: 'Gerenciamento de clientes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
