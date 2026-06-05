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
      leads: {
        Row: {
          assigned_agent_id: string | null
          company: string | null
          created_at: string | null
          downloaded_at: string
          email: string
          full_name: string
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          privacy_accepted: boolean
          property_id: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          company?: string | null
          created_at?: string | null
          downloaded_at?: string
          email: string
          full_name: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          privacy_accepted?: boolean
          property_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          company?: string | null
          created_at?: string | null
          downloaded_at?: string
          email?: string
          full_name?: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          privacy_accepted?: boolean
          property_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
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
      system_logs: {
        Row: {
          action_type: string
          admin_uuid: string
          id: string
          target_table: string
          timestamp: string
        }
        Insert: {
          action_type: string
          admin_uuid: string
          id?: string
          target_table: string
          timestamp?: string
        }
        Update: {
          action_type?: string
          admin_uuid?: string
          id?: string
          target_table?: string
          timestamp?: string
        }
        Relationships: []
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
