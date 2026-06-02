export default {
  async fetch(request, env) {

    const ALLOWED_ORIGIN = 'https://cartasahora.espaciolibra.com';
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // ── Rate limiting via KV (crear namespace "RATE_LIMIT" en Cloudflare y vincularlo al worker) ──
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

    // ── RUTA 3: Interpretación via Claude (lectura gratuita) ──
    if (path === '/interpretar' && request.method === 'POST') {
      try {
        const body = await request.json();
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'prompt-caching-2024-07-31',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1500,
            system: body.system
              ? [{ type: 'text', text: body.system, cache_control: { type: 'ephemeral' } }]
              : undefined,
            messages: [{ role: 'user', content: body.prompt }],
          }),
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA 4: Enviar lectura por email via SendGrid ──
    if (path === '/enviar-lectura' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, nombre, producto, lectura, codigoPromo } = body;

        const CODIGO_PRUEBA = 'ESPACIO2025';
        const esPrueba = codigoPromo === CODIGO_PRUEBA;

        if (!esPrueba && !body.pagado) {
          return json({ error: 'Pago no confirmado' }, 403);
        }

        const productos = {
          'carta-completa': { nombre: 'Carta Natal Completa', precio: '$6 USD' },
          'revolucion-solar': { nombre: 'Revolución Solar', precio: '$9 USD' },
          'sinastria': { nombre: 'Sinastría — Compatibilidad de Pareja', precio: '$9 USD' },
          'transitos': { nombre: 'Tránsitos Actuales', precio: '$5 USD' },
          'pregunta': { nombre: 'Pregunta Puntual', precio: '$2 USD' },
          'lectura-profunda': { nombre: 'Lectura Profunda · Análisis Completo', precio: '$13 USD' },
        };

        const prod = productos[producto] || { nombre: producto, precio: '' };

        // Generar lectura con Claude
        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'prompt-caching-2024-07-31',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 6000,
            system: body.system
              ? [{ type: 'text', text: body.system, cache_control: { type: 'ephemeral' } }]
              : undefined,
            messages: [{ role: 'user', content: lectura }],
          }),
        });
        const claudeData = await claudeRes.json();
        const texto = claudeData.content?.map(b => b.text || '').join('') || '';

        // Formatear texto para HTML
        const htmlLectura = texto
          .split('\n')
          .map(linea => {
            if (!linea.trim()) return '<br>';
            if (linea.startsWith('**') && linea.endsWith('**')) {
              return `<h2 style="color:#82B366;font-family:Georgia,serif;font-size:18px;margin:24px 0 8px;border-bottom:1px solid rgba(130,179,102,0.3);padding-bottom:6px;">${linea.replace(/\*\*/g, '')}</h2>`;
            }
            return `<p style="margin:0 0 12px;line-height:1.8;color:#3a3a3a;">${linea.replace(/\*\*/g, '')}</p>`;
          })
          .join('');

        const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#f5f3ef;margin:0;padding:0;font-family:'Georgia',serif;">
  <div style="max-width:620px;margin:0 auto;background:white;">
    <div style="background:#0a0a12;padding:40px 32px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.3em;color:#82B366;text-transform:uppercase;margin:0 0 12px;">Espacio Libra</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#f0ede8;margin:0 0 8px;">${prod.nombre}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0;">Lectura personal para ${nombre}</p>
    </div>
    <div style="padding:32px;border-bottom:1px solid #e8e4de;">
      <p style="font-size:15px;color:#5a5a5a;line-height:1.7;margin:0;">
        Hola <strong>${nombre}</strong>, tu lectura astrológica está lista.
        Tomate el tiempo que necesites para leerla — está hecha especialmente para vos.
      </p>
    </div>
    <div style="padding:32px;">
      ${htmlLectura}
    </div>
    ${producto === 'carta-completa' ? `<div style="background:#f9f7f4;padding:32px;text-align:center;border-top:1px solid #e8e4de;">
      <p style="font-size:14px;color:#5a5a5a;margin:0 0 8px;">¿Querés ir más profundo?</p>
      <p style="font-size:13px;color:#888;margin:0 0 20px;">Análisis completo de todos tus aspectos + coaching evolutivo · Solo USD 7 más</p>
      <a href="https://cartasahora.espaciolibra.com?upgrade=lectura-profunda" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">✦ Quiero mi lectura profunda · USD 7</a>
      <p style="font-size:11px;color:#aaa;margin:12px 0 0;">Pago seguro vía PayPal · Entrega en menos de 5 min</p>
    </div>` : `<div style="background:#f9f7f4;padding:32px;text-align:center;border-top:1px solid #e8e4de;">
      <p style="font-size:14px;color:#5a5a5a;margin:0 0 16px;">¿Querés profundizar más?</p>
      <a href="https://cartasahora.espaciolibra.com" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">Ver más lecturas</a>
    </div>`}
    <div style="padding:24px 32px;text-align:center;background:#0a0a12;">
      <p style="font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.2);margin:0;">
        ESPACIO LIBRA · ASTROLOGÍA EVOLUTIVA · cartasahora.espaciolibra.com
      </p>
    </div>
  </div>
</body>
</html>`;

        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.SENDGRID_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email, name: nombre }] }],
            from: { email: 'cartas@espaciolibra.com', name: 'Espacio Libra' },
            reply_to: { email: 'contacto@espaciolibra.com', name: 'Cynthia · Espacio Libra' },
            subject: `✦ Tu ${prod.nombre} — Espacio Libra`,
            content: [{ type: 'text/html', value: emailHtml }],
          }),
        });

        if (!sgRes.ok) {
          const err = await sgRes.text();
          return json({ error: 'Error al enviar email: ' + err }, 500);
        }

        return json({ ok: true, mensaje: 'Lectura enviada a ' + email });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
