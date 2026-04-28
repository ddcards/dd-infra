'use server'

import { db } from '@/db'
import { players } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function removeBackground(playerId: string, imageUrl: string) {
  try {
    // Call Photoroom API to remove background
    const formData = new FormData()
    formData.append('image_file', imageUrl)
    
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.PHOTOROOM_API_KEY!,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Background removal failed')
    }

    const result = await response.json()
    
    // Upload clean image to R2 and update player
    // TODO: Implement R2 upload for clean image
    const cleanImageUrl = result.image_url

    await db.update(players)
      .set({ 
        cleanImageUrl,
        status: 'processing'
      })
      .where(eq(players.id, playerId))

    return { success: true, cleanImageUrl }
  } catch (error: any) {
    return { error: error.message }
  }
}
