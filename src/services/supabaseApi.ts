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
    transactionType: txn.type,
    type: txn.type,
    businessUnit: txn.business_unit,
    category: txn.category,
    amount: parseFloat(txn.amount) || 0,
    description: txn.description || '',
    objectName: txn.object_name,
    objectType: txn.object_type || 'partner',
    partnerName: txn.object_name,
    paymentMethod: txn.payment_method,
    paymentStatus: txn.payment_status || 'unpaid',
    approvalStatus: txn.approval_status || 'draft',
    status: txn.payment_status || 'unpaid',
    project: txn.project_code,
    costAllocation: txn.cost_allocation || 'direct',
    allocationRule: txn.allocation_rule,
    attachments: txn.attachments_count || 0,
    rejectionReason: txn.rejection_reason,
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
  if (txn.transactionType !== undefined) dbData.type = txn.transactionType;
  if (txn.businessUnit !== undefined) dbData.business_unit = txn.businessUnit;
  if (txn.category !== undefined) dbData.category = txn.category;
  if (txn.amount !== undefined) dbData.amount = txn.amount;
  if (txn.description !== undefined) dbData.description = txn.description;
  if (txn.objectName !== undefined) dbData.object_name = txn.objectName;
  if (txn.partnerName !== undefined) dbData.object_name = txn.partnerName;
  if (txn.objectType !== undefined) dbData.object_type = txn.objectType;
  if (txn.paymentMethod !== undefined) dbData.payment_method = txn.paymentMethod;
  if (txn.paymentStatus !== undefined) dbData.payment_status = txn.paymentStatus;
  if (txn.status !== undefined) dbData.payment_status = txn.status;
  if (txn.approvalStatus !== undefined) dbData.approval_status = txn.approvalStatus;
  if (txn.project !== undefined) dbData.project_code = txn.project;
  if (txn.costAllocation !== undefined) dbData.cost_allocation = txn.costAllocation;
  if (txn.allocationRule !== undefined) dbData.allocation_rule = txn.allocationRule;
  if (txn.attachments !== undefined) dbData.attachments_count = txn.attachments;
  if (txn.rejectionReason !== undefined) dbData.rejection_reason = txn.rejectionReason;
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

      // Generate transaction code using database function
      const transactionType = dbPayload.type || payload.transactionType || 'income';
      const transactionDate = dbPayload.transaction_date || payload.transactionDate || new Date().toISOString().split('T')[0];

      const { data: codeData, error: codeError } = await supabase.rpc('generate_transaction_code', {
        p_type: transactionType,
        p_date: transactionDate
      });

      if (codeError) throw codeError;

      // Set the generated transaction code
      dbPayload.transaction_code = codeData;

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

// Generic CRUD API creator
const createCRUDAPI = (tableName: string) => ({
  getAll: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
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
        .from(tableName)
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
        .from(tableName)
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
        .from(tableName)
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
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

// MASTERDATA APIs
export const incomeExpenseCategoriesAPI = createCRUDAPI('income_expense_categories');
export const costAllocationRulesAPI = createCRUDAPI('cost_allocation_rules');
export const projectsAPI = createCRUDAPI('projects');
export const employeeLevelsAPI = createCRUDAPI('employee_levels');
export const specializationsRolesAPI = createCRUDAPI('specializations_roles');
export const paymentMethodsAPI = createCRUDAPI('payment_methods');

// SYSTEM ADMINISTRATION APIs
export const systemUsersAPI = createCRUDAPI('system_users');
export const rolesAPI = createCRUDAPI('roles');
export const permissionsAPI = createCRUDAPI('permissions');
export const rolePermissionsAPI = createCRUDAPI('role_permissions');
export const userRolesAPI = createCRUDAPI('user_roles');
export const securitySettingsAPI = createCRUDAPI('security_settings');
export const systemLogsAPI = {
  ...createCRUDAPI('system_logs'),
  log: async (logData: {
    user_id?: string;
    action: string;
    module: string;
    description?: string;
    metadata?: any;
    ip_address?: string;
    user_agent?: string;
  }): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
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

      // Calculate statistics
      const totalBUs = businessUnits.data?.length || 0;
      const totalEmployees = employees.data?.length || 0;
      const totalPartners = partners.data?.length || 0;

      // Calculate financial stats
      const allTransactions = transactions.data || [];
      const totalIncome = allTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

      const totalExpense = allTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

      const netProfit = totalIncome - totalExpense;

      return {
        success: true,
        data: {
          businessUnits: businessUnits.data,
          transactions: transactions.data,
          employees: employees.data,
          partners: partners.data,
          stats: {
            totalBUs,
            totalEmployees,
            totalPartners,
            totalTransactions: allTransactions.length,
            totalIncome,
            totalExpense,
            netProfit,
          },
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
