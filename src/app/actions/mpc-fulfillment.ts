'use server'

import { db } from '@/db'
import { orders, players } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function submitToMPC(teamId: string, players: any[]) {
  try {
    // Compile print image URLs
    const printImages = players
      .filter(p => p.printImageUrl)
      .map(p => ({
        name: p.name,
        jerseyNumber: p.jerseyNumber,
        imageUrl: p.printImageUrl,
      }))

    // MakePlayingCards API integration
    const response = await fetch('https://www.makeplayingcards.com/api/order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MPC_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: 'trading-cards',
        quantity: players.length,
        images: printImages,
        specifications: {
          size: '2.5x3.5',
          finish: 'glossy',
          paper: 'premium',
        },
      }),
    })

    if (!response.ok) {
      throw new Error('MPC order submission failed')
    }

    const result = await response.json()
    const mpcOrderId = result.order_id

    // Update order with MPC order ID
    await db.update(orders)
      .set({ 
        mpcOrderId,
        status: 'sent_to_printer'
      })
      .where(eq(orders.teamId, teamId))

    return { success: true, mpcOrderId }
  } catch (error: any) {
    return { error: error.message }
  }
}
