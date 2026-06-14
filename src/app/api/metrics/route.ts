import { NextResponse } from 'next/server';
import client from 'prom-client';

const globalForMetrics = global as typeof globalThis & {
  registry: client.Registry;
};

if (!globalForMetrics.registry) {
  globalForMetrics.registry = new client.Registry();
  client.collectDefaultMetrics({ register: globalForMetrics.registry });
}

const register = globalForMetrics.registry;

export async function GET() {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
