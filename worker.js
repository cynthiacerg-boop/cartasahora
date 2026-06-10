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

    // ── RUTA 1/4: Crear orden PayPal ──
    if (path === '/crear-pago-paypal' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { producto, nombre, email, fecha, hora, ciudad, pais } = body;

        const PRECIOS_USD = {
          'carta-completa':   { monto: '6.00',  titulo: 'Carta Natal Completa' },
          'proposito-vida':   { monto: '6.00',  titulo: 'Propósito de Vida' },
          'transitos':        { monto: '5.00',  titulo: 'Tránsitos Actuales' },
          'pregunta':         { monto: '2.00',  titulo: 'Pregunta Puntual' },
          'revolucion-solar': { monto: '9.00',  titulo: 'Revolución Solar' },
          'sinastria':        { monto: '9.00',  titulo: 'Sinastría' },
          'lectura-profunda': { monto: '13.00', titulo: 'Lectura Profunda' },
          'revolucion-lunar': { monto: '9.00',  titulo: 'Revolución Lunar' },
        };

        const prod = PRECIOS_USD[producto];
        if (!prod) return json({ error: 'Producto no válido' }, 400);

        // Obtener access token de PayPal
        const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
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
        const orderRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
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

    // ── RUTA 2/4: Webhook PayPal ──
    if (path === '/webhook-paypal' && request.method === 'POST') {
      try {
        const event = await request.json();

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
          'pregunta':         { monto:  7000, titulo: 'Pregunta Puntual' },
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
                timestamp:  Date.now(),
              }),
              { expirationTtl: 86400 }
            );
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
      const querySecret = url.searchParams.get('secret') || '';
      if (authHeader !== `Bearer ${env.ADMIN_SECRET}` && querySecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 401);
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