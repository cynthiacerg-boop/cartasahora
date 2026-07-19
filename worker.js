// ── Escapar texto que se inserta en HTML de emails (evita inyección) ──
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ── Notificación interna de compra (una sola vez por pago) ──
const NOMBRES_PRODUCTO = {
  'pregunta':         'Pregunta Puntual',
  'transitos':        'Tránsitos Actuales',
  'carta-completa':   'Carta Natal Completa',
  'proposito-vida':   'Propósito de Vida',
  'revolucion-lunar': 'Revolución Lunar',
  'revolucion-solar': 'Revolución Solar',
  'sinastria':        'Sinastría',
  'lectura-profunda': 'Lectura Profunda',
};

async function notificarCompraInterna(env, pagoId, datos) {
  try {
    // Dedup: si ya se notificó este pago, no repetir
    const yaNotificado = await env.PAGOS_KV.get(`notif:${pagoId}`);
    if (yaNotificado) return;
    await env.PAGOS_KV.put(`notif:${pagoId}`, '1', { expirationTtl: 86400 });

    const prodNombre = NOMBRES_PRODUCTO[datos.producto] || datos.producto || '—';
    const nombre = datos.nombre || 'sin nombre';
    const cuandoAR = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const montoTxt = (datos.monto != null && datos.monto !== '')
      ? `${datos.monto} ${datos.moneda || ''}`.trim()
      : '—';

    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#8A4DAB;margin:0 0 16px;">💫 Nueva compra confirmada</h2>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:8px 0;color:#888;width:140px;">Producto</td><td style="padding:8px 0;font-weight:bold;">${esc(prodNombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Consultante</td><td style="padding:8px 0;">${esc(nombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${esc(datos.email || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Monto</td><td style="padding:8px 0;">${esc(montoTxt)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Pasarela</td><td style="padding:8px 0;">${esc(datos.pasarela || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Datos de nacimiento</td><td style="padding:8px 0;">${esc(datos.fecha || '—')} ${esc(datos.hora || '')} · ${esc(datos.ciudad || '—')}, ${esc(datos.pais || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Fecha y hora</td><td style="padding:8px 0;">${cuandoAR} (ARG)</td></tr>
  </table>
</div>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Espacio Libra <cartas@espaciolibra.com>',
        to: ['cynthia@espaciolibra.com'],
        subject: `💫 Nueva compra — ${prodNombre} (${nombre})`,
        html,
      }),
    });
  } catch (e) {
    // Nunca romper el flujo de pago por un fallo en la notificación
    console.warn('Error notificación interna:', e.message);
  }
}

// ── Aviso interno: una lectura paga se cortó por llegar al tope de tokens ──
// Sin esto solo queda un console.warn que nadie mira, y te enterás cuando
// la persona escribe quejándose de que le llegó incompleta.
async function notificarLecturaCortada(env, datos) {
  try {
    const prodNombre = NOMBRES_PRODUCTO[datos.producto] || datos.producto || '—';
    const cuandoAR = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#c0392b;margin:0 0 8px;">⚠️ Una lectura se cortó incompleta</h2>
  <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 16px;">
    La generación llegó al tope de tokens y el texto quedó truncado. No se envió por mail
    ni se guardó en caché. Conviene regenerarla y mandarla a mano.
  </p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:8px 0;color:#888;width:140px;">Producto</td><td style="padding:8px 0;font-weight:bold;">${esc(prodNombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Consultante</td><td style="padding:8px 0;">${esc(datos.nombre || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${esc(datos.email || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">ID de pago</td><td style="padding:8px 0;">${esc(datos.pagoId || '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Tokens generados</td><td style="padding:8px 0;">${esc(datos.tokens ?? '—')}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Fecha y hora</td><td style="padding:8px 0;">${cuandoAR} (ARG)</td></tr>
  </table>
</div>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Espacio Libra <cartas@espaciolibra.com>',
        to: ['cynthia@espaciolibra.com'],
        subject: `⚠️ Lectura cortada — ${prodNombre}`,
        html,
      }),
    });
  } catch (e) {
    // Nunca romper la lectura por un fallo en el aviso
    console.warn('Error aviso lectura cortada:', e.message);
  }
}

// ── Seguimiento automático: oferta de informe completo, 2hs después del lead ──
const SEGUIMIENTO_DELAY_MS = 2 * 60 * 60 * 1000; // 2 horas

