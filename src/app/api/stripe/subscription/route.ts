import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { authenticateRequest } from '@/lib/auth'
import { handleApiError } from '@/lib/errorHandler'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find customer in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ 
        subscription: null,
        message: 'No Stripe customer found'
      })
    }

    const customer = customers.data[0]

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ 
        subscription: null,
        message: 'No active subscription found'
      })
    }

    const subscription = subscriptions.data[0]

    // Get subscription details
    const subscriptionData = {
      id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      plan: {
        id: subscription.items.data[0]?.price.id,
        name: subscription.items.data[0]?.price.nickname || 'Pro Plan',
        amount: subscription.items.data[0]?.price.unit_amount || 0,
        interval: subscription.items.data[0]?.price.recurring?.interval || 'month'
      }
    }

    return NextResponse.json({ subscription: subscriptionData })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return handleApiError(error)
  }
}
