
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
      fitness_activities: {
        Row: {
          id: string
          user_id: string
          steps: number
          distance: number
          calories: number
          active_minutes: number
          start_time: string
          end_time: string
          activity_type: string
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          steps: number
          distance: number
          calories: number
          active_minutes: number
          start_time: string
          end_time: string
          activity_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          steps?: number
          distance?: number
          calories?: number
          active_minutes?: number
          start_time?: string
          end_time?: string
          activity_type?: string
          created_at?: string
        }
      }
      user_currency: {
        Row: {
          id: string
          user_id: string
          coins: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          coins: number
          last_updated: string
        }
        Update: {
          id?: string
          user_id?: string
          coins?: number
          last_updated?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
