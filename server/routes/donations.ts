/**
 * donations.ts (router)
 * Integración con Stripe Checkout: crea sesión y retorna URL.
 */

import { Router } from 'express'
import Stripe from 'stripe'
import { env } from '../config/env'
import { Donation } from '../models/Donation' // New import
import { requireAuth, requireAdmin } from '../middleware/auth'; // New import

export const donationsRouter = Router()

/** POST /api/donations/checkout - Crea sesión de pago en Stripe */
donationsRouter.post('/checkout', async (req, res) => {
  if (!env.STRIPE_SECRET) {
    return res.status(500).json({ message: 'Stripe no configurado' })
  }
  const stripe = new Stripe(env.STRIPE_SECRET, { apiVersion: '2025-08-27.basil' })

  const { amount = 5000, currency = 'usd', description = 'PetConnect Donation', metadata = {} } = req.body || {} // Destructure metadata

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Number(amount),
            product_data: {
              name: 'Donation',
              description,
            },
          },
        },
      ],
      success_url: `${env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`, // Pass session ID
      cancel_url: env.STRIPE_CANCEL_URL,
      metadata: metadata, // Pass metadata to Stripe session
    })

    // Create a pending donation record in our DB
    const newDonation = new Donation({
      stripeSessionId: session.id,
      amount: Number(amount) / 100, // Store in dollars
      currency: currency,
      description: description,
      donorEmail: metadata.donorEmail || metadata.userName, // Use metadata for donor info
      status: 'pending',
    });
    await newDonation.save();

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating Stripe Checkout session or pending donation:', error);
    res.status(500).json({ message: 'Error al iniciar el proceso de donación.' });
  }
})

/**
 * POST /api/donations/confirm-payment - Confirma el pago de una donación
 * @access Public (called from frontend success page)
 */
donationsRouter.post('/confirm-payment', async (req, res) => {
  if (!env.STRIPE_SECRET) {
    return res.status(500).json({ message: 'Stripe no configurado' });
  }
  const stripe = new Stripe(env.STRIPE_SECRET, { apiVersion: '2025-08-27.basil' });

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: 'Falta el ID de sesión de Stripe.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const donation = await Donation.findOneAndUpdate(
        { stripeSessionId: sessionId, status: 'pending' },
        { status: 'completed' },
        { new: true }
      );

      if (!donation) {
        console.warn(`Donation with session ID ${sessionId} not found or already completed.`);
        return res.status(404).json({ message: 'Donación no encontrada o ya completada.' });
      }
      res.json({ success: true, donation });
    } else {
      // Handle other payment statuses like 'unpaid', 'no_payment_required'
      console.warn(`Payment for session ${sessionId} is not paid. Status: ${session.payment_status}`);
      res.status(400).json({ message: `El pago no se ha completado. Estado: ${session.payment_status}` });
    }
  } catch (error) {
    console.error('Error confirming Stripe payment:', error);
    res.status(500).json({ message: 'Error al confirmar el pago.' });
  }
});

/**
 * GET /api/donations - Obtiene todas las donaciones
 * @access Private (Admin)
 */
donationsRouter.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ items: donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Error al obtener las donaciones.' });
  }
});
