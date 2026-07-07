import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        error: 'Falta session_id.'
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: 'Falta STRIPE_SECRET_KEY.'
      });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: 'Faltan variables de Supabase en el servidor.'
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        error: 'El pago todavía no está confirmado.'
      });
    }

    const userId = session.metadata?.user_id;

    if (!userId) {
      return res.status(400).json({
        error: 'La sesión de Stripe no tiene usuario asociado.'
      });
    }

    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existingOrder) {
      return res.status(200).json({
        message: 'El pedido ya estaba registrado.',
        orderId: existingOrder.id
      });
    }

    const items = session.line_items?.data?.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      amount_total: item.amount_total / 100,
      currency: item.currency
    })) || [];

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        total: session.amount_total / 100,
        status: 'pagado',
        stripe_session_id: session.id,
        items
      })
      .select()
      .single();

    if (orderError) {
      return res.status(500).json({
        error: orderError.message
      });
    }

    return res.status(200).json({
      message: 'Pedido guardado correctamente.',
      orderId: order.id
    });
  } catch (error) {
    console.error('Save order error:', error);

    return res.status(500).json({
      error: error.message || 'Error al guardar el pedido.'
    });
  }
}