async function procesarSeguimientos(env) {
  // Nota: una sola página de list cubre hasta 1000 claves (suficiente por años).
  const list = await env.LEADS_KV.list({ prefix: 'lead:' });
  const ahora = Date.now();
  let enviados = 0;
  for (const k of list.keys) {
    if (enviados >= 50) break; // tope de seguridad por corrida
    // Filtrar por METADATA (viene gratis en el list) para no gastar una lectura
    // por cada lead ya-enviado en cada corrida. Solo leemos el valor completo de
    // los candidatos reales. Los leads viejos sin metadata caen al get (compat).
    const md = k.metadata;
    if (md) {
      if (md.mkt !== true) continue;                                 // sin consentimiento
      if (md.done === true) continue;                                 // ya se le envió
      if (!md.ts || (ahora - md.ts) < SEGUIMIENTO_DELAY_MS) continue; // menos de 2hs
    }
    let lead;
    try { lead = JSON.parse(await env.LEADS_KV.get(k.name)); } catch { continue; }
    if (!lead) continue;
    if (lead.acepta_marketing !== true) continue;                 // solo con consentimiento
    if (lead.seguimiento_enviado === true) continue;               // ya se le envió
    if (!lead.timestamp || (ahora - lead.timestamp) < SEGUIMIENTO_DELAY_MS) continue; // menos de 2hs
    const ok = await enviarSeguimientoOferta(env, lead);
    if (ok) {
      lead.seguimiento_enviado = true;
      await env.LEADS_KV.put(k.name, JSON.stringify(lead), {
        expirationTtl: 60 * 60 * 24 * 365 * 2,
        metadata: { ts: lead.timestamp, mkt: lead.acepta_marketing === true, done: true },
      });
      enviados++;
    }
  }
  console.log(`Seguimientos enviados: ${enviados}`);
}

// ── Última nota de Substack (para el pie de los mails), cacheada 3hs ──
function _limpiarCDATA(s){ return (s||'').replace('<![CDATA[','').replace(']]>','').trim(); }
async function obtenerUltimaNotaSubstack(env){
  try{
    const cached = await env.PAGOS_KV.get('substack-ultima-nota');
    if(cached) return JSON.parse(cached);
    const res = await fetch('https://cynthialibra.substack.com/feed', { headers: { 'User-Agent': 'EspacioLibra/1.0 (+cartasahora.espaciolibra.com)' } });
    if(!res.ok) return null;
    const xml = await res.text();
    const itemMatch = xml.match(/<item[\s\S]*?<\/item>/);
    if(!itemMatch) return null;
    const item = itemMatch[0];
    const tm = item.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const lm = item.match(/<link[^>]*>([\s\S]*?)<\/link>/);
    let titulo = tm ? _limpiarCDATA(tm[1]) : '';
    const link = lm ? _limpiarCDATA(lm[1]) : '';
    if(!titulo || !link) return null;
    if(titulo.length > 85) titulo = titulo.slice(0, 82).trim() + '…'; // acortar para el pie
    const nota = { titulo, link };
    await env.PAGOS_KV.put('substack-ultima-nota', JSON.stringify(nota), { expirationTtl: 60 * 60 * 3 });
    return nota;
  }catch(e){ console.warn('Error RSS Substack:', e.message); return null; }
}

async function enviarSeguimientoOferta(env, lead) {
  try {
    const nombre = (lead.nombre || '').trim();
    const saludo = nombre ? `Hola ${esc(nombre)}` : 'Hola';
    // Si el lead tiene token (carta guardada), el link precarga todo y va directo
    // a Tránsitos. Si es un lead viejo sin token, cae al comportamiento anterior.
    const link = lead.token
      ? 'https://cartasahora.espaciolibra.com/?lead=' + encodeURIComponent(lead.token)
      : 'https://cartasahora.espaciolibra.com/?nombre=' + encodeURIComponent(nombre);
    const ultimaNota = await obtenerUltimaNotaSubstack(env);
    const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2a2a;line-height:1.7;">
  <p style="font-size:11px;letter-spacing:0.3em;color:#8A4DAB;text-transform:uppercase;margin:0 0 18px;">Espacio Libra · Astrología Evolutiva</p>
  <p>${saludo}:</p>
  <p>Hace un rato calculaste tu carta natal y viste solo una parte. Tu <strong>informe completo en PDF</strong> incluye el análisis detallado de tu personalidad, vínculos, vocación y los desafíos que marca tu carta — toda la profundidad que estos 3 elementos solo empiezan a mostrar.</p>
  <p style="text-align:center;margin:28px 0;">
    <span style="font-size:26px;color:#8A4DAB;">$10.000</span>
    <span style="font-size:14px;color:#777;"> vía Mercado Pago</span>
  </p>
  <p style="text-align:center;margin:0 0 28px;">
    <a href="${link}" style="display:inline-block;padding:14px 32px;background:#82B366;color:#fff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;letter-spacing:0.08em;">Quiero mi informe completo</a>
  </p>
  ${ultimaNota ? `<p style="text-align:center;border-top:1px solid #eee;padding-top:18px;margin:24px 0 0;font-size:13px;color:#777;">📖 Mi última nota: <a href="${ultimaNota.link}" style="color:#8A4DAB;text-decoration:none;">${esc(ultimaNota.titulo)}</a></p>` : ''}
  <p style="text-align:center;${ultimaNota ? '' : 'border-top:1px solid #eee;'}padding-top:14px;margin:14px 0 0;">
    <a href="https://cynthialibra.substack.com/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Mis notas en Substack</a> ·
    <a href="https://www.instagram.com/cynthiacerg/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Instagram</a> ·
    <a href="https://www.facebook.com/espaciolibra.astro" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Facebook</a>
  </p>
  <p style="font-size:12px;color:#999;padding-top:12px;margin-top:12px;">
    Recibís este mail porque pediste tu carta natal en Espacio Libra y aceptaste recibir novedades. Si no querés recibir más, respondé este mail con la palabra <strong>BAJA</strong>.
  </p>
</div>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Espacio Libra <cartas@espaciolibra.com>',
        to: [lead.email],
        reply_to: 'cynthia@espaciolibra.com',
        subject: 'Tu carta natal tiene más para revelarte',
        html,
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Error seguimiento oferta:', e.message);
    return false;
  }
}

