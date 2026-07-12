'use client';

import { useMemo } from 'react';
import { AgentWidget } from '@agentic/agent-ui';
import { loadAgentConfig } from '@agentic/agent-core';
import type { ChatProvider } from '@agentic/agent-core';
import type { ConversationMessage } from '@agentic/shared-types';
import { AGENT_OVERRIDES } from '@/lib/agent-config';

/**
 * Client wrapper around the shared AgentWidget. It does NOT hold an API key.
 * Instead it supplies a fake ChatProvider whose `createChatCompletion` posts to
 * our server route handler (`/api/agent`), which calls `runTurn` server-side.
 * This keeps the model key off the client while still exercising the real
 * agent orchestration + guardrails on the server.
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
    />
  );
}
