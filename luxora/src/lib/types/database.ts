export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_profile_id: string | null
          business_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      business_members: {
        Row: {
          business_id: string
          created_at: string
          id: string
          profile_id: string
          role: string
          status: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          profile_id: string
          role: string
          status?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address_line1: string | null
          business_type: string
          business_type_other: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string
          owner_profile_id: string
          phone: string | null
          slug: string
          state: string | null
          status: string
          updated_at: string
          zip: string | null
        }
        Insert: {
          address_line1?: string | null
          business_type: string
          business_type_other?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          owner_profile_id: string
          phone?: string | null
          slug: string
          state?: string | null
          status?: string
          updated_at?: string
          zip?: string | null
        }
        Update: {
          address_line1?: string | null
          business_type?: string
          business_type_other?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          owner_profile_id?: string
          phone?: string | null
          slug?: string
          state?: string | null
          status?: string
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      legal_acceptances: {
        Row: {
          accepted_at: string
          business_id: string | null
          document_type: string
          id: string
          ip_address: string | null
          profile_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          business_id?: string | null
          document_type: string
          id?: string
          ip_address?: string | null
          profile_id: string
          version: string
        }
        Update: {
          accepted_at?: string
          business_id?: string | null
          document_type?: string
          id?: string
          ip_address?: string | null
          profile_id?: string
          version?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          active: boolean
          address_line1: string | null
          business_id: string
          city: string | null
          created_at: string
          id: string
          is_primary: boolean
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          active?: boolean
          address_line1?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          active?: boolean
          address_line1?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      plan_entitlements: {
        Row: {
          id: string
          key: string
          plan_id: string
          value_boolean: boolean | null
          value_integer: number | null
          value_text: string | null
          value_type: string
        }
        Insert: {
          id?: string
          key: string
          plan_id: string
          value_boolean?: boolean | null
          value_integer?: number | null
          value_text?: string | null
          value_type: string
        }
        Update: {
          id?: string
          key?: string
          plan_id?: string
          value_boolean?: boolean | null
          value_integer?: number | null
          value_text?: string | null
          value_type?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          badge: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          key: string
          name: string
          price_monthly_cents: number
          updated_at: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          key: string
          name: string
          price_monthly_cents: number
          updated_at?: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          price_monthly_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_platform_admin: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_platform_admin?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_platform_admin?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          business_id: string
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trials: {
        Row: {
          business_id: string
          created_at: string
          id: string
          trial_ends_at: string
          trial_started_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          trial_ends_at: string
          trial_started_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          trial_ends_at?: string
          trial_started_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      business_access_status: {
        Row: {
          business_id: string | null
          is_locked: boolean | null
          subscription_status: string | null
          trial_ends_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_business_admin: {
        Args: { target_business_id: string }
        Returns: boolean
      }
      is_business_member: {
        Args: { target_business_id: string }
        Returns: boolean
      }
      register_business: {
        Args: {
          p_address_line1: string
          p_business_type: string
          p_business_type_other: string | null
          p_city: string
          p_default_plan_key?: string
          p_description: string | null
          p_email: string
          p_name: string
          p_phone: string
          p_slug: string
          p_state: string
          p_trial_days?: number
          p_zip: string
        }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
