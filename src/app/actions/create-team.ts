'use server'

import { db } from '@/db'
import { teams, players } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const teamName = formData.get('teamName') as string
  const sport = formData.get('sport') as string
  const rosterSize = parseInt(formData.get('rosterSize') as string)

  if (!teamName || !sport || !rosterSize) {
    return { error: 'Missing required fields' }
  }

  const newTeam = await db.insert(teams).values({
    id: uuidv4(),
    userId: user.id,
    teamName,
    sport,
    rosterSize,
    paymentStatus: 'unpaid',
    createdAt: new Date(),
  }).returning()

  return { success: true, team: newTeam[0] }
}

export async function getTeams() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const userTeams = await db.query.teams.findMany({
    where: eq(teams.userId, user.id),
  })

  return { success: true, teams: userTeams }
}
