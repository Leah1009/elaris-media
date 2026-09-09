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
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string
          duration_minutes: number
          id: string
          price_cents: number
          service_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          duration_minutes: number
          id?: string
          price_cents: number
          service_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          price_cents?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          business_id: string
          client_id: string
          created_at: string
          deposit_status: string
          end_at: string
          id: string
          location_id: string
          notes: string | null
          source: string
          staff_id: string
          start_at: string
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id: string
          created_at?: string
          deposit_status?: string
          end_at: string
          id?: string
          location_id: string
          notes?: string | null
          source?: string
          staff_id: string
          start_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string
          created_at?: string
          deposit_status?: string
          end_at?: string
          id?: string
          location_id?: string
          notes?: string | null
          source?: string
          staff_id?: string
          start_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "audit_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_time: string | null
          closed: boolean
          day_of_week: number
          id: string
          location_id: string
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          closed?: boolean
          day_of_week: number
          id?: string
          location_id: string
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          closed?: boolean
          day_of_week?: number
          id?: string
          location_id?: string
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          tax_rate_percent: number
          timezone: string
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
          tax_rate_percent?: number
          timezone?: string
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
          tax_rate_percent?: number
          timezone?: string
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_forms: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          service_id: string | null
          trigger: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          service_id?: string | null
          trigger?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          service_id?: string | null
          trigger?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_forms_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "client_forms_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_forms_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tag_assignments: {
        Row: {
          client_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tag_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "client_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "client_tags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line1: string | null
          birthday: string | null
          business_id: string
          city: string | null
          created_at: string
          email: string | null
          first_visit_at: string | null
          full_name: string
          id: string
          last_visit_at: string | null
          lifetime_spend_cents: number
          notes: string | null
          phone: string | null
          preferred_staff_id: string | null
          state: string | null
          total_visits: number
          updated_at: string
          zip: string | null
        }
        Insert: {
          address_line1?: string | null
          birthday?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          email?: string | null
          first_visit_at?: string | null
          full_name: string
          id?: string
          last_visit_at?: string | null
          lifetime_spend_cents?: number
          notes?: string | null
          phone?: string | null
          preferred_staff_id?: string | null
          state?: string | null
          total_visits?: number
          updated_at?: string
          zip?: string | null
        }
        Update: {
          address_line1?: string | null
          birthday?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          email?: string | null
          first_visit_at?: string | null
          full_name?: string
          id?: string
          last_visit_at?: string | null
          lifetime_spend_cents?: number
          notes?: string | null
          phone?: string | null
          preferred_staff_id?: string | null
          state?: string | null
          total_visits?: number
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_preferred_staff_id_fkey"
            columns: ["preferred_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          field_type: string
          form_id: string
          id: string
          label: string
          options: Json | null
          required: boolean
          sort_order: number
        }
        Insert: {
          field_type: string
          form_id: string
          id?: string
          label: string
          options?: Json | null
          required?: boolean
          sort_order?: number
        }
        Update: {
          field_type?: string
          form_id?: string
          id?: string
          label?: string
          options?: Json | null
          required?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "client_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          answers: Json
          appointment_id: string | null
          business_id: string
          client_id: string
          form_id: string
          id: string
          signed_at: string | null
          submitted_at: string
        }
        Insert: {
          answers?: Json
          appointment_id?: string | null
          business_id: string
          client_id: string
          form_id: string
          id?: string
          signed_at?: string | null
          submitted_at?: string
        }
        Update: {
          answers?: Json
          appointment_id?: string | null
          business_id?: string
          client_id?: string
          form_id?: string
          id?: string
          signed_at?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "form_submissions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "client_forms"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "legal_acceptances_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "legal_acceptances_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_acceptances_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          appointment_id: string | null
          business_id: string
          client_id: string | null
          created_at: string
          deposit_applied_cents: number
          discount_cents: number
          id: string
          method: string
          notes: string | null
          products_cents: number
          services_cents: number
          status: string
          stripe_payment_intent_id: string | null
          tax_cents: number
          tip_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          business_id: string
          client_id?: string | null
          created_at?: string
          deposit_applied_cents?: number
          discount_cents?: number
          id?: string
          method: string
          notes?: string | null
          products_cents?: number
          services_cents?: number
          status?: string
          stripe_payment_intent_id?: string | null
          tax_cents?: number
          tip_cents?: number
          total_cents: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          business_id?: string
          client_id?: string | null
          created_at?: string
          deposit_applied_cents?: number
          discount_cents?: number
          id?: string
          method?: string
          notes?: string | null
          products_cents?: number
          services_cents?: number
          status?: string
          stripe_payment_intent_id?: string | null
          tax_cents?: number
          tip_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_cents: number
          business_id: string
          created_at: string
          id: string
          payment_id: string
          reason: string | null
          stripe_refund_id: string | null
        }
        Insert: {
          amount_cents: number
          business_id: string
          created_at?: string
          id?: string
          payment_id: string
          reason?: string | null
          stripe_refund_id?: string | null
        }
        Update: {
          amount_cents?: number
          business_id?: string
          created_at?: string
          id?: string
          payment_id?: string
          reason?: string | null
          stripe_refund_id?: string | null
        }
        Relationships: []
      }
      stripe_connected_accounts: {
        Row: {
          business_id: string
          charges_enabled: boolean
          created_at: string
          details_submitted: boolean
          id: string
          payouts_enabled: boolean
          stripe_account_id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          payouts_enabled?: boolean
          stripe_account_id: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          payouts_enabled?: boolean
          stripe_account_id?: string
          updated_at?: string
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
        Relationships: [
          {
            foreignKeyName: "plan_entitlements_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
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
      service_locations: {
        Row: {
          location_id: string
          service_id: string
        }
        Insert: {
          location_id: string
          service_id: string
        }
        Update: {
          location_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_locations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          business_id: string
          category: string | null
          created_at: string
          deposit_cents: number | null
          deposit_required: boolean
          description: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          name: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          category?: string | null
          created_at?: string
          deposit_cents?: number | null
          deposit_required?: boolean
          description?: string | null
          duration_minutes: number
          id?: string
          image_url?: string | null
          name: string
          price_cents: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          category?: string | null
          created_at?: string
          deposit_cents?: number | null
          deposit_required?: boolean
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          name?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          profile_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_locations: {
        Row: {
          location_id: string
          staff_id: string
        }
        Insert: {
          location_id: string
          staff_id: string
        }
        Update: {
          location_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_locations_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services: {
        Row: {
          service_id: string
          staff_id: string
        }
        Insert: {
          service_id: string
          staff_id: string
        }
        Update: {
          service_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_services_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_weekly_availability: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          location_id: string
          staff_id: string
          start_time: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          location_id: string
          staff_id: string
          start_time: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          location_id?: string
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_weekly_availability_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_weekly_availability_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "trials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "trials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
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
      create_online_booking: {
        Args: {
          p_business_id: string
          p_client_id?: string | null
          p_form_submissions?: Json
          p_location_id: string
          p_new_client_email?: string | null
          p_new_client_full_name?: string | null
          p_new_client_phone?: string | null
          p_notes?: string | null
          p_service_ids: string[]
          p_staff_id: string
          p_start_at: string
        }
        Returns: string
      }
      find_client_for_booking: {
        Args: { p_business_id: string; p_email: string | null; p_phone: string | null }
        Returns: {
          display_name: string
          id: string
          total_visits: number
        }[]
      }
      is_business_admin: {
        Args: { target_business_id: string }
        Returns: boolean
      }
      is_business_bookable: {
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
