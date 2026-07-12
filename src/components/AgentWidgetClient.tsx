'use client';

import { useMemo } from 'react';
import { AgentWidget } from '@agentic/agent-ui';
import { loadAgentConfig } from '@agentic/agent-core';
import type { ChatProvider } from '@agentic/agent-core';
import type { ConversationMessage } from '@agentic/shared-types';
import { AGENT_OVERRIDES } from '@/lib/agent-config';
import type { LeadData } from '@agentic/agent-ui';

/**
 * Client wrapper around the shared AgentWidget. It does NOT hold an API key.
 * Instead it supplies a fake ChatProvider whose `createChatCompletion` posts to
 * our server route handler (`/api/agent`), which calls `runTurn` server-side.
 * This keeps the model key off the client while still exercising the real
 * agent orchestration + guardrails on the server.
 *
 * When the agent is unavailable the widget shows a fallback form; its
 * onLeadSubmit posts the captured {name,email,message} to /api/lead, which
 * validates against the dedicated heat-pump-network intake schema. This is
 * independent of the site's Prisma Lead model / /api/leads flow.
 */
export function AgentWidgetClient({
  sessionId,
  initialMode,
  useMobileButton = false,
  showOnMobileOnly = false,
}: {
  sessionId: string;
  initialMode?: string;
  useMobileButton?: boolean;
  showOnMobileOnly?: boolean;
}) {
  const agentConfig = useMemo(() => loadAgentConfig(AGENT_OVERRIDES), []);

  const handleLeadSubmit = useMemo(
    () => async (data: LeadData) => {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
    },
    [],
  );

  const provider = useMemo<ChatProvider>(
    () => ({
      name: 'heatpump-network-server-proxy',
      baseUrl: '/api/agent',
      async createChatCompletion(req) {
        const lastUser = [...req.messages].reverse().find((m) => m.role === 'user');
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages: req.messages as ConversationMessage[],
            userInput: lastUser?.content ?? '',
            mode: initialMode,
          }),
        });
        if (!res.ok) {
          throw new Error(`agent route failed: ${res.status}`);
        }
        const data = (await res.json()) as {
          reply: string;
          usage?: { inputTokens: number; outputTokens: number };
        };
        return {
          text: data.reply,
          usage: {
            prompt_tokens: data.usage?.inputTokens ?? 0,
            completion_tokens: data.usage?.outputTokens ?? 0,
            total_tokens: (data.usage?.inputTokens ?? 0) + (data.usage?.outputTokens ?? 0),
          },
          model: agentConfig.modelRouting.conversational,
        };
      },
    }),
    [sessionId, initialMode, agentConfig],
  );

  return (
    <AgentWidget
      agentConfig={agentConfig}
      provider={provider}
      sessionId={sessionId}
      initialMode={initialMode}
      useMobileButton={useMobileButton}
      showOnMobileOnly={showOnMobileOnly}
      onLeadSubmit={handleLeadSubmit}
    />
  );
}
