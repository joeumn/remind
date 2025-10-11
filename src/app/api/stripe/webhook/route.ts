import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  try {
    // Update user subscription status
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: planId.includes('elite') ? 'elite' : 'pro',
        subscriptionStatus: 'active',
        updatedAt: new Date()
      }
    })

    console.log(`User ${userId} successfully subscribed to ${planId}`)
  } catch (error) {
    console.error('Failed to update user subscription:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  const planId = subscription.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing metadata in subscription:', subscription.id)
    return
  }

  try {
    // Update user subscription details
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: planId.includes('elite') ? 'elite' : 'pro',
        subscriptionStatus: 'active',
        updatedAt: new Date()
      }
    })

    console.log(`Subscription created for user ${userId}: ${subscription.id}`)
  } catch (error) {
    console.error('Failed to update user subscription:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  const planId = subscription.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing metadata in subscription update:', subscription.id)
    return
  }

  try {
    const status = subscription.status === 'active' ? 'active' : 'inactive'
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: planId.includes('elite') ? 'elite' : 'pro',
        subscriptionStatus: status,
        updatedAt: new Date()
      }
    })

    console.log(`Subscription updated for user ${userId}: ${subscription.id} - ${status}`)
  } catch (error) {
    console.error('Failed to update user subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('Missing userId in subscription deletion:', subscription.id)
    return
  }

  try {
    // Downgrade user to free plan
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'free',
        subscriptionStatus: 'cancelled',
        updatedAt: new Date()
      }
    })

    console.log(`Subscription cancelled for user ${userId}: ${subscription.id}`)
  } catch (error) {
    console.error('Failed to update user subscription:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  console.log(`Payment succeeded for subscription: ${subscriptionId}`)
  
  // You can add additional logic here like:
  // - Send confirmation email
  // - Extend subscription period
  // - Update billing records
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  console.log(`Payment failed for subscription: ${subscriptionId}`)
  
  // You can add additional logic here like:
  // - Send payment failure notification
  // - Suspend account features
  // - Send retry payment email
}
