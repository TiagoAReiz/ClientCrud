import { store } from '@/lib/store';
import { validateClientDTO, sanitizeClientDTO } from '@/lib/validations';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const client = store.findById(id);
  if (!client) {
    return Response.json({ error: 'Cliente não encontrado.' }, { status: 404 });
  }
  return Response.json(client);
}

export async function PUT(request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;

  if (!store.findById(id)) {
    return Response.json({ error: 'Cliente não encontrado.' }, { status: 404 });
  }

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
  const updated = store.update(id, dto);
  return Response.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const deleted = store.delete(id);
  if (!deleted) {
    return Response.json({ error: 'Cliente não encontrado.' }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
