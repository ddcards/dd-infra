'use server'

import { db } from '@/db'
import { players } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function uploadPhoto(playerId: string, fileUrl: string) {
  try {
    await db.update(players)
      .set({ 
        rawImageUrl: fileUrl,
        status: 'uploaded'
      })
      .where(eq(players.id, playerId))

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updatePlayer(playerId: string, data: { name: string; jerseyNumber: string; position: string }) {
  try {
    await db.update(players)
      .set(data)
      .where(eq(players.id, playerId))

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
