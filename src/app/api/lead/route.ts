import { NextResponse } from 'next/server';
import {
  FORMS_BY_SITE,
  heatPumpNetworkIntakeSchema,
  heatPumpNetworkToLead,
} from '@agentic/forms';
import { leadToEmail } from '@agentic/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_KEY = 'heat-pump-network';

/**
 * Optional agent-fallback lead intake for the Heat Pump Network Guide.
 *
 * NOTE: heatpump-network also has a Prisma Lead model + existing
 * /api/leads flow used by the public profile-lead-form. This dedicated
 * /api/lead route is ONLY for the AgentWidget's fallback form (graceful
 * degradation when the agent is unavailable) and does NOT touch the Prisma
 * leads table — it validates with the dedicated heat-pump-network Zod schema,
 * converts to a normalized Lead, and builds an email envelope via `leadToEmail`
 * (pure transform — no send). The existing /api/leads flow is untouched.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const registration = FORMS_BY_SITE[SITE_KEY];
  if (!registration) {
    return NextResponse.json({ error: 'site not configured' }, { status: 500 });
  }

  const parsed = heatPumpNetworkIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const lead = heatPumpNetworkToLead(parsed.data);
  const envelope = leadToEmail(lead); // no real send — separate from /api/leads

  return NextResponse.json({
    ok: true,
    leadId: `${SITE_KEY}-${Date.now()}`,
    preview: {
      to: envelope.to,
      subject: envelope.subject,
      text: envelope.text,
    },
  });
}
