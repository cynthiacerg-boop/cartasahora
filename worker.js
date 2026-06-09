export default {
  async fetch(request, env) {

    const ALLOWED_ORIGIN = 'https://cartasahora.espaciolibra.com';
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
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
            max_tokens: 6000,
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

    // ── RUTA 5: Enviar lectura por email via SendGrid ──
    if (path === '/enviar-lectura' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, nombre, producto, lectura, codigoPromo, fecha, hora, ciudad, pais } = body;

        const CODIGO_PRUEBA = 'ESPACIO2025';
        const esPrueba = codigoPromo === CODIGO_PRUEBA;

        if (!esPrueba && !body.pagado) {
          return json({ error: 'Pago no confirmado' }, 403);
        }

        // Si el frontend ya generó el texto, usarlo directamente
        let texto = body.texto || '';
        if (!texto) {
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
          texto = claudeData.content?.map(b => b.text || '').join('') || '';
        }

        // Si hay email, mandar por SendGrid
        if (email) {
          const productos = {
            'carta-completa': { nombre: 'Carta Natal Completa', precio: '$6 USD' },
            'revolucion-solar': { nombre: 'Revolución Solar', precio: '$9 USD' },
            'sinastria': { nombre: 'Sinastría — Compatibilidad de Pareja', precio: '$9 USD' },
            'transitos': { nombre: 'Tránsitos Actuales', precio: '$5 USD' },
            'pregunta': { nombre: 'Pregunta Puntual', precio: '$2 USD' },
            'lectura-profunda': { nombre: 'Lectura Profunda · Análisis Completo', precio: '$13 USD' },
          };

          const prod = productos[producto] || { nombre: producto, precio: '' };

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
      <a href="https://cartasahora.espaciolibra.com?upgrade=lectura-profunda&nombre=${encodeURIComponent(nombre||'')}&fecha=${encodeURIComponent(fecha||'')}&hora=${encodeURIComponent(hora||'')}&ciudad=${encodeURIComponent(ciudad||'')}&pais=${encodeURIComponent(pais||'Argentina')}" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">✦ Quiero mi lectura profunda · USD 7</a>
      <p style="font-size:11px;color:#aaa;margin:12px 0 0;">Pago seguro vía PayPal · Entrega en menos de 5 min</p>
    </div>` : ''}
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
        }

        return json({ ok: true, texto });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA: Crear sesión de Stripe ──
    if (path === '/crear-sesion-stripe' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { producto, nombre, email, fecha, hora, ciudad, pais } = body;

        const PRECIOS = {
          'carta-completa': 'price_1TfiSU4BokZtOqeqkyozis2N',
          'proposito-vida': 'price_1TfiTK4BokZtOqeqJcJik2Xk',
          'transitos': 'price_1TfiUL4BokZtOqeqiFKkCLgb',
          'pregunta': 'price_1TfiUr4BokZtOqeqXdfWXxa7',
          'revolucion-solar': 'price_1TfiVK4BokZtOqeqA3Dv1qkB',
          'sinastria': 'price_1TfiW34BokZtOqeqbGzYrcY6',
          'lectura-profunda': 'price_1TfiWa4BokZtOqeqo9LBwU9e',
          'revolucion-lunar': 'price_1TfiYO4BokZtOqeqH7dufScH',
        };

        const priceId = PRECIOS[producto];
        if (!priceId) return json({ error: 'Producto no válido' }, 400);

        const successUrl = 'https://cartasahora.espaciolibra.com/?lectura=ok' +
          '&session_id={CHECKOUT_SESSION_ID}' +
          '&producto=' + encodeURIComponent(producto) +
          '&nombre=' + encodeURIComponent(nombre) +
          '&fecha=' + encodeURIComponent(fecha || '') +
          '&hora=' + encodeURIComponent(hora || '') +
          '&ciudad=' + encodeURIComponent(ciudad || '') +
          '&pais=' + encodeURIComponent(pais || '');

        const cancelUrl = 'https://cartasahora.espaciolibra.com/?pago=cancelado';

        let stripeBody = 'payment_method_types[]=card' +
          '&line_items[0][price]=' + priceId +
          '&line_items[0][quantity]=1' +
          '&mode=payment' +
          '&success_url=' + encodeURIComponent(successUrl) +
          '&cancel_url=' + encodeURIComponent(cancelUrl) +
          '&metadata[producto]=' + encodeURIComponent(producto) +
          '&metadata[nombre]=' + encodeURIComponent(nombre) +
          '&metadata[email]=' + encodeURIComponent(email || '') +
          '&metadata[fecha]=' + encodeURIComponent(fecha || '') +
          '&metadata[hora]=' + encodeURIComponent(hora || '') +
          '&metadata[ciudad]=' + encodeURIComponent(ciudad || '') +
          '&metadata[pais]=' + encodeURIComponent(pais || '');

        if (email) stripeBody += '&customer_email=' + encodeURIComponent(email);

        const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: stripeBody,
        });

        const data = await res.json();
        if (!res.ok) return json({ error: data.error?.message || 'Error Stripe' }, 500);
        return json({ url: data.url });

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA: Verificar pago ──
    if (path === '/verificar-pago' && request.method === 'GET') {
      const sessionId = url.searchParams.get('session_id');
      if (!sessionId) return json({ confirmado: false, error: 'Falta session_id' }, 400);
      const data = await env.PAGOS_KV.get(`pago:${sessionId}`, 'json');
      if (data?.confirmado) {
        return json({ confirmado: true });
      }
      return json({ confirmado: false });
    }

    // ── RUTA: Webhook de Stripe ──
    if (path === '/webhook' && request.method === 'POST') {
      try {
        const rawBody = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
          return new Response('Sin firma', { status: 400 });
        }

        const secret = env.STRIPE_WEBHOOK_SECRET;

        let timestamp = '';
        let v1Sig = '';
        for (const part of signature.split(',')) {
          if (part.startsWith('t=')) timestamp = part.slice(2);
          if (part.startsWith('v1=')) v1Sig = part.slice(3);
        }

        if (!timestamp || !v1Sig) {
          return new Response('Firma inválida', { status: 400 });
        }

        const ts = parseInt(timestamp);
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - ts) > 300) {
          return new Response('Timestamp expirado', { status: 400 });
        }

        const payload = `${timestamp}.${rawBody}`;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          'raw',
          encoder.encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        const signatureBuffer = await crypto.subtle.sign(
          'HMAC',
          key,
          encoder.encode(payload)
        );
        const expectedSig = Array.from(new Uint8Array(signatureBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        if (expectedSig !== v1Sig) {
          return new Response('Firma no coincide', { status: 400 });
        }

        let event;
        try {
          event = JSON.parse(rawBody);
        } catch(parseErr) {
          return new Response('JSON inválido', { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          const sessionId = session.id;
          const metadata = session.metadata || {};

          await env.PAGOS_KV.put(
            `pago:${sessionId}`,
            JSON.stringify({
              confirmado: true,
              producto: metadata.producto,
              nombre: metadata.nombre,
              email: metadata.email || session.customer_email || '',
              fecha: metadata.fecha,
              hora: metadata.hora,
              ciudad: metadata.ciudad,
              pais: metadata.pais,
              timestamp: Date.now(),
            }),
            { expirationTtl: 86400 }
          );
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    // ── RUTA: Guardar lead ──
    if (path === '/guardar-lead' && request.method === 'POST') {
      try {
        const { email, nombre, acepta_marketing } = await request.json();
        if (!email || !email.includes('@')) return json({ error: 'Email inválido' }, 400);
        await env.LEADS_KV.put(
          `lead:${email.toLowerCase().trim()}`,
          JSON.stringify({ email, nombre: nombre || '', acepta_marketing: !!acepta_marketing, timestamp: Date.now() }),
          { expirationTtl: 60 * 60 * 24 * 365 * 2 } // 2 años
        );
        return json({ ok: true });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── RUTA: Listar leads (protegida) ──
    if (path === '/listar-leads' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization') || '';
      if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: 'No autorizado' }, 401);
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
};