import { NextResponse } from 'next/server';
import {
  loadAgentConfig,
  runTurn,
  InMemorySessionStore,
  CostLimiter,
  createProvider,
} from '@agentic/agent-core';
import { isAllowedOrigin, getClientIp, rateLimit, InMemoryRateLimitStore } from '@agentic/security';
import type { ConversationMessage } from '@agentic/shared-types';
import { AGENT_OVERRIDES } from '@/lib/agent-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_INPUT = 2000;
const MAX_MESSAGES = 40;
const MAX_BODY_BYTES = 32_768;
const MAX_SESSION_ID = 128;

/** Production hostnames allowed to call this endpoint cross-origin. */
const ALLOWED_HOSTS = [
  
  ...(process.env.AGENT_ALLOWED_ORIGINS?.split(',').map((h) => h.trim()).filter(Boolean) ?? []),
];

// Module-scoped so rate limits and spend budgets survive across requests in a
// server instance. Serverless note: state is per-instance; a shared store
// (Redis/KV) can replace both behind the same interfaces for global limits.
const ipStore = new InMemoryRateLimitStore();
const IP_LIMIT = { windowMs: 60_000, max: 20 };
const costLimiter = new CostLimiter({ maxSessionCostCents: 5, dailyBudgetCents: 200 });

/**
 * Server-side turn handler. Owns the API key (process.env.AI_API_KEY) and runs
 * every turn through `runTurn` so injection / rate-limit / budget / redaction
 * guardrails execute server-side. The browser never sees the key.
 */
export async function POST(req: Request) {
  // Cross-site browser calls are refused before any parsing or spend.
  const origin = req.headers.get('origin');
  if (
    !isAllowedOrigin({
      origin,
      requestHost: req.headers.get('host'),
      allowedHosts: ALLOWED_HOSTS,
    })
  ) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  // Per-IP sliding window; session-keyed limits inside runTurn cannot be
  // bypassed by rotating session ids because this one is keyed on the client.
  const ip = getClientIp(req.headers);
  if (!rateLimit(ipStore, IP_LIMIT, ip).allowed) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { sessionId, messages, userInput, mode } = (body ?? {}) as {
    sessionId?: string;
    messages?: ConversationMessage[];
    userInput?: string;
    mode?: string;
  };

  if (!sessionId || typeof sessionId !== 'string' || sessionId.length > MAX_SESSION_ID) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }
  if (!userInput || typeof userInput !== 'string') {
    return NextResponse.json({ error: 'userInput required' }, { status: 400 });
  }
  if (userInput.length > MAX_INPUT) {
    return NextResponse.json({ error: 'input too long' }, { status: 413 });
  }
  const safeMessages = Array.isArray(messages) ? messages.slice(-MAX_MESSAGES) : [];

  try {
    const agentConfig = loadAgentConfig(AGENT_OVERRIDES);
    // createProvider reads AI_API_KEY from env (never from the browser).
    const provider = createProvider({ AI_PROVIDER: 'nous' });
    const store = new InMemorySessionStore();

    const result = await runTurn({
      agentConfig,
      messages: safeMessages,
      userInput,
      provider,
      store,
      sessionId,
      mode,
      workflowAllowlist: [],
      costLimiter,
    });

    return NextResponse.json({
      reply: result.reply,
      fallback: result.fallback,
      flaggedInjection: result.flaggedInjection,
      escalated: result.escalated,
      usage: result.usage,
      costCents: result.costCents,
    });
  } catch {
    // Internals stay in server logs; clients get a generic failure.
    return NextResponse.json({ error: 'turn failed' }, { status: 500 });
  }
}