// ── Verificar que un webhook de PayPal es auténtico (firma válida) ──
// Sin esto, cualquiera puede POSTear un evento falso "pago completado".
// Requiere el secreto PAYPAL_WEBHOOK_ID (ID del webhook en el panel de PayPal).
async function paypalWebhookVerificado(request, env, event) {
  try {
    if (!env.PAYPAL_WEBHOOK_ID) return false; // sin webhook id no se puede verificar → rechazar
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!tokenRes.ok) return false;
    const { access_token } = await tokenRes.json();

    const verifyRes = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo:         request.headers.get('paypal-auth-algo'),
        cert_url:          request.headers.get('paypal-cert-url'),
        transmission_id:   request.headers.get('paypal-transmission-id'),
        transmission_sig:  request.headers.get('paypal-transmission-sig'),
        transmission_time: request.headers.get('paypal-transmission-time'),
        webhook_id:        env.PAYPAL_WEBHOOK_ID,
        webhook_event:     event,
      }),
    });
    if (!verifyRes.ok) return false;
    const v = await verifyRes.json();
    return v.verification_status === 'SUCCESS';
  } catch (e) {
    console.warn('Error verificando webhook PayPal:', e.message);
    return false;
  }
}

// Autoriza una lectura paga verificando SERVER-SIDE: token de promo (un solo uso)
// o un pago confirmado guardado en PAGOS_KV (pago:<id>). Nunca confía en el cliente.
async function pagoAutorizado(env, pagoId, promoToken) {
  if (promoToken) {
    const tok = await env.PAGOS_KV.get(`promo-token:${promoToken}`);
    if (tok) return true;
  }
  if (pagoId) {
    const pago = await env.PAGOS_KV.get(`pago:${pagoId}`, 'json');
    if (pago?.confirmado) return true;
  }
  return false;
}

