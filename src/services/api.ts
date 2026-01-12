import { supabase } from '../utils/supabase/client';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==================== BUSINESS UNITS ====================
export const businessUnitsAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get business units error:', error);
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (buData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .insert([buData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, buData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .update(buData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('business_units')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== TRANSACTIONS ====================
export const transactionsAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (txData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([txData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, txData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(txData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== EMPLOYEES ====================
export const employeesAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (empData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([empData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, empData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(empData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== PARTNERS ====================
export const partnersAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (partnerData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([partnerData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, partnerData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== USERS ====================
export const usersAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (userData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, userData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== MASTER DATA ====================
export const masterDataAPI = {
  getByType: async (type: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (type: string, itemData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .insert([{ ...itemData, type }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (type: string, id: string, itemData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .update(itemData)
        .eq('id', id)
        .eq('type', type)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (type: string, id: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('master_data')
        .delete()
        .eq('id', id)
        .eq('type', type);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getData: async (filters?: any): Promise<ApiResponse> => {
    try {
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*');

      if (txError) throw txError;

      const { data: businessUnits, error: buError } = await supabase
        .from('business_units')
        .select('*');

      if (buError) throw buError;

      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*');

      if (empError) throw empError;

      return {
        success: true,
        data: {
          transactions: transactions || [],
          businessUnits: businessUnits || [],
          employees: employees || [],
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== SEED DATA ====================
export const seedAPI = {
  seedData: async (): Promise<ApiResponse> => {
    try {
      const sampleBUs = [
        {
          code: 'BU001',
          name: 'Business Unit 1',
          description: 'Sample BU 1',
          director: 'Director 1',
          status: 'active',
        },
        {
          code: 'BU002',
          name: 'Business Unit 2',
          description: 'Sample BU 2',
          director: 'Director 2',
          status: 'active',
        },
      ];

      const { data, error } = await supabase
        .from('business_units')
        .insert(sampleBUs)
        .select();

      if (error) throw error;
      return { success: true, data, message: 'Seed data created successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: async (): Promise<ApiResponse> => {
    try {
      const { error } = await supabase.from('business_units').select('count').limit(0);

      if (error) throw error;
      return { success: true, data: { status: 'ok' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
