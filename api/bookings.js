export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Agendamento online ainda não foi configurado. Entre em contato pelo WhatsApp.' });

  const body = req.body || {};
  const { customer_name, customer_phone, service_id, service_name, price_brl, barber, booking_date, booking_time, duration_minutes } = body;
  if (![customer_name, customer_phone, service_id, service_name, booking_date, booking_time].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Preencha nome, telefone, serviço, data e horário.' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking_date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(booking_time)) {
    return res.status(400).json({ error: 'Data ou horário inválido.' });
  }
  const day = new Date(booking_date + 'T12:00:00').getDay();
  if (day === 0) return res.status(400).json({ error: 'A barbearia não atende aos domingos.' });
  const [hh, mm] = booking_time.split(':').map(Number);
  const mins = hh * 60 + mm;
  if (mins < 540 || mins >= 1200 || mm % 30 !== 0) return res.status(400).json({ error: 'Escolha um horário entre 09h e 20h, em intervalos de 30 minutos.' });
  const dateTime = new Date(booking_date + 'T' + booking_time + ':00');
  if (Number.isNaN(dateTime.getTime())) return res.status(400).json({ error: 'Data inválida.' });

  const record = {
    customer_name: customer_name.trim().slice(0, 80),
    customer_phone: customer_phone.trim().slice(0, 30),
    service_id: service_id.slice(0, 80),
    service_name: service_name.slice(0, 120),
    price_brl: Math.max(0, Number(price_brl) || 0),
    barber: (typeof barber === 'string' && barber.trim() ? barber.trim() : 'A definir').slice(0, 80),
    booking_date,
    booking_time,
    duration_minutes: Math.min(240, Math.max(15, Number(duration_minutes) || 30)),
    status: 'confirmed'
  };

  try {
    const response = await fetch(url.replace(/\/$/, '') + '/rest/v1/bookings', {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(record)
    });
    if (response.status === 409 || response.status === 400) {
      const detail = await response.text();
      if (/exclusion|bookings_no_duplicate_slot|duplicate|conflict/i.test(detail)) {
        return res.status(409).json({ error: 'Esse horário acabou de ser ocupado. Escolha outro horário.' });
      }
      return res.status(400).json({ error: 'Não foi possível validar a reserva. Confira os dados.' });
    }
    if (!response.ok) {
      console.error('Supabase booking error:', response.status, await response.text());
      return res.status(502).json({ error: 'Não foi possível concluir o agendamento agora. Tente novamente ou fale pelo WhatsApp.' });
    }
    return res.status(201).json({ ok: true, booking: (await response.json())[0] });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Erro ao salvar o agendamento. Tente novamente.' });
  }
}
