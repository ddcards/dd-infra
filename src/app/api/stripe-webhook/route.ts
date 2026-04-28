import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { db } from '@/db'
import { teams, players, orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata

      if (!metadata) {
        return NextResponse.json({ error: 'No metadata in session' }, { status: 400 })
      }

      const { teamName, sport, rosterSize } = metadata
      const userId = session.customer_email || ''

      // Get user by email
      const user = await db.query.users.findFirst({
        where: (users: any, { eq }) => eq(users.email, userId),
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Create team with paid status
      const newTeam = await db.insert(teams).values({
        id: uuidv4(),
        userId: user.id,
        teamName,
        sport,
        rosterSize: parseInt(rosterSize),
        paymentStatus: 'paid',
        createdAt: new Date(),
      }).returning()

      // Create player slots
      const playerInserts = []
      for (let i = 0; i < parseInt(rosterSize); i++) {
        playerInserts.push({
          id: uuidv4(),
          teamId: newTeam[0].id,
          name: `Player ${i + 1}`,
          jerseyNumber: `${i + 1}`,
          position: 'TBD',
          status: 'empty' as const,
          createdAt: new Date(),
        })
      }

      await db.insert(players).values(playerInserts)

      // Create order
      await db.insert(orders).values({
        id: uuidv4(),
        teamId: newTeam[0].id,
        stripeSessionId: session.id,
        status: 'paid',
        createdAt: new Date(),
      })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
