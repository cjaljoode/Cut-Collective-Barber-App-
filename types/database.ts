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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: "client" | "barber" | "owner"
          shop_id: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          full_name?: string
          role: string
          shop_id?: string
        }
      }
      appointments: {
        Row: {
          id: string
          shop_id: string
          barber_id: string
          client_id: string
          start_time: string
          status: "scheduled" | "completed" | "cancelled"
        }
      }
      services: {
        Row: {
          id: string
          name: string
          price: number
          duration_minutes: number
        }
      }
    }
  }
}
