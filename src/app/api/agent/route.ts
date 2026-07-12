import { NextResponse } from 'next/server';
import {
  loadAgentConfig,
  runTurn,
  InMemorySessionStore,
  CostLimiter,
  createProvider,
} from '@agentic/agent-core';
import type { ConversationMessage } from '@agentic/shared-types';
import { AGENT_OVERRIDES } from '@/lib/agent-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_INPUT = 2000;
const MAX_MESSAGES = 40;

/**
 * Server-side turn handler. Owns the API key (process.env.AI_API_KEY) and runs
 * every turn through `runTurn` so injection / rate-limit / redaction guardrails
 * execute server-side. The browser never sees the key.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { sessionId, messages, userInput, mode } = (body ?? {}) as {
    sessionId?: string;
    messages?: ConversationMessage[];
    userInput?: string;
    mode?: string;
  };

  if (!sessionId || typeof sessionId !== 'string') {
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
    const costLimiter = new CostLimiter({
      maxSessionCostCents: 500,
      dailyBudgetCents: 5000,
    });

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
  } catch (err) {
    return NextResponse.json(
      { error: 'turn failed', detail: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    );
  }
}
