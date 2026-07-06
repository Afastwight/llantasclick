import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const productCatalog = {
  'michelin-primacy-4': {
    name: 'Michelin Primacy 4+',
    description: '205/55 R16 · Sedán · Alto rendimiento',
    price: 15500
  },
  'bridgestone-dueler-hp': {
    name: 'Bridgestone Dueler H/P Sport',
    description: '235/65 R17 · SUV · Carretera',
    price: 19800
  },
  'pirelli-pzero-pz4': {
    name: 'Pirelli P Zero PZ4',
    description: '225/40 R18 · Sport · UHP',
    price: 24200
  },
  'continental-premiumcontact-7': {
    name: 'Continental PremiumContact 7',
    description: '195/65 R15 · Sedán · Confort',
    price: 13000
  },
  'goodyear-wrangler-at': {
    name: 'Goodyear Wrangler AT Adventure',
    description: '265/70 R17 · SUV · All-Terrain',
    price: 22400
  },
  'michelin-xze-2': {
    name: 'Michelin XZE 2+ Radial',
    description: '295/80 R22.5 · Comercial · Larga distancia',
    price: 48000
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {
    const { cart } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        error: 'El carrito está vacío.'
      });
    }

    const lineItems = cart.map((item) => {
      const product = productCatalog[item.id];

      if (!product) {
        throw new Error(`Producto inválido: ${item.id}`);
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Cantidad inválida para: ${item.id}`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description
          },
          unit_amount: product.price
        },
        quantity
      };
    });

    const baseUrl = process.env.SITE_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`
    });

    return res.status(200).json({
      url: session.url
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}