export default {
  async fetch(request, env, ctx) {

    // Producción + localhost para testear el sitio local contra el worker real
    const ALLOWED_ORIGINS = [
      'https://cartasahora.espaciolibra.com',
      'http://localhost:8099',
      'http://127.0.0.1:8099',
    ];
    const origin = request.headers.get('Origin') || '';
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    // ── Rate limiting via KV ──
    if (env.RATE_LIMIT) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const key = `rl:${ip}`;
      const cur = parseInt(await env.RATE_LIMIT.get(key) || '0');
      if (cur >= 30) return json({ error: 'Demasiadas solicitudes. Esperá un minuto.' }, 429);
      await env.RATE_LIMIT.put(key, String(cur + 1), { expirationTtl: 60 });
    }

    // ── RUTA 1: Carta natal via RapidAPI ──
    if (path === '/carta' && request.method === 'POST') {
      try {
        const body = await request.json();
        const res = await fetch('https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 2: Revolución Solar via RapidAPI ──
    if (path === '/revolucion-solar' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { subject, year, return_location } = body;
        const payload = {
          subject,
          year: parseInt(year),
          return_location,
          wheel_type: 'dual'
        };
        const res = await fetch('https://astrologer.p.rapidapi.com/api/v5/chart-data/solar-return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 3: Tránsitos actuales via RapidAPI ──
    // Recibe los datos natales del sujeto + fecha/hora/coords actuales
    // Devuelve la carta del momento actual para cruzar con la natal
    if (path === '/transitos-actuales' && request.method === 'POST') {
      try {
        const body = await request.json();
        // body.subject = datos natales originales
        // body.transit = { year, month, day, hour, minute, latitude, longitude, timezone }
        const { subject, transit } = body;

        // Calculamos la carta del momento actual como una carta natal de "hoy"
        // El sujeto de tránsito usa los datos actuales de fecha/hora/lugar
        const transitSubject = {
          name: 'Transito',
          year: transit.year,
          month: transit.month,
          day: transit.day,
          hour: transit.hour,
          minute: transit.minute,
          longitude: transit.longitude,
          latitude: transit.latitude,
          timezone: transit.timezone,
          city: transit.city || 'current',
          nation: transit.nation || 'AR'
        };

        const res = await fetch('https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
          },
          body: JSON.stringify({ subject: transitSubject }),
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 4: Interpretación via Claude ──
    if (path === '/interpretar' && request.method === 'POST') {
      try {
        const body = await request.json();
        // Lectura esencial gratuita → Haiku con tope bajo; pagas/promo → Sonnet con tope mayor
        const esEsencial = (body.prompt || '').includes('LECTURA ESENCIAL GRATUITA');
        // Gateo de pago: las lecturas pagas (Sonnet) exigen prueba de pago server-side.
        // La esencial gratuita (Haiku) queda libre.
        if (!esEsencial) {
          const autorizado = await pagoAutorizado(env, body.pagoId, body.promoToken);
          if (!autorizado) return json({ error: 'Pago no verificado' }, 403);
        }
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'prompt-caching-2024-07-31',
          },
          body: JSON.stringify({
            model: esEsencial ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
            // 8000 es un techo, no una meta: las lecturas terminan solas mucho antes.
            // Con 4000 las cartas completas con muchos aspectos se cortaban a la mitad.
            max_tokens: esEsencial ? 1500 : 8000,
            system: body.system
              ? [{ type: 'text', text: body.system, cache_control: { type: 'ephemeral' } }]
              : undefined,
            messages: [{ role: 'user', content: body.prompt }],
          }),
        });
        const data = await res.json();
        // Si se llegó al tope de tokens la lectura quedó cortada: avisar por mail.
        // Solo para las pagas — la esencial gratuita se regenera sola al recargar.
        if (data.stop_reason === 'max_tokens' && !esEsencial) {
          ctx.waitUntil((async () => {
            // El front todavía no tiene el email en este punto: sale del registro de pago.
            let pago = null;
            if (body.pagoId) {
              try { pago = await env.PAGOS_KV.get(`pago:${body.pagoId}`, 'json'); } catch {}
            }
            await notificarLecturaCortada(env, {
              producto: body.producto || pago?.producto,
              nombre:   body.nombre   || pago?.nombre,
              email:    pago?.email,
              pagoId:   body.pagoId,
              tokens:   data.usage?.output_tokens,
            });
          })());
        }
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 5: Enviar lectura por email via SendGrid ──
    if (path === '/enviar-lectura' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, nombre, producto, lectura, promoToken, fecha, hora, ciudad, pais } = body;

        // Validar autorización SERVER-SIDE: token de promo (un solo uso) o pago
        // confirmado en PAGOS_KV. No se confía en body.pagado (lo manda el cliente).
        let esPrueba = false;
        if (promoToken) {
          const tok = await env.PAGOS_KV.get(`promo-token:${promoToken}`);
          if (tok) esPrueba = true; // válido 1h; el límite mensual se aplica al validar
        }
        // La lectura esencial GRATIS (texto ya generado) se envía sin pago.
        // Se exige body.texto para no permitir generar contenido pago gratis por esta vía.
        const esEsencialGratis = producto === 'esencial' && !!body.texto;
        if (!esPrueba && !esEsencialGratis) {
          const pago = body.pagoId ? await env.PAGOS_KV.get(`pago:${body.pagoId}`, 'json') : null;
          if (!pago?.confirmado) {
            return json({ error: 'Pago no confirmado' }, 403);
          }
        }

        // Tope diario de envíos por IP (anti-spam SendGrid)
        const ipEnvio = request.headers.get('CF-Connecting-IP') || 'unknown';
        const diaEnvio = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const envioKey = `envio:${ipEnvio}:${diaEnvio}`;
        const enviosHoy = parseInt(await env.RATE_LIMIT.get(envioKey) || '0');
        if (enviosHoy >= 10) {
          return json({ error: 'Límite diario de envíos alcanzado. Probá mañana.' }, 429);
        }
        await env.RATE_LIMIT.put(envioKey, String(enviosHoy + 1), { expirationTtl: 60 * 60 * 24 });

        // Si el frontend ya generó el texto, usarlo directamente
        let texto = body.texto || '';
        if (!texto) {
          const esEsencial = (lectura || '').includes('LECTURA ESENCIAL GRATUITA');
          const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': env.ANTHROPIC_KEY,
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'prompt-caching-2024-07-31',
            },
            body: JSON.stringify({
              model: esEsencial ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
              max_tokens: esEsencial ? 1500 : 8000,
              system: body.system
                ? [{ type: 'text', text: body.system, cache_control: { type: 'ephemeral' } }]
                : undefined,
              messages: [{ role: 'user', content: lectura }],
            }),
          });
          const claudeData = await claudeRes.json();
          // Si se llegó al tope de tokens el texto quedó cortado a la mitad:
          // no se manda por mail, se avisa para que se vuelva a intentar.
          if (claudeData.stop_reason === 'max_tokens') {
            console.warn('Lectura cortada por max_tokens en /enviar-lectura:', producto);
            ctx.waitUntil(notificarLecturaCortada(env, {
              producto, nombre, email,
              pagoId: body.pagoId,
              tokens: claudeData.usage?.output_tokens,
            }));
            return json({ error: 'La lectura quedó incompleta. Volvé a intentarlo.' }, 500);
          }
          texto = claudeData.content?.map(b => b.text || '').join('') || '';
        }

        // Si hay email, mandar por SendGrid
        if (email) {
          const productos = {
            'esencial': { nombre: 'Lectura Esencial Gratuita', precio: '' },
            'carta-completa': { nombre: 'Carta Natal Completa', precio: '$6 USD' },
            'revolucion-solar': { nombre: 'Revolución Solar', precio: '$9 USD' },
            'sinastria': { nombre: 'Sinastría — Compatibilidad de Pareja', precio: '$9 USD' },
            'transitos': { nombre: 'Tránsitos Actuales', precio: '$5 USD' },
            'pregunta': { nombre: 'Pregunta Puntual', precio: '$4 USD' },
            'lectura-profunda': { nombre: 'Lectura Profunda · Análisis Completo', precio: '$13 USD' },
          };

          const prod = productos[producto] || { nombre: producto, precio: '' };

          const htmlLectura = texto
            .split('\n')
            .map(linea => {
              if (!linea.trim()) return '<br>';
              if (linea.startsWith('**') && linea.endsWith('**')) {
                return `<h2 style="color:#82B366;font-family:Georgia,serif;font-size:18px;margin:24px 0 8px;border-bottom:1px solid rgba(130,179,102,0.3);padding-bottom:6px;">${esc(linea).replace(/\*\*/g, '')}</h2>`;
              }
              return `<p style="margin:0 0 12px;line-height:1.8;color:#3a3a3a;">${esc(linea).replace(/\*\*/g, '')}</p>`;
            })
            .join('');

          const ultimaNota = await obtenerUltimaNotaSubstack(env);
          const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#f5f3ef;margin:0;padding:0;font-family:'Georgia',serif;">
  <div style="max-width:620px;margin:0 auto;background:white;">
    <div style="background:#0a0a12;padding:40px 32px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.3em;color:#82B366;text-transform:uppercase;margin:0 0 12px;">Espacio Libra</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#f0ede8;margin:0 0 8px;">${prod.nombre}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0;">Lectura personal para ${esc(nombre)}</p>
    </div>
    <div style="padding:32px;border-bottom:1px solid #e8e4de;">
      <p style="font-size:15px;color:#5a5a5a;line-height:1.7;margin:0;">
        Hola <strong>${esc(nombre)}</strong>, tu lectura astrológica está lista.
        Tomate el tiempo que necesites para leerla — está hecha especialmente para vos.
      </p>
    </div>
    <div style="padding:32px;">
      ${htmlLectura}
    </div>
    ${producto === 'carta-completa' ? `<div style="background:#f9f7f4;padding:32px;text-align:center;border-top:1px solid #e8e4de;">
      <p style="font-size:14px;color:#5a5a5a;margin:0 0 8px;">¿Querés ir más profundo?</p>
      <p style="font-size:13px;color:#888;margin:0 0 20px;">Análisis completo de todos tus aspectos + coaching evolutivo · Solo USD 7 más</p>
      <a href="https://cartasahora.espaciolibra.com?upgrade=lectura-profunda&nombre=${encodeURIComponent(nombre||'')}&fecha=${encodeURIComponent(fecha||'')}&hora=${encodeURIComponent(hora||'')}&ciudad=${encodeURIComponent(ciudad||'')}&pais=${encodeURIComponent(pais||'Argentina')}" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">✦ Quiero mi lectura profunda · USD 7</a>
      <p style="font-size:11px;color:#aaa;margin:12px 0 0;">Pago seguro vía PayPal · Entrega en menos de 5 min</p>
    </div>` : ''}
    <div style="padding:28px 32px;text-align:center;background:#0a0a12;">
      ${ultimaNota ? `<p style="margin:0 0 18px;font-family:Georgia,serif;"><span style="font-size:12px;color:rgba(255,255,255,0.45);">📖 Mi última nota:</span> <a href="${ultimaNota.link}" style="color:#A5D96F;text-decoration:none;font-size:13px;">${esc(ultimaNota.titulo)}</a></p>` : ''}
      <p style="font-size:13px;color:rgba(255,255,255,0.65);margin:0 0 12px;font-family:Georgia,serif;">Seguime y no te pierdas nada ✦</p>
      <p style="margin:0 0 16px;">
        <a href="https://cynthialibra.substack.com/" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Mis notas en Substack</a>
        <a href="https://www.instagram.com/cynthiacerg/" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Instagram</a>
        <a href="https://www.facebook.com/espaciolibra.astro" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Facebook</a>
      </p>
      <p style="font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.2);margin:0;">
        ESPACIO LIBRA · ASTROLOGÍA EVOLUTIVA · cartasahora.espaciolibra.com
      </p>
    </div>
  </div>
</body>
</html>`;

          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'Espacio Libra <cartas@espaciolibra.com>',
              to: [email],
              reply_to: 'contacto@espaciolibra.com',
              subject: `✦ Tu ${prod.nombre} — Espacio Libra`,
              html: emailHtml,
            }),
          });

          if (!resendRes.ok) {
            const err = await resendRes.text();
            return json({ error: 'Error al enviar email: ' + err }, 500);
          }
        }

        return json({ ok: true, texto });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 1/4: Crear orden PayPal ──
    if (path === '/crear-pago-paypal' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { producto, nombre, email, fecha, hora, ciudad, pais } = body;

        const PRECIOS_USD = {
          'carta-completa':   { monto: '6.00',  titulo: 'Carta Natal Completa' },
          'proposito-vida':   { monto: '6.00',  titulo: 'Propósito de Vida' },
          'transitos':        { monto: '5.00',  titulo: 'Tránsitos Actuales' },
          'pregunta':         { monto: '4.00',  titulo: 'Pregunta Puntual' },
          'revolucion-solar': { monto: '9.00',  titulo: 'Revolución Solar' },
          'sinastria':        { monto: '9.00',  titulo: 'Sinastría' },
          'lectura-profunda': { monto: '13.00', titulo: 'Lectura Profunda' },
          'revolucion-lunar': { monto: '9.00',  titulo: 'Revolución Lunar' },
        };

        const prod = PRECIOS_USD[producto];
        if (!prod) return json({ error: 'Producto no válido' }, 400);

        // Obtener access token de PayPal
        const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) return json({ error: 'Error auth PayPal', detalle: tokenData, status: tokenRes.status }, 500);
        const accessToken = tokenData.access_token;

        // Armar custom_id con todos los datos para recuperarlos en el webhook
        const customId = JSON.stringify({ producto, nombre, email: email || '', fecha: fecha || '', hora: hora || '', ciudad: ciudad || '', pais: pais || '' });

        const successUrl = 'https://cartasahora.espaciolibra.com/?lectura=ok&pasarela=paypal' +
          '&producto=' + encodeURIComponent(producto) +
          '&nombre=' + encodeURIComponent(nombre) +
          '&fecha=' + encodeURIComponent(fecha || '') +
          '&hora=' + encodeURIComponent(hora || '') +
          '&ciudad=' + encodeURIComponent(ciudad || '') +
          '&pais=' + encodeURIComponent(pais || '');
        const cancelUrl = 'https://cartasahora.espaciolibra.com/?pago=cancelado';

        // Crear orden
        const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': crypto.randomUUID(),
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              custom_id: customId,
              description: prod.titulo,
              amount: { currency_code: 'USD', value: prod.monto },
            }],
            application_context: {
              brand_name: 'Espacio Libra',
              landing_page: 'BILLING',
              user_action: 'PAY_NOW',
              return_url: successUrl,
              cancel_url: cancelUrl,
            },
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) return json({ error: orderData.message || 'Error creando orden PayPal' }, 500);

        const approveLink = orderData.links?.find(l => l.rel === 'approve')?.href;
        if (!approveLink) return json({ error: 'No se encontró link de aprobación PayPal' }, 500);

        return json({ url: approveLink, orderId: orderData.id });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 2/4: Capturar pago PayPal ──
    if (path === '/capturar-pago-paypal' && request.method === 'POST') {
      try {
        const { orderId } = await request.json();
        if (!orderId) return json({ ok: false, error: 'Falta orderId' }, 400);

        // Obtener access token
        const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) return json({ ok: false, error: 'Error auth PayPal' }, 500);
        const accessToken = tokenData.access_token;

        // Capturar la orden
        const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `capture-${orderId}`,
          },
        });
        const captureData = await captureRes.json();
        if (!captureRes.ok) return json({ ok: false, error: captureData.message || 'Error al capturar', detalle: captureData }, 500);

        const status = captureData.status;
        if (status !== 'COMPLETED') return json({ ok: false, error: `Estado inesperado: ${status}` }, 400);

        // Extraer metadata del custom_id
        const unit = captureData.purchase_units?.[0];
        let meta = {};
        try { meta = JSON.parse(unit?.custom_id || '{}'); } catch {}

        // Guardar en KV
        await env.PAGOS_KV.put(
          `pago:${orderId}`,
          JSON.stringify({
            confirmado:  true,
            producto:    meta.producto  || '',
            nombre:      meta.nombre    || '',
            email:       meta.email     || '',
            fecha:       meta.fecha     || '',
            hora:        meta.hora      || '',
            ciudad:      meta.ciudad    || '',
            pais:        meta.pais      || '',
            pasarela:    'paypal',
            timestamp:   Date.now(),
          }),
          { expirationTtl: 86400 }
        );

        // Notificación interna
        const capAmount = unit?.payments?.captures?.[0]?.amount || {};
        await notificarCompraInterna(env, orderId, {
          ...meta, pasarela: 'paypal',
          monto: capAmount.value, moneda: capAmount.currency_code || 'USD',
        });

        return json({ ok: true });
      } catch (e) {
        return json({ ok: false, error: e.message }, 500);
      }
    }

    // ── RUTA 3/4: Webhook PayPal (respaldo) ──
    if (path === '/webhook-paypal' && request.method === 'POST') {
      try {
        const event = await request.json();

        // Rechazar eventos no verificados: respondemos 200 para que PayPal no reintente,
        // pero NO procesamos ni marcamos ningún pago como confirmado.
        const autentico = await paypalWebhookVerificado(request, env, event);
        if (!autentico) {
          console.warn('Webhook PayPal rechazado: firma no verificada');
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
          const resource = event.resource;
          const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
          let meta = {};
          try { meta = JSON.parse(resource.custom_id || '{}'); } catch {}

          await env.PAGOS_KV.put(
            `pago:${orderId}`,
            JSON.stringify({
              confirmado: true,
              producto:   meta.producto  || '',
              nombre:     meta.nombre    || '',
              email:      meta.email     || '',
              fecha:      meta.fecha     || '',
              hora:       meta.hora      || '',
              ciudad:     meta.ciudad    || '',
              pais:       meta.pais      || '',
              pasarela:   'paypal',
              timestamp:  Date.now(),
            }),
            { expirationTtl: 86400 }
          );

          // Notificación interna (dedup evita duplicar con la captura)
          await notificarCompraInterna(env, orderId, {
            ...meta, pasarela: 'paypal',
            monto: resource.amount?.value, moneda: resource.amount?.currency_code || 'USD',
          });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    // ── RUTA 3/4: Crear preferencia MercadoPago ──
    if (path === '/crear-pago-mp' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { producto, nombre, email, fecha, hora, ciudad, pais } = body;

        const PRECIOS_MP = {
          'pregunta':         { monto:  6500, titulo: 'Pregunta Puntual' },
          'transitos':        { monto:  8500, titulo: 'Tránsitos Actuales' },
          'carta-completa':   { monto: 10000, titulo: 'Carta Natal Completa' },
          'proposito-vida':   { monto: 10000, titulo: 'Propósito de Vida' },
          'revolucion-lunar': { monto: 10000, titulo: 'Revolución Lunar' },
          'revolucion-solar': { monto: 15000, titulo: 'Revolución Solar' },
          'sinastria':        { monto: 15000, titulo: 'Sinastría' },
          'lectura-profunda': { monto: 22000, titulo: 'Lectura Profunda' },
        };

        const prod = PRECIOS_MP[producto];
        if (!prod) return json({ error: 'Producto no válido' }, 400);

        const externalReference = JSON.stringify({ producto, nombre, email: email || '', fecha: fecha || '', hora: hora || '', ciudad: ciudad || '', pais: pais || '' });

        const successUrl = 'https://cartasahora.espaciolibra.com/?lectura=ok&pasarela=mp' +
          '&producto=' + encodeURIComponent(producto) +
          '&nombre=' + encodeURIComponent(nombre) +
          '&fecha=' + encodeURIComponent(fecha || '') +
          '&hora=' + encodeURIComponent(hora || '') +
          '&ciudad=' + encodeURIComponent(ciudad || '') +
          '&pais=' + encodeURIComponent(pais || '');

        const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              title: prod.titulo,
              quantity: 1,
              currency_id: 'ARS',
              unit_price: prod.monto,
            }],
            payer: { name: nombre, email: email || undefined },
            external_reference: externalReference,
            back_urls: {
              success: successUrl,
              failure: 'https://cartasahora.espaciolibra.com/?pago=cancelado',
              pending: 'https://cartasahora.espaciolibra.com/?pago=pendiente',
            },
            auto_return: 'approved',
            // Solo pagos instantáneos: sin efectivo/offline y sin estado "pending".
            // Los pagos en efectivo no vuelven al sitio y el cliente queda sin lectura.
            binary_mode: true,
            payment_methods: {
              excluded_payment_types: [
                { id: 'ticket' }, // efectivo (Rapipago, Pago Fácil)
                { id: 'atm' },    // pago en cajero / transferencia offline
              ],
            },
            notification_url: 'https://cartasahora-proxy.cynthiacerg.workers.dev/webhook-mp',
          }),
        });
        const mpData = await mpRes.json();
        if (!mpRes.ok) return json({ error: mpData.message || 'Error creando preferencia MP' }, 500);

        return json({ url: mpData.init_point, id: mpData.id });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 4/4: Webhook MercadoPago ──
    if (path === '/webhook-mp' && request.method === 'POST') {
      try {
        const body = await request.json();

        // MercadoPago envía type=payment con data.id del pago
        if (body.type === 'payment' && body.data?.id) {
          const paymentId = body.data.id;

          const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}` },
          });
          const payment = await payRes.json();

          if (payment.status === 'approved') {
            let meta = {};
            try { meta = JSON.parse(payment.external_reference || '{}'); } catch {}

            await env.PAGOS_KV.put(
              `pago:${paymentId}`,
              JSON.stringify({
                confirmado: true,
                producto:   meta.producto  || '',
                nombre:     meta.nombre    || '',
                email:      meta.email     || payment.payer?.email || '',
                fecha:      meta.fecha     || '',
                hora:       meta.hora      || '',
                ciudad:     meta.ciudad    || '',
                pais:       meta.pais      || '',
                pasarela:   'mercadopago',
                monto:      payment.transaction_amount || 0,
                moneda:     payment.currency_id || 'ARS',
                timestamp:  Date.now(),
              }),
              { expirationTtl: 86400 }
            );

            // Notificación interna
            await notificarCompraInterna(env, String(paymentId), {
              ...meta,
              email: meta.email || payment.payer?.email || '',
              pasarela: 'mercadopago',
              monto: payment.transaction_amount, moneda: payment.currency_id || 'ARS',
            });
          }
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    // ── RUTA: Validar código promo (server-side, con límite mensual) ──
    if (path === '/validar-promo' && request.method === 'POST') {
      try {
        const { codigo } = await request.json();
        const ingresado = (codigo || '').trim().toUpperCase();
        const valido = (env.PROMO_CODE || '').trim().toUpperCase();
        if (!valido || ingresado !== valido) {
          return json({ valido: false });
        }
        // Límite mensual de usos
        const mes = new Date().toISOString().slice(0, 7); // YYYY-MM
        const contKey = `promo-uso:${mes}`;
        const usos = parseInt(await env.PAGOS_KV.get(contKey) || '0');
        if (usos >= 50) {
          return json({ valido: false, error: 'limite_mensual' });
        }
        await env.PAGOS_KV.put(contKey, String(usos + 1), { expirationTtl: 60 * 60 * 24 * 40 });
        // Emitir token de un solo uso (válido 1 hora) que autoriza el envío
        const token = crypto.randomUUID();
        await env.PAGOS_KV.put(`promo-token:${token}`, '1', { expirationTtl: 3600 });
        return json({ valido: true, token });
      } catch (e) {
        return json({ valido: false, error: e.message }, 500);
      }
    }

    // ── RUTA: Verificar pago ──
    if (path === '/verificar-pago' && request.method === 'GET') {
      const sessionId = url.searchParams.get('session_id');
      if (!sessionId) return json({ confirmado: false, error: 'Falta session_id' }, 400);
      const data = await env.PAGOS_KV.get(`pago:${sessionId}`, 'json');
      if (data?.confirmado) {
        return json({ confirmado: true, monto: data.monto || 0, moneda: data.moneda || '' });
      }
      return json({ confirmado: false });
    }

    // ── RUTA: Guardar lead ──
    // Guarda/fusiona el lead. Opcionalmente incluye los datos de nacimiento y la
    // carta natal ya calculada (posiciones, sin el SVG) para poder recalcular
    // tránsitos sin re-gastar. Emite un token random estable para el flujo ?lead=.
    if (path === '/guardar-lead' && request.method === 'POST') {
      try {
        const { email, nombre, acepta_marketing, nacimiento, cartaNatal } = await request.json();
        if (!email || !email.includes('@')) return json({ error: 'Email inválido' }, 400);
        const key = `lead:${email.toLowerCase().trim()}`;
        // Fusionar con lo que ya haya guardado para no pisar datos previos
        let prev = {};
        try { prev = JSON.parse(await env.LEADS_KV.get(key)) || {}; } catch {}
        const token = prev.token || crypto.randomUUID(); // estable por lead
        const lead = {
          ...prev,
          email,
          nombre: nombre || prev.nombre || '',
          acepta_marketing: !!acepta_marketing || !!prev.acepta_marketing,
          token,
          nacimiento: (nacimiento && nacimiento.fecha) ? nacimiento : prev.nacimiento,
          cartaNatal: (cartaNatal && cartaNatal.subject) ? cartaNatal : prev.cartaNatal,
          timestamp: prev.timestamp || Date.now(),            // no reiniciar el reloj del seguimiento
          seguimiento_enviado: prev.seguimiento_enviado || false,
        };
        const ttl = { expirationTtl: 60 * 60 * 24 * 365 * 2 }; // 2 años
        // Metadata para que el cron de seguimiento filtre sin leer el valor.
        await env.LEADS_KV.put(key, JSON.stringify(lead), {
          ...ttl,
          metadata: { ts: lead.timestamp, mkt: lead.acepta_marketing === true, done: lead.seguimiento_enviado === true },
        });
        // Puntero token -> email para buscar el lead por token en el retorno del mail
        await env.LEADS_KV.put(`lead-token:${token}`, email.toLowerCase().trim(), ttl);
        return json({ ok: true, token });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA: Obtener lead por token (retorno del mail ?lead=) ──
    // El token es aleatorio e inadivinable, por eso puede devolver los datos.
    if (path === '/lead' && request.method === 'GET') {
      try {
        const token = url.searchParams.get('token');
        if (!token) return json({ error: 'Falta token' }, 400);
        const email = await env.LEADS_KV.get(`lead-token:${token}`);
        if (!email) return json({ error: 'no encontrado' }, 404);
        let lead = {};
        try { lead = JSON.parse(await env.LEADS_KV.get(`lead:${email}`)) || {}; } catch {}
        return json({
          nombre: lead.nombre || '',
          email: lead.email || email,
          nacimiento: lead.nacimiento || null,
          cartaNatal: lead.cartaNatal || null,
        });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA: Listar leads (protegida) ──
    if (path === '/listar-leads' && request.method === 'GET') {
      // Solo por header Authorization: nunca por query param (las URLs quedan en logs/historial).
      const authHeader = request.headers.get('Authorization') || '';
      if (!env.ADMIN_SECRET || authHeader !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: 'No autorizado' }, 401);
      try {
        const list = await env.LEADS_KV.list({ prefix: 'lead:' });
        const leads = await Promise.all(
          list.keys.map(async k => {
            const val = await env.LEADS_KV.get(k.name);
            try { return JSON.parse(val); } catch { return null; }
          })
        );
        return json({ leads: leads.filter(Boolean) });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(procesarSeguimientos(env));
  },
};