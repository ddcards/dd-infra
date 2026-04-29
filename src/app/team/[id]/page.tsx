import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { teams, players } from '@/db/schema'
import { eq } from 'drizzle-orm'
import TeamContent from './team-content'

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, id),
  })

  if (!team) {
    redirect('/dashboard')
  }

  if (team.userId !== user.id) {
    redirect('/dashboard')
  }

  const teamPlayers = await db.query.players.findMany({
    where: eq(players.teamId, id),
  })

  return <TeamContent team={team} players={teamPlayers} />
}
