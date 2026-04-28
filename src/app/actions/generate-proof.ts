'use server'

import { db } from '@/db'
import { players } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generateProof(playerId: string, cleanImageUrl: string, name: string, jerseyNumber: string) {
  try {
    // Call Placid.app API to generate trading card proof
    const response = await fetch('https://api.placid.app/api/templates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PLACID_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: 'trading-card',
        layers: {
          background: cleanImageUrl,
          name: {
            text: name,
          },
          jerseyNumber: {
            text: jerseyNumber,
          },
          watermark: {
            text: 'PROOF',
          },
        },
        format: 'png',
      }),
    })

    if (!response.ok) {
      throw new Error('Proof generation failed')
    }

    const result = await response.json()
    const proofImageUrl = result.image_url

    // Upload proof to R2 and update player
    // TODO: Implement R2 upload for proof image
    await db.update(players)
      .set({ 
        proofImageUrl,
        status: 'proof_ready'
      })
      .where(eq(players.id, playerId))

    return { success: true, proofImageUrl }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function generatePrintImage(playerId: string, cleanImageUrl: string, name: string, jerseyNumber: string) {
  try {
    // Call Placid.app API to generate high-res print image (without watermark)
    const response = await fetch('https://api.placid.app/api/templates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PLACID_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: 'trading-card',
        layers: {
          background: cleanImageUrl,
          name: {
            text: name,
          },
          jerseyNumber: {
            text: jerseyNumber,
          },
        },
        format: 'pdf',
        quality: 'high',
      }),
    })

    if (!response.ok) {
      throw new Error('Print image generation failed')
    }

    const result = await response.json()
    const printImageUrl = result.image_url

    // Upload print image to R2 and update player
    // TODO: Implement R2 upload for print image
    await db.update(players)
      .set({ 
        printImageUrl,
        status: 'approved'
      })
      .where(eq(players.id, playerId))

    return { success: true, printImageUrl }
  } catch (error: any) {
    return { error: error.message }
  }
}
