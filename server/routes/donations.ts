/**
 * donations.ts (router)
 * Integración con Stripe Checkout: crea sesión y retorna URL.
 */

import { Router } from 'express'
import Stripe from 'stripe'
import { env } from '../config/env'

export const donationsRouter = Router()

/** POST /api/donations/checkout - Crea sesión de pago en Stripe */
donationsRouter.post('/checkout', async (req, res) => {
  if (!env.STRIPE_SECRET) {
    return res.status(500).json({ message: 'Stripe no configurado' })
  }
  const stripe = new Stripe(env.STRIPE_SECRET, { apiVersion: '2025-08-27.basil' })

  const { amount = 5000, currency = 'usd', description = 'PetConnect Donation' } = req.body || {}

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
    success_url: env.STRIPE_SUCCESS_URL,
    cancel_url: env.STRIPE_CANCEL_URL,
  })

  res.json({ url: session.url })
})
