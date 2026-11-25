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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      balance: {
        Row: {
          account_id: string | null
          annual_budget: number | null
          total_balance: number | null
        }
        Insert: {
          account_id?: string | null
          annual_budget?: number | null
          total_balance?: number | null
        }
        Update: {
          account_id?: string | null
          annual_budget?: number | null
          total_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "balance_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "userprofile"
            referencedColumns: ["u_id"]
          },
        ]
      }
      categories: {
        Row: {
          c_id: number
          category: string | null
        }
        Insert: {
          c_id?: number
          category?: string | null
        }
        Update: {
          c_id?: number
          category?: string | null
        }
        Relationships: []
      }
      evententry: {
        Row: {
          e_id: number
          event_date_end: string | null
          event_date_start: string | null
          event_description: string | null
          event_title: string | null
        }
        Insert: {
          e_id?: number
          event_date_end?: string | null
          event_date_start?: string | null
          event_description?: string | null
          event_title?: string | null
        }
        Update: {
          e_id?: number
          event_date_end?: string | null
          event_date_start?: string | null
          event_description?: string | null
          event_title?: string | null
        }
        Relationships: []
      }
      friends_list: {
        Row: {
          f_id: string
          u_id: string | null
        }
        Insert: {
          f_id: string
          u_id?: string | null
        }
        Update: {
          f_id?: string
          u_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_list_f_id_fkey"
            columns: ["f_id"]
            isOneToOne: true
            referencedRelation: "userprofile"
            referencedColumns: ["u_id"]
          },
          {
            foreignKeyName: "friends_list_u_id_fkey"
            columns: ["u_id"]
            isOneToOne: false
            referencedRelation: "userprofile"
            referencedColumns: ["u_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          c_id: number | null
          currency: string | null
          e_id: number | null
          f_id: string | null
          short_description: string | null
          t_date: string | null
          t_id: number
          t_time: string | null
          t_type: string | null
          title: string | null
          u_id: string | null
        }
        Insert: {
          amount?: number | null
          c_id?: number | null
          currency?: string | null
          e_id?: number | null
          f_id?: string | null
          short_description?: string | null
          t_date?: string | null
          t_id?: number
          t_time?: string | null
          t_type?: string | null
          title?: string | null
          u_id?: string | null
        }
        Update: {
          amount?: number | null
          c_id?: number | null
          currency?: string | null
          e_id?: number | null
          f_id?: string | null
          short_description?: string | null
          t_date?: string | null
          t_id?: number
          t_time?: string | null
          t_type?: string | null
          title?: string | null
          u_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catergory_fk"
            columns: ["c_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["c_id"]
          },
          {
            foreignKeyName: "transactions_e_id_fkey"
            columns: ["e_id"]
            isOneToOne: false
            referencedRelation: "evententry"
            referencedColumns: ["e_id"]
          },
          {
            foreignKeyName: "transactions_f_id_fkey"
            columns: ["f_id"]
            isOneToOne: false
            referencedRelation: "friends_list"
            referencedColumns: ["f_id"]
          },
          {
            foreignKeyName: "transactions_u_id_fkey"
            columns: ["u_id"]
            isOneToOne: false
            referencedRelation: "userprofile"
            referencedColumns: ["u_id"]
          },
        ]
      }
      userprofile: {
        Row: {
          first_name: string | null
          last_name: string | null
          u_id: string
        }
        Insert: {
          first_name?: string | null
          last_name?: string | null
          u_id: string
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          u_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      showlender: { Args: { transactionid: number }; Returns: string }
      showmonthlytotal: {
        Args: { enddate: string; startdate: string }
        Returns: number
      }
      showreceiver: { Args: { transactionid: number }; Returns: string }
      showtotaldebt: { Args: never; Returns: number }
      sumeventexpenses: { Args: { eventid: number }; Returns: number }
      updatebalance: {
        Args: { updateamount: number; userid: string }
        Returns: undefined
      }
      updatetransaction: {
        Args: { t_id: number; updateamount: number }
        Returns: undefined
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
