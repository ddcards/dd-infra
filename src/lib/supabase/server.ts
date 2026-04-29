import { type CookieMethodsServer, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from '@/types/supabase'

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured')
}

const resolvedSupabaseUrl: string = supabaseUrl
const resolvedSupabaseAnonKey: string = supabaseAnonKey

type SetAllParams = Parameters<NonNullable<CookieMethodsServer['setAll']>>

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    resolvedSupabaseUrl,
    resolvedSupabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: SetAllParams[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignored - setting cookies can fail during static generation
          }
        },
      },
    }
  )
}
