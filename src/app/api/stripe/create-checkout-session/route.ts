import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { authenticateRequest } from '@/lib/auth'
import { handleApiError } from '@/lib/errorHandler'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, interval, successUrl, cancelUrl } = body

    if (!planId || !interval || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Define pricing plans
    const plans = {
      'pro-monthly': {
        price: 999, // $9.99 in cents
        name: 'Pro Plan (Monthly)',
        description: 'Unlimited events, advanced features, priority support'
      },
      'pro-yearly': {
        price: 9599, // $95.99 in cents (20% discount)
        name: 'Pro Plan (Yearly)',
        description: 'Unlimited events, advanced features, priority support - Save 20%!'
      },
      'elite-monthly': {
        price: 2499, // $24.99 in cents
        name: 'Elite Plan (Monthly)',
        description: 'Everything in Pro plus team collaboration and API access'
      },
      'elite-yearly': {
        price: 23999, // $239.99 in cents (20% discount)
        name: 'Elite Plan (Yearly)',
        description: 'Everything in Pro plus team collaboration and API access - Save 20%!'
      }
    }

    const plan = plans[planId as keyof typeof plans]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
              images: [`${process.env.NEXT_PUBLIC_APP_URL}/icons/remind-icon-512.png`],
            },
            unit_amount: plan.price,
            recurring: {
              interval: interval === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: user.userId,
        planId: planId,
        userEmail: user.email,
      },
      subscription_data: {
        metadata: {
          userId: user.userId,
          planId: planId,
          userEmail: user.email,
        },
      },
      billing_address_collection: 'auto',
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Stripe checkout session creation failed:', error)
    return handleApiError(error)
  }
}
