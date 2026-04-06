import { store } from '@/lib/store';
import { validateClientDTO, sanitizeClientDTO } from '@/lib/validations';

export async function GET(): Promise<Response> {
  const clients = store.findAll();
  return Response.json(clients);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const validation = validateClientDTO(body);
  if (!validation.valid) {
    return Response.json({ error: 'Dados inválidos.', errors: validation.errors }, { status: 400 });
  }

  const dto = sanitizeClientDTO(body as Record<string, unknown>);
  const client = store.create({
    id: crypto.randomUUID(),
    ...dto,
    createdAt: new Date().toISOString(),
  });

  return Response.json(client, { status: 201 });
}
