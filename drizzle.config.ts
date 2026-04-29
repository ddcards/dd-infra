import { config as loadEnv } from 'dotenv'
import type { Config } from 'drizzle-kit'

loadEnv({ path: '.env.local', override: true })

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL is required to run Drizzle migrations')
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL,
  },
} satisfies Config
