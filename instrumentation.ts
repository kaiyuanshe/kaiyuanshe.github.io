const { NEXT_RUNTIME } = process.env;

export async function register() {
  if (NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');

  if (NEXT_RUNTIME === 'edge') await import('./sentry.edge.config');
}
