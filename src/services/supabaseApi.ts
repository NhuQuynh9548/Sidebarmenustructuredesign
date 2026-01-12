import { supabase } from '../lib/supabase';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const transformBUFromDB = (bu: any) => {
  if (!bu) return null;
  return {
    id: bu.id,
    buCode: bu.bu_code,
    buName: bu.bu_name,
    description: bu.description,
    status: bu.status,
    director: bu.director,
    createdAt: bu.created_at,
    updatedAt: bu.updated_at,
  };
};

const transformBUToDB = (bu: any) => {
  const dbData: any = {};
  if (bu.buCode !== undefined) dbData.bu_code = bu.buCode;
  if (bu.buName !== undefined) dbData.bu_name = bu.buName;
  if (bu.description !== undefined) dbData.description = bu.description;
  if (bu.status !== undefined) dbData.status = bu.status;
  if (bu.director !== undefined) dbData.director = bu.director;
  return dbData;
};

const transformEmployeeFromDB = (emp: any) => {
  if (!emp) return null;
  return {
    id: emp.id,
    employeeId: emp.employee_id,
    employeeName: emp.employee_name,
    businessUnit: emp.business_unit,
    position: emp.position,
    department: emp.department,
    email: emp.email,
    phone: emp.phone,
    hireDate: emp.hire_date,
    salary: emp.salary,
    status: emp.status,
    createdAt: emp.created_at,
    updatedAt: emp.updated_at,
  };
};

const transformEmployeeToDB = (emp: any) => {
  const dbData: any = {};
  if (emp.employeeId !== undefined) dbData.employee_id = emp.employeeId;
  if (emp.employeeName !== undefined) dbData.employee_name = emp.employeeName;
  if (emp.businessUnit !== undefined) dbData.business_unit = emp.businessUnit;
  if (emp.position !== undefined) dbData.position = emp.position;
  if (emp.department !== undefined) dbData.department = emp.department;
  if (emp.email !== undefined) dbData.email = emp.email;
  if (emp.phone !== undefined) dbData.phone = emp.phone;
  if (emp.hireDate !== undefined) dbData.hire_date = emp.hireDate;
  if (emp.salary !== undefined) dbData.salary = emp.salary;
  if (emp.status !== undefined) dbData.status = emp.status;
  return dbData;
};

const transformPartnerFromDB = (partner: any) => {
  if (!partner) return null;
  return {
    id: partner.id,
    partnerCode: partner.partner_code,
    partnerName: partner.partner_name,
    partnerType: partner.partner_type,
    businessUnit: partner.business_unit,
    contactPerson: partner.contact_person,
    email: partner.email,
    phone: partner.phone,
    address: partner.address,
    taxCode: partner.tax_code,
    status: partner.status,
    createdAt: partner.created_at,
    updatedAt: partner.updated_at,
  };
};

const transformPartnerToDB = (partner: any) => {
  const dbData: any = {};
  if (partner.partnerCode !== undefined) dbData.partner_code = partner.partnerCode;
  if (partner.partnerName !== undefined) dbData.partner_name = partner.partnerName;
  if (partner.partnerType !== undefined) dbData.partner_type = partner.partnerType;
  if (partner.businessUnit !== undefined) dbData.business_unit = partner.businessUnit;
  if (partner.contactPerson !== undefined) dbData.contact_person = partner.contactPerson;
  if (partner.email !== undefined) dbData.email = partner.email;
  if (partner.phone !== undefined) dbData.phone = partner.phone;
  if (partner.address !== undefined) dbData.address = partner.address;
  if (partner.taxCode !== undefined) dbData.tax_code = partner.taxCode;
  if (partner.status !== undefined) dbData.status = partner.status;
  return dbData;
};

const transformTransactionFromDB = (txn: any) => {
  if (!txn) return null;
  return {
    id: txn.id,
    transactionCode: txn.transaction_code,
    transactionDate: txn.transaction_date,
    type: txn.type,
    businessUnit: txn.business_unit,
    category: txn.category,
    amount: txn.amount,
    description: txn.description,
    partnerName: txn.partner_name,
    paymentMethod: txn.payment_method,
    status: txn.status,
    createdBy: txn.created_by,
    createdAt: txn.created_at,
    updatedAt: txn.updated_at,
  };
};

