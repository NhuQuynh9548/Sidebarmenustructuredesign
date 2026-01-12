import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      business_units: {
        Row: {
          id: string;
          bu_code: string;
          bu_name: string;
          description: string | null;
          status: string | null;
          director: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          bu_code: string;
          bu_name: string;
          description?: string | null;
          status?: string | null;
          director?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          bu_code?: string;
          bu_name?: string;
          description?: string | null;
          status?: string | null;
          director?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      employees: {
        Row: {
          id: string;
          employee_id: string;
          employee_name: string;
          business_unit: string;
          position: string | null;
          department: string | null;
          email: string | null;
          phone: string | null;
          hire_date: string | null;
          salary: number | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          employee_id: string;
          employee_name: string;
          business_unit: string;
          position?: string | null;
          department?: string | null;
          email?: string | null;
          phone?: string | null;
          hire_date?: string | null;
          salary?: number | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          employee_id?: string;
          employee_name?: string;
          business_unit?: string;
          position?: string | null;
          department?: string | null;
          email?: string | null;
          phone?: string | null;
          hire_date?: string | null;
          salary?: number | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      partners: {
        Row: {
          id: string;
          partner_code: string;
          partner_name: string;
          partner_type: string | null;
          business_unit: string | null;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          tax_code: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          partner_code: string;
          partner_name: string;
          partner_type?: string | null;
          business_unit?: string | null;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          tax_code?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          partner_code?: string;
          partner_name?: string;
          partner_type?: string | null;
          business_unit?: string | null;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          tax_code?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          transaction_code: string;
          transaction_date: string | null;
          type: string;
          business_unit: string;
          category: string | null;
          amount: number;
          description: string | null;
          partner_name: string | null;
          payment_method: string | null;
          status: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          transaction_code: string;
          transaction_date?: string | null;
          type: string;
          business_unit: string;
          category?: string | null;
          amount?: number;
          description?: string | null;
          partner_name?: string | null;
          payment_method?: string | null;
          status?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          transaction_code?: string;
          transaction_date?: string | null;
          type?: string;
          business_unit?: string;
          category?: string | null;
          amount?: number;
          description?: string | null;
          partner_name?: string | null;
          payment_method?: string | null;
          status?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          full_name: string;
          role: string | null;
          business_units: string[] | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          full_name: string;
          role?: string | null;
          business_units?: string[] | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          full_name?: string;
          role?: string | null;
          business_units?: string[] | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      master_data: {
        Row: {
          id: string;
          type: string;
          code: string;
          name: string;
          description: string | null;
          parent_code: string | null;
          sort_order: number | null;
          status: string | null;
          metadata: any | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          type: string;
          code: string;
          name: string;
          description?: string | null;
          parent_code?: string | null;
          sort_order?: number | null;
          status?: string | null;
          metadata?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          type?: string;
          code?: string;
          name?: string;
          description?: string | null;
          parent_code?: string | null;
          sort_order?: number | null;
          status?: string | null;
          metadata?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};
