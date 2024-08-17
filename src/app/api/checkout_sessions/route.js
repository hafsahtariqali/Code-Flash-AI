import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  const { amount, currency, interval } = await req.json();

  const params = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Pro subscription',
          },
          unit_amount: formatAmountForStripe(amount, currency), // e.g., €10.00
          recurring: {
            interval: interval,
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('Referer')}result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('Referer')}result?session_id={CHECKOUT_SESSION_ID}`,
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
