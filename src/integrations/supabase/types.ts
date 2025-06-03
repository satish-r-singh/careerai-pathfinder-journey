export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      building_in_public_plans: {
        Row: {
          created_at: string
          id: string
          plan_data: Json
          project_id: string
          project_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_data: Json
          project_id: string
          project_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_data?: Json
          project_id?: string
          project_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_roadmaps: {
        Row: {
          created_at: string
          id: string
          roadmap_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          roadmap_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          roadmap_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exploration_state: {
        Row: {
          created_at: string
          id: string
          learning_plan_created: boolean
          public_building_started: boolean
          selected_project: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_plan_created?: boolean
          public_building_started?: boolean
          selected_project?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_plan_created?: boolean
          public_building_started?: boolean
          selected_project?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ikigai_progress: {
        Row: {
          ai_insights: Json | null
          created_at: string
          current_step: number
          id: string
          ikigai_data: Json
          is_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          created_at?: string
          current_step?: number
          id?: string
          ikigai_data?: Json
          is_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          created_at?: string
          current_step?: number
          id?: string
          ikigai_data?: Json
          is_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      industry_research: {
        Row: {
          created_at: string
          id: string
          research_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          research_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          research_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_plans: {
        Row: {
          created_at: string
          id: string
          learning_plan_data: Json
          project_id: string
          project_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_plan_data: Json
          project_id: string
          project_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_plan_data?: Json
          project_id?: string
          project_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          created_at: string
          current_step: number
          id: string
          is_completed: boolean
          onboarding_data: Json
          resume_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          onboarding_data?: Json
          resume_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          onboarding_data?: Json
          resume_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outreach_templates: {
        Row: {
          created_at: string
          id: string
          ikigai_data: Json
          job_description: string | null
          template_content: string
          template_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ikigai_data: Json
          job_description?: string | null
          template_content: string
          template_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ikigai_data?: Json
          job_description?: string | null
          template_content?: string
          template_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_interest: string | null
          background: string | null
          created_at: string
          email: string | null
          experience: string | null
          full_name: string | null
          goals: string[] | null
          id: string
          linkedin_url: string | null
          resume_url: string | null
          timeline: string | null
          updated_at: string
          user_role: string | null
        }
        Insert: {
          ai_interest?: string | null
          background?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          goals?: string[] | null
          id: string
          linkedin_url?: string | null
          resume_url?: string | null
          timeline?: string | null
          updated_at?: string
          user_role?: string | null
        }
        Update: {
          ai_interest?: string | null
          background?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          goals?: string[] | null
          id?: string
          linkedin_url?: string | null
          resume_url?: string | null
          timeline?: string | null
          updated_at?: string
          user_role?: string | null
        }
        Relationships: []
      }
      project_options: {
        Row: {
          created_at: string
          id: string
          is_selected: boolean
          project_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_selected?: boolean
          project_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_selected?: boolean
          project_data?: Json
          updated_at?: string
          user_id?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
