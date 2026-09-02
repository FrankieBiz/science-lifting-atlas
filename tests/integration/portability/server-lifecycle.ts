import type { Server } from 'node:http';

export async function closeServer(server?: Server): Promise<void> {
  if (!server) return;

  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