const transformTransactionToDB = (txn: any) => {
  const dbData: any = {};
  if (txn.transactionCode !== undefined) dbData.transaction_code = txn.transactionCode;
  if (txn.transactionDate !== undefined) dbData.transaction_date = txn.transactionDate;
  if (txn.type !== undefined) dbData.type = txn.type;
  if (txn.businessUnit !== undefined) dbData.business_unit = txn.businessUnit;
  if (txn.category !== undefined) dbData.category = txn.category;
  if (txn.amount !== undefined) dbData.amount = txn.amount;
  if (txn.description !== undefined) dbData.description = txn.description;
  if (txn.partnerName !== undefined) dbData.partner_name = txn.partnerName;
  if (txn.paymentMethod !== undefined) dbData.payment_method = txn.paymentMethod;
  if (txn.status !== undefined) dbData.status = txn.status;
  if (txn.createdBy !== undefined) dbData.created_by = txn.createdBy;
  return dbData;
};

export const businessUnitsAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformed = data?.map(transformBUFromDB) || [];
      return { success: true, data: transformed };
    } catch (error: any) {
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
      return { success: true, data: transformBUFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformBUToDB(payload);
      const { data, error } = await supabase
        .from('business_units')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformBUFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformBUToDB(payload);
      const { data, error } = await supabase
        .from('business_units')
        .update({ ...dbPayload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformBUFromDB(data) };
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

export const employeesAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformed = data?.map(transformEmployeeFromDB) || [];
      return { success: true, data: transformed };
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
      return { success: true, data: transformEmployeeFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformEmployeeToDB(payload);
      const { data, error } = await supabase
        .from('employees')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformEmployeeFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformEmployeeToDB(payload);
      const { data, error } = await supabase
        .from('employees')
        .update({ ...dbPayload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformEmployeeFromDB(data) };
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

export const partnersAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformed = data?.map(transformPartnerFromDB) || [];
      return { success: true, data: transformed };
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
      return { success: true, data: transformPartnerFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformPartnerToDB(payload);
      const { data, error } = await supabase
        .from('partners')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformPartnerFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformPartnerToDB(payload);
      const { data, error } = await supabase
        .from('partners')
        .update({ ...dbPayload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformPartnerFromDB(data) };
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

export const transactionsAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformed = data?.map(transformTransactionFromDB) || [];
      return { success: true, data: transformed };
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
      return { success: true, data: transformTransactionFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformTransactionToDB(payload);
      const { data, error } = await supabase
        .from('transactions')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformTransactionFromDB(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, payload: any): Promise<ApiResponse> => {
    try {
      const dbPayload = transformTransactionToDB(payload);
      const { data, error } = await supabase
        .from('transactions')
        .update({ ...dbPayload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: transformTransactionFromDB(data) };
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

export const usersAPI = {
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
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

  create: async (payload: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, payload: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...payload, updated_at: new Date().toISOString() })
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

export const masterDataAPI = {
  getByType: async (type: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .select('*')
        .eq('type', type)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  create: async (type: string, payload: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .insert([{ ...payload, type }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (type: string, id: string, payload: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('master_data')
        .update({ ...payload, updated_at: new Date().toISOString() })
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

export const dashboardAPI = {
  getData: async (filters?: any): Promise<ApiResponse> => {
    try {
      const [businessUnits, transactions, employees, partners] = await Promise.all([
        supabase.from('business_units').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('partners').select('*'),
      ]);

      if (businessUnits.error || transactions.error || employees.error || partners.error) {
        throw new Error('Failed to fetch dashboard data');
      }

      return {
        success: true,
        data: {
          businessUnits: businessUnits.data,
          transactions: transactions.data,
          employees: employees.data,
          partners: partners.data,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
