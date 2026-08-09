import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const EMAIL_FROM = import.meta.env.EMAIL_FROM || 'MIKA Homes <onboarding@resend.dev>';
// Resend sends "from" the verified mikahomes.com address (needed for SPF/DKIM to
// pass), but replies should land in the team's actual inbox — set via reply-to
// rather than "from" since that inbox lives on a domain Resend can't verify.
const EMAIL_REPLY_TO = import.meta.env.EMAIL_REPLY_TO || undefined;

let _client: Resend | null = null;

export function getResend() {
  if (!_client) {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY must be set');
    }
    _client = new Resend(RESEND_API_KEY);
  }
  return _client;
}

export { EMAIL_FROM, EMAIL_REPLY_TO };
