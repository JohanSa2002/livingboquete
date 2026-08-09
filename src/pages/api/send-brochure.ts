import type { APIRoute } from 'astro';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSupabase } from '../../lib/supabase';
import { isAuthenticated } from '../../lib/auth';
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from '../../lib/email';
import { PropertyBrochure, type BrochureRental } from '../../lib/pdf/PropertyBrochure';

function emailHtml(leadName: string, rentalName: string, note: string) {
  const noteBlock = note
    ? `<p style="margin:0 0 20px;padding:14px 16px;background:#F5F0E8;border-left:3px solid #C8964A;border-radius:6px;font-size:14px;line-height:1.6;color:#2B2B2B">${note.replace(/\n/g, '<br/>')}</p>`
    : '';
  return `
  <div style="font-family:'Inter',Arial,sans-serif;max-width:560px;margin:0 auto;color:#2B2B2B">
    <div style="background:#2F5233;padding:22px 28px;border-radius:12px 12px 0 0">
      <span style="color:#F5F0E8;font-weight:800;font-size:16px;letter-spacing:.02em">MIKA HOMES</span>
    </div>
    <div style="padding:28px;border:1px solid #E5DFD2;border-top:none;border-radius:0 0 12px 12px">
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hola ${leadName},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
        Gracias por tu interés en <strong>${rentalName}</strong>. Adjuntamos la ficha completa de la propiedad en PDF con toda la información.
      </p>
      ${noteBlock}
      <p style="font-size:15px;line-height:1.6;margin:0 0 4px">Cualquier duda, responde directamente a este correo.</p>
      <p style="font-size:13px;color:#5B5650;margin-top:24px">— Equipo MIKA Homes · mikahomes.com</p>
    </div>
  </div>`;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { leadId, rentalId, note } = await request.json();
  if (!leadId || !rentalId) {
    return new Response(JSON.stringify({ error: 'leadId and rentalId required' }), { status: 400 });
  }

  const supabase = getSupabase();
  const [{ data: lead, error: leadError }, { data: rentalRow, error: rentalError }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', leadId).maybeSingle(),
    supabase.from('rentals').select('data').eq('id', rentalId).maybeSingle(),
  ]);

  if (leadError || !lead) {
    return new Response(JSON.stringify({ error: 'Lead not found' }), { status: 404 });
  }
  if (rentalError || !rentalRow) {
    return new Response(JSON.stringify({ error: 'Rental not found' }), { status: 404 });
  }

  const rental = rentalRow.data as BrochureRental;
  const leadName = String(lead.nombre || '').split(' ')[0] || lead.nombre;

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      PropertyBrochure({ rental, leadName: String(lead.nombre), note: note ? String(note) : undefined })
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'No se pudo generar el PDF' }), { status: 500 });
  }

  try {
    const { error } = await getResend().emails.send({
      from: EMAIL_FROM,
      to: lead.email as string,
      ...(EMAIL_REPLY_TO ? { replyTo: EMAIL_REPLY_TO } : {}),
      subject: `${rental.name.es} · Información de la propiedad — MIKA Homes`,
      html: emailHtml(leadName, rental.name.es, note ? String(note) : ''),
      attachments: [
        {
          filename: `${rental.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al enviar el correo';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }));
};
