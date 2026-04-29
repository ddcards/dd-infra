import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('SUPABASE_DB_URL (or DATABASE_URL) must be set')
}

const client = postgres(connectionString, {
  ssl: connectionString.includes('localhost') ? false : 'require',
  prepare: false,
})

export const db = drizzle(client, { schema })
