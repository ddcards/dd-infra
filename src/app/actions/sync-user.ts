'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function syncUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  })

  if (existingUser) {
    return { success: true, user: existingUser }
  }

  const newUser = await db.insert(users).values({
    id: user.id,
    email: user.email!,
    createdAt: new Date(),
  }).returning()

  return { success: true, user: newUser[0] }
}
