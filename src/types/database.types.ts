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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_access_requests: {
        Row: {
          age: number | null
          created_at: string
          current_company: string | null
          email: string
          full_name: string
          id: string
          internal_reference: string | null
          metadata: Json
          operating_city: string | null
          phone: string | null
          profile_photo_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_tiktok: string | null
          specialties: string[] | null
          status: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          current_company?: string | null
          email: string
          full_name: string
          id?: string
          internal_reference?: string | null
          metadata?: Json
          operating_city?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          current_company?: string | null
          email?: string
          full_name?: string
          id?: string
          internal_reference?: string | null
          metadata?: Json
          operating_city?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_access_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          agent_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          invited_at: string | null
          is_active: boolean
          last_seen_at: string | null
          role: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          invited_at?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          invited_at?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          license_number: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_profile_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_access_requests: {
        Row: {
          accepted_nda: boolean
          accepted_privacy: boolean
          created_at: string
          delivered_at: string | null
          document_id: string
          document_label: string
          document_type: string
          id: string
          ip: string | null
          lead_id: string
          nda_version: string | null
          privacy_notice_version: string | null
          property_id: string
          signed_url_expires_at: string | null
          status: string
          updated_at: string
          user_agent: string | null
          verification_code_hash: string | null
          verification_expires_at: string | null
          verified_at: string | null
          whatsapp_normalized: string
        }
        Insert: {
          accepted_nda?: boolean
          accepted_privacy?: boolean
          created_at?: string
          delivered_at?: string | null
          document_id: string
          document_label: string
          document_type: string
          id?: string
          ip?: string | null
          lead_id: string
          nda_version?: string | null
          privacy_notice_version?: string | null
          property_id: string
          signed_url_expires_at?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          verification_code_hash?: string | null
          verification_expires_at?: string | null
          verified_at?: string | null
          whatsapp_normalized: string
        }
        Update: {
          accepted_nda?: boolean
          accepted_privacy?: boolean
          created_at?: string
          delivered_at?: string | null
          document_id?: string
          document_label?: string
          document_type?: string
          id?: string
          ip?: string | null
          lead_id?: string
          nda_version?: string | null
          privacy_notice_version?: string | null
          property_id?: string
          signed_url_expires_at?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          verification_code_hash?: string | null
          verification_expires_at?: string | null
          verified_at?: string | null
          whatsapp_normalized?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_access_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_access_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          actor_profile_id: string | null
          body: string | null
          created_at: string
          id: string
          lead_id: string
          metadata: Json
          title: string
          type: string
        }
        Insert: {
          actor_profile_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          lead_id: string
          metadata?: Json
          title: string
          type: string
        }
        Update: {
          actor_profile_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          metadata?: Json
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tasks: {
        Row: {
          assigned_agent_id: string | null
          assigned_profile_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          lead_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: string | null
          assigned_profile_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string | null
          assigned_profile_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tasks_assigned_profile_id_fkey"
            columns: ["assigned_profile_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_agent_id: string | null
          company: string | null
          created_at: string | null
          document_access_expires_at: string | null
          document_access_session_token_hash: string | null
          downloaded_at: string
          email: string
          full_name: string
          id: string
          legal_acceptance_ip: string | null
          legal_acceptance_user_agent: string | null
          name: string | null
          nda_accepted_at: string | null
          nda_version: string | null
          notes: string | null
          phone: string | null
          privacy_accepted: boolean
          privacy_notice_version: string | null
          property_id: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          whatsapp_normalized: string | null
          whatsapp_verified_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          company?: string | null
          created_at?: string | null
          document_access_expires_at?: string | null
          document_access_session_token_hash?: string | null
          downloaded_at?: string
          email: string
          full_name: string
          id?: string
          legal_acceptance_ip?: string | null
          legal_acceptance_user_agent?: string | null
          name?: string | null
          nda_accepted_at?: string | null
          nda_version?: string | null
          notes?: string | null
          phone?: string | null
          privacy_accepted?: boolean
          privacy_notice_version?: string | null
          property_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_normalized?: string | null
          whatsapp_verified_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          company?: string | null
          created_at?: string | null
          document_access_expires_at?: string | null
          document_access_session_token_hash?: string | null
          downloaded_at?: string
          email?: string
          full_name?: string
          id?: string
          legal_acceptance_ip?: string | null
          legal_acceptance_user_agent?: string | null
          name?: string | null
          nda_accepted_at?: string | null
          nda_version?: string | null
          notes?: string | null
          phone?: string | null
          privacy_accepted?: boolean
          privacy_notice_version?: string | null
          property_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_normalized?: string | null
          whatsapp_verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          href: string | null
          id: string
          read_at: string | null
          recipient_profile_id: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          read_at?: string | null
          recipient_profile_id?: string | null
          title: string
          type?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          read_at?: string | null
          recipient_profile_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: Json | null
          brochure_path: string | null
          business_type: Database["public"]["Enums"]["business_type_enum"]
          cover_image: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_enum"]
          custom_attributes: Json | null
          description: string | null
          documents: Json | null
          faqs: Json | null
          id: string
          images: string[] | null
          is_assignment: boolean | null
          is_featured: boolean | null
          is_project: boolean | null
          m2_construction: number | null
          m2_terrain: number | null
          price: number
          property_type: Database["public"]["Enums"]["property_type_enum"]
          property_use: Database["public"]["Enums"]["property_use_enum"]
          slug: string
          status: Database["public"]["Enums"]["property_status_enum"] | null
          title: string
          tour_embeds: string[] | null
          updated_at: string
          video_urls: string[] | null
        }
        Insert: {
          address?: Json | null
          brochure_path?: string | null
          business_type: Database["public"]["Enums"]["business_type_enum"]
          cover_image?: string | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_enum"]
          custom_attributes?: Json | null
          description?: string | null
          documents?: Json | null
          faqs?: Json | null
          id?: string
          images?: string[] | null
          is_assignment?: boolean | null
          is_featured?: boolean | null
          is_project?: boolean | null
          m2_construction?: number | null
          m2_terrain?: number | null
          price: number
          property_type: Database["public"]["Enums"]["property_type_enum"]
          property_use: Database["public"]["Enums"]["property_use_enum"]
          slug: string
          status?: Database["public"]["Enums"]["property_status_enum"] | null
          title: string
          tour_embeds?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
        }
        Update: {
          address?: Json | null
          brochure_path?: string | null
          business_type?: Database["public"]["Enums"]["business_type_enum"]
          cover_image?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_enum"]
          custom_attributes?: Json | null
          description?: string | null
          documents?: Json | null
          faqs?: Json | null
          id?: string
          images?: string[] | null
          is_assignment?: boolean | null
          is_featured?: boolean | null
          is_project?: boolean | null
          m2_construction?: number | null
          m2_terrain?: number | null
          price?: number
          property_type?: Database["public"]["Enums"]["property_type_enum"]
          property_use?: Database["public"]["Enums"]["property_use_enum"]
          slug?: string
          status?: Database["public"]["Enums"]["property_status_enum"] | null
          title?: string
          tour_embeds?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
        }
        Relationships: []
      }
      property_agents: {
        Row: {
          agent_id: string
          created_at: string | null
          property_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          property_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_agents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_type_enum: "Venta" | "Renta" | "Aportación" | "Cesión"
      currency_enum: "MXN" | "USD"
      property_status_enum: "Available" | "Under_Offer" | "Sold" | "Rented"
      property_type_enum:
        | "Terreno"
        | "Casa"
        | "Departamento"
        | "Oficina"
        | "Bodega"
        | "Local"
        | "Plaza"
        | "Nave"
        | "Parque"
      property_use_enum:
        | "Residencial"
        | "Comercial"
        | "Industrial"
        | "Habitacional"
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
    Enums: {
      business_type_enum: ["Venta", "Renta", "Aportación", "Cesión"],
      currency_enum: ["MXN", "USD"],
      property_status_enum: ["Available", "Under_Offer", "Sold", "Rented"],
      property_type_enum: [
        "Terreno",
        "Casa",
        "Departamento",
        "Oficina",
        "Bodega",
        "Local",
        "Plaza",
        "Nave",
        "Parque",
      ],
      property_use_enum: [
        "Residencial",
        "Comercial",
        "Industrial",
        "Habitacional",
      ],
    },
  },
} as const

