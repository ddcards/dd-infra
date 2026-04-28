export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          user_id: string
          team_name: string
          sport: string
          roster_size: number
          payment_status: 'unpaid' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_name: string
          sport: string
          roster_size: number
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          team_name?: string
          sport?: string
          roster_size?: number
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          team_id: string
          name: string
          jersey_number: string
          position: string
          raw_image_url: string | null
          clean_image_url: string | null
          proof_image_url: string | null
          print_image_url: string | null
          status: 'empty' | 'uploaded' | 'processing' | 'proof_ready' | 'approved'
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          name: string
          jersey_number: string
          position: string
          raw_image_url?: string | null
          clean_image_url?: string | null
          proof_image_url?: string | null
          print_image_url?: string | null
          status?: 'empty' | 'uploaded' | 'processing' | 'proof_ready' | 'approved'
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          name?: string
          jersey_number?: string
          position?: string
          raw_image_url?: string | null
          clean_image_url?: string | null
          proof_image_url?: string | null
          print_image_url?: string | null
          status?: 'empty' | 'uploaded' | 'processing' | 'proof_ready' | 'approved'
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          team_id: string
          stripe_session_id: string
          mpc_order_id: string | null
          status: 'pending_payment' | 'paid' | 'sent_to_printer'
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          stripe_session_id: string
          mpc_order_id?: string | null
          status?: 'pending_payment' | 'paid' | 'sent_to_printer'
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          stripe_session_id?: string
          mpc_order_id?: string | null
          status?: 'pending_payment' | 'paid' | 'sent_to_printer'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
