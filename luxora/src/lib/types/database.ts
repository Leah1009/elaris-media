export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
          deposit_amount_cents: number
          deposit_due_at: string | null
          deposit_paid_cents: number
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
          deposit_amount_cents?: number
          deposit_due_at?: string | null
          deposit_paid_cents?: number
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
          deposit_amount_cents?: number
          deposit_due_at?: string | null
          deposit_paid_cents?: number
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
      automation_rules: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          delay_hours: number
          id: string
          name: string
          template_id: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          delay_hours?: number
          id?: string
          name: string
          template_id: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          delay_hours?: number
          id?: string
          name?: string
          template_id?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "automation_rules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_rules_template_business_fkey"
            columns: ["template_id", "business_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id", "business_id"]
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
          booking_window_days: number
          brand_color: string | null
          buffer_minutes: number
          business_type: string
          business_type_other: string | null
          city: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          min_notice_hours: number
          name: string
          online_booking_enabled: boolean
          owner_profile_id: string
          phone: string | null
          preferred_language: string
          show_reviews: boolean
          show_team: boolean
          slug: string
          state: string | null
          status: string
          tax_rate_percent: number
          timezone: string
          updated_at: string
          website_tagline: string | null
          zip: string | null
        }
        Insert: {
          address_line1?: string | null
          booking_window_days?: number
          brand_color?: string | null
          buffer_minutes?: number
          business_type: string
          business_type_other?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          min_notice_hours?: number
          name: string
          online_booking_enabled?: boolean
          owner_profile_id: string
          phone?: string | null
          preferred_language?: string
          show_reviews?: boolean
          show_team?: boolean
          slug: string
          state?: string | null
          status?: string
          tax_rate_percent?: number
          timezone?: string
          updated_at?: string
          website_tagline?: string | null
          zip?: string | null
        }
        Update: {
          address_line1?: string | null
          booking_window_days?: number
          brand_color?: string | null
          buffer_minutes?: number
          business_type?: string
          business_type_other?: string | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          min_notice_hours?: number
          name?: string
          online_booking_enabled?: boolean
          owner_profile_id?: string
          phone?: string | null
          preferred_language?: string
          show_reviews?: boolean
          show_team?: boolean
          slug?: string
          state?: string | null
          status?: string
          tax_rate_percent?: number
          timezone?: string
          updated_at?: string
          website_tagline?: string | null
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
      client_loyalty_points: {
        Row: {
          business_id: string
          client_id: string
          points_balance: number
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id: string
          points_balance?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string
          points_balance?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "client_loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_loyalty_points_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_memberships: {
        Row: {
          business_id: string
          client_id: string
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          membership_plan_id: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id: string
          created_at?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          membership_plan_id: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          membership_plan_id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "client_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_memberships_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_memberships_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      client_packages: {
        Row: {
          business_id: string
          client_id: string
          expires_at: string | null
          id: string
          package_plan_id: string
          payment_id: string | null
          purchased_at: string
          sessions_remaining: number
          status: string
        }
        Insert: {
          business_id: string
          client_id: string
          expires_at?: string | null
          id?: string
          package_plan_id: string
          payment_id?: string | null
          purchased_at?: string
          sessions_remaining: number
          status?: string
        }
        Update: {
          business_id?: string
          client_id?: string
          expires_at?: string | null
          id?: string
          package_plan_id?: string
          payment_id?: string | null
          purchased_at?: string
          sessions_remaining?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_packages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "client_packages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_packages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_packages_package_plan_id_fkey"
            columns: ["package_plan_id"]
            isOneToOne: false
            referencedRelation: "package_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_packages_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
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
          allergy_notes: string | null
          birthday: string | null
          business_id: string
          city: string | null
          created_at: string
          email: string | null
          email_consent: boolean
          email_consent_at: string | null
          first_visit_at: string | null
          full_name: string
          has_allergies: boolean | null
          id: string
          last_visit_at: string | null
          lifetime_spend_cents: number
          notes: string | null
          phone: string | null
          preferred_staff_id: string | null
          sms_consent: boolean
          sms_consent_at: string | null
          state: string | null
          total_visits: number
          updated_at: string
          zip: string | null
        }
        Insert: {
          address_line1?: string | null
          allergy_notes?: string | null
          birthday?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          email?: string | null
          email_consent?: boolean
          email_consent_at?: string | null
          first_visit_at?: string | null
          full_name: string
          has_allergies?: boolean | null
          id?: string
          last_visit_at?: string | null
          lifetime_spend_cents?: number
          notes?: string | null
          phone?: string | null
          preferred_staff_id?: string | null
          sms_consent?: boolean
          sms_consent_at?: string | null
          state?: string | null
          total_visits?: number
          updated_at?: string
          zip?: string | null
        }
        Update: {
          address_line1?: string | null
          allergy_notes?: string | null
          birthday?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          email?: string | null
          email_consent?: boolean
          email_consent_at?: string | null
          first_visit_at?: string | null
          full_name?: string
          has_allergies?: boolean | null
          id?: string
          last_visit_at?: string | null
          lifetime_spend_cents?: number
          notes?: string | null
          phone?: string | null
          preferred_staff_id?: string | null
          sms_consent?: boolean
          sms_consent_at?: string | null
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
          client_field_key: string | null
          depends_on_field_id: string | null
          depends_on_value: string | null
          field_type: string
          form_id: string
          id: string
          label: string
          options: Json | null
          required: boolean
          sort_order: number
        }
        Insert: {
          client_field_key?: string | null
          depends_on_field_id?: string | null
          depends_on_value?: string | null
          field_type: string
          form_id: string
          id?: string
          label: string
          options?: Json | null
          required?: boolean
          sort_order?: number
        }
        Update: {
          client_field_key?: string | null
          depends_on_field_id?: string | null
          depends_on_value?: string | null
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
            foreignKeyName: "form_fields_depends_on_field_id_fkey"
            columns: ["depends_on_field_id"]
            isOneToOne: false
            referencedRelation: "form_fields"
            referencedColumns: ["id"]
          },
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
      gift_card_transactions: {
        Row: {
          amount_cents: number
          business_id: string
          created_at: string
          gift_card_id: string
          id: string
          payment_id: string | null
          type: string
        }
        Insert: {
          amount_cents: number
          business_id: string
          created_at?: string
          gift_card_id: string
          id?: string
          payment_id?: string | null
          type: string
        }
        Update: {
          amount_cents?: number
          business_id?: string
          created_at?: string
          gift_card_id?: string
          id?: string
          payment_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "gift_card_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_card_transactions_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_card_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          business_id: string
          code: string
          created_at: string
          expires_at: string | null
          id: string
          original_value_cents: number
          purchaser_client_id: string | null
          recipient_email: string | null
          recipient_name: string | null
          remaining_balance_cents: number
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          original_value_cents: number
          purchaser_client_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          remaining_balance_cents: number
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          original_value_cents?: number
          purchaser_client_id?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          remaining_balance_cents?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "gift_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_cards_purchaser_client_id_fkey"
            columns: ["purchaser_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          business_id: string
          change_type: string
          created_at: string
          id: string
          notes: string | null
          payment_id: string | null
          product_id: string
          quantity_delta: number
        }
        Insert: {
          business_id: string
          change_type: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          product_id: string
          quantity_delta: number
        }
        Update: {
          business_id?: string
          change_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          product_id?: string
          quantity_delta?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "inventory_movements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      loyalty_programs: {
        Row: {
          business_id: string
          cents_spent_per_point: number
          enabled: boolean
          min_redeem_points: number
          point_value_cents: number
          updated_at: string
        }
        Insert: {
          business_id: string
          cents_spent_per_point?: number
          enabled?: boolean
          min_redeem_points?: number
          point_value_cents?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          cents_spent_per_point?: number
          enabled?: boolean
          min_redeem_points?: number
          point_value_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "loyalty_programs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          business_id: string
          client_id: string
          created_at: string
          id: string
          payment_id: string | null
          points_delta: number
          type: string
        }
        Insert: {
          business_id: string
          client_id: string
          created_at?: string
          id?: string
          payment_id?: string | null
          points_delta: number
          type: string
        }
        Update: {
          business_id?: string
          client_id?: string
          created_at?: string
          id?: string
          payment_id?: string | null
          points_delta?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "loyalty_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plan_services: {
        Row: {
          membership_plan_id: string
          quantity_per_period: number
          service_id: string
        }
        Insert: {
          membership_plan_id: string
          quantity_per_period?: number
          service_id: string
        }
        Update: {
          membership_plan_id?: string
          quantity_per_period?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_plan_services_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plan_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          active: boolean
          billing_interval: string
          business_id: string
          created_at: string
          id: string
          name: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          billing_interval?: string
          business_id: string
          created_at?: string
          id?: string
          name: string
          price_cents: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          billing_interval?: string
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "membership_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_usages: {
        Row: {
          appointment_id: string | null
          client_membership_id: string
          id: string
          service_id: string
          used_at: string
        }
        Insert: {
          appointment_id?: string | null
          client_membership_id: string
          id?: string
          service_id: string
          used_at?: string
        }
        Update: {
          appointment_id?: string | null
          client_membership_id?: string
          id?: string
          service_id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_usages_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_usages_client_membership_id_fkey"
            columns: ["client_membership_id"]
            isOneToOne: false
            referencedRelation: "client_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_usages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      message_log: {
        Row: {
          appointment_id: string | null
          automation_rule_id: string | null
          body: string
          business_id: string
          channel: string
          client_id: string | null
          created_at: string
          error: string | null
          id: string
          provider_message_id: string | null
          status: string
          subject: string | null
          template_id: string | null
          to_address: string | null
        }
        Insert: {
          appointment_id?: string | null
          automation_rule_id?: string | null
          body: string
          business_id: string
          channel: string
          client_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          provider_message_id?: string | null
          status: string
          subject?: string | null
          template_id?: string | null
          to_address?: string | null
        }
        Update: {
          appointment_id?: string | null
          automation_rule_id?: string | null
          body?: string
          business_id?: string
          channel?: string
          client_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          provider_message_id?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          to_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_log_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_log_automation_rule_fkey"
            columns: ["automation_rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "message_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_log_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          active: boolean
          body: string
          business_id: string
          channel: string
          created_at: string
          id: string
          name: string
          subject: string | null
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          business_id: string
          channel: string
          created_at?: string
          id?: string
          name: string
          subject?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          business_id?: string
          channel?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "message_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      package_plans: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          id: string
          name: string
          price_cents: number
          service_id: string | null
          total_sessions: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          id?: string
          name: string
          price_cents: number
          service_id?: string | null
          total_sessions: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          price_cents?: number
          service_id?: string | null
          total_sessions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "package_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_plans_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      package_usages: {
        Row: {
          appointment_id: string | null
          client_package_id: string
          id: string
          used_at: string
        }
        Insert: {
          appointment_id?: string | null
          client_package_id: string
          id?: string
          used_at?: string
        }
        Update: {
          appointment_id?: string | null
          client_package_id?: string
          id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_usages_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_usages_client_package_id_fkey"
            columns: ["client_package_id"]
            isOneToOne: false
            referencedRelation: "client_packages"
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
          gift_card_applied_cents: number
          id: string
          loyalty_applied_cents: number
          loyalty_points_earned: number
          method: string
          notes: string | null
          package_credit_applied: boolean
          products_cents: number
          promotion_id: string | null
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
          gift_card_applied_cents?: number
          id?: string
          loyalty_applied_cents?: number
          loyalty_points_earned?: number
          method: string
          notes?: string | null
          package_credit_applied?: boolean
          products_cents?: number
          promotion_id?: string | null
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
          gift_card_applied_cents?: number
          id?: string
          loyalty_applied_cents?: number
          loyalty_points_earned?: number
          method?: string
          notes?: string | null
          package_credit_applied?: boolean
          products_cents?: number
          promotion_id?: string | null
          services_cents?: number
          status?: string
          stripe_payment_intent_id?: string | null
          tax_cents?: number
          tip_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
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
      products: {
        Row: {
          active: boolean
          barcode: string | null
          business_id: string
          category: string | null
          cost_cents: number
          created_at: string
          id: string
          name: string
          product_type: string
          quantity_on_hand: number
          reorder_threshold: number
          retail_price_cents: number
          sku: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          barcode?: string | null
          business_id: string
          category?: string | null
          cost_cents?: number
          created_at?: string
          id?: string
          name: string
          product_type?: string
          quantity_on_hand?: number
          reorder_threshold?: number
          retail_price_cents?: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          barcode?: string | null
          business_id?: string
          category?: string | null
          cost_cents?: number
          created_at?: string
          id?: string
          name?: string
          product_type?: string
          quantity_on_hand?: number
          reorder_threshold?: number
          retail_price_cents?: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
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
      promotion_redemptions: {
        Row: {
          business_id: string
          client_id: string | null
          created_at: string
          discount_cents: number
          id: string
          payment_id: string | null
          promotion_id: string
        }
        Insert: {
          business_id: string
          client_id?: string | null
          created_at?: string
          discount_cents: number
          id?: string
          payment_id?: string | null
          promotion_id: string
        }
        Update: {
          business_id?: string
          client_id?: string | null
          created_at?: string
          discount_cents?: number
          id?: string
          payment_id?: string | null
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "promotion_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_redemptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_redemptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_redemptions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          active: boolean
          business_id: string
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          per_client_limit: number | null
          updated_at: string
          uses_count: number
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          active?: boolean
          business_id: string
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          max_uses?: number | null
          per_client_limit?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          active?: boolean
          business_id?: string
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          per_client_limit?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "promotions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "refunds_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "refunds_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          appointment_id: string
          business_id: string
          client_id: string
          completed_at: string | null
          id: string
          requested_at: string
          status: string
          token: string
        }
        Insert: {
          appointment_id: string
          business_id: string
          client_id: string
          completed_at?: string | null
          id?: string
          requested_at?: string
          status?: string
          token?: string
        }
        Update: {
          appointment_id?: string
          business_id?: string
          client_id?: string
          completed_at?: string | null
          id?: string
          requested_at?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_appointment_business_fkey"
            columns: ["appointment_id", "business_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id", "business_id"]
          },
          {
            foreignKeyName: "review_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "review_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_client_business_fkey"
            columns: ["client_id", "business_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "business_id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string
          business_id: string
          client_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          responded_at: string | null
          response: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          business_id: string
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          responded_at?: string | null
          response?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          business_id?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          responded_at?: string | null
          response?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_business_fkey"
            columns: ["appointment_id", "business_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id", "business_id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_client_business_fkey"
            columns: ["client_id", "business_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "business_id"]
          },
        ]
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
          color: string | null
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
          color?: string | null
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
          color?: string | null
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
        Relationships: [
          {
            foreignKeyName: "stripe_connected_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "stripe_connected_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
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
      waitlist: {
        Row: {
          business_id: string
          client_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          preferred_date_end: string | null
          preferred_date_start: string | null
          preferred_staff_id: string | null
          service_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_date_end?: string | null
          preferred_date_start?: string | null
          preferred_staff_id?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_date_end?: string | null
          preferred_date_start?: string | null
          preferred_staff_id?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_access_status"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "waitlist_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_preferred_staff_id_fkey"
            columns: ["preferred_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
      admin_extend_trial: {
        Args: { p_business_id: string; p_new_trial_end: string }
        Returns: undefined
      }
      admin_get_business: {
        Args: { p_business_id: string }
        Returns: {
          business_type: string
          created_at: string
          email: string
          id: string
          is_locked: boolean
          name: string
          phone: string
          plan_id: string
          plan_name: string
          slug: string
          status: string
          subscription_id: string
          subscription_status: string
          trial_ends_at: string
        }[]
      }
      admin_list_audit_logs: {
        Args: { p_business_id: string; p_limit?: number }
        Returns: {
          action: string
          actor_name: string
          created_at: string
          id: string
          metadata: Json
          target_id: string
          target_table: string
        }[]
      }
      admin_list_business_members: {
        Args: { p_business_id: string }
        Returns: {
          full_name: string
          profile_id: string
          role: string
          status: string
        }[]
      }
      admin_list_businesses: {
        Args: never
        Returns: {
          business_type: string
          created_at: string
          email: string
          id: string
          is_locked: boolean
          member_count: number
          name: string
          phone: string
          plan_name: string
          slug: string
          status: string
          subscription_status: string
          trial_ends_at: string
        }[]
      }
      admin_list_plans: {
        Args: never
        Returns: {
          badge: string
          display_order: number
          entitlements: Json
          id: string
          is_active: boolean
          key: string
          name: string
          price_monthly_cents: number
        }[]
      }
      admin_platform_stats: {
        Args: never
        Returns: {
          active_count: number
          locked_count: number
          mrr_cents: number
          total_businesses: number
          trialing_count: number
        }[]
      }
      admin_set_business_status: {
        Args: { p_business_id: string; p_status: string }
        Returns: undefined
      }
      admin_update_plan: {
        Args: {
          p_badge: string
          p_is_active: boolean
          p_name: string
          p_plan_id: string
          p_price_monthly_cents: number
        }
        Returns: undefined
      }
      admin_update_subscription: {
        Args: { p_business_id: string; p_plan_id: string; p_status: string }
        Returns: undefined
      }
      admin_upsert_entitlement: {
        Args: {
          p_key: string
          p_plan_id: string
          p_value_boolean?: boolean | null
          p_value_integer?: number | null
          p_value_text?: string | null
          p_value_type: string
        }
        Returns: undefined
      }
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
      enforce_deposit_deadlines: {
        Args: { p_business_id: string }
        Returns: number
      }
      find_client_for_booking: {
        Args: { p_business_id: string; p_email: string | null; p_phone: string | null }
        Returns: {
          display_name: string
          id: string
          total_visits: number
        }[]
      }
      get_public_review_summary: {
        Args: { p_business_id: string }
        Returns: {
          average_rating: number
          review_count: number
        }[]
      }
      get_public_reviews: {
        Args: { p_business_id: string }
        Returns: {
          client_display_name: string
          comment: string
          created_at: string
          id: string
          rating: number
          response: string
        }[]
      }
      get_review_request: {
        Args: { p_token: string }
        Returns: {
          business_name: string
          status: string
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
      is_platform_admin: { Args: never; Returns: boolean }
      normalize_email: { Args: { p_email: string }; Returns: string }
      normalize_phone: { Args: { p_phone: string }; Returns: string }
      redeem_promotion: {
        Args: { p_business_id: string; p_client_id?: string | null; p_code: string }
        Returns: {
          discount_type: string
          discount_value: number
          id: string
        }[]
      }
      register_business: {
        Args: {
          p_address_line1: string
          p_business_type: string
          p_business_type_other: string | null
          p_city: string
          p_default_plan_key?: string | null
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
      run_due_automations: { Args: { p_business_id: string }; Returns: number }
      submit_review: {
        Args: { p_comment?: string | null; p_rating: number; p_token: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
