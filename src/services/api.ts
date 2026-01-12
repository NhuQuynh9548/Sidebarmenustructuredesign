import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-393f5b29`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const fetchAPI = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data);
      return { success: false, error: data.error || 'Request failed' };
    }

    return data;
  } catch (error) {
    console.error(`Network Error (${endpoint}):`, error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// ==================== BUSINESS UNITS ====================
export const businessUnitsAPI = {
  getAll: () => fetchAPI('/business-units'),
  getById: (id: string) => fetchAPI(`/business-units/${id}`),
  create: (data: any) => fetchAPI('/business-units', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/business-units/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/business-units/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== TRANSACTIONS ====================
export const transactionsAPI = {
  getAll: () => fetchAPI('/transactions'),
  getById: (id: string) => fetchAPI(`/transactions/${id}`),
  create: (data: any) => fetchAPI('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== EMPLOYEES ====================
export const employeesAPI = {
  getAll: () => fetchAPI('/employees'),
  getById: (id: string) => fetchAPI(`/employees/${id}`),
  create: (data: any) => fetchAPI('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== PARTNERS ====================
export const partnersAPI = {
  getAll: () => fetchAPI('/partners'),
  getById: (id: string) => fetchAPI(`/partners/${id}`),
  create: (data: any) => fetchAPI('/partners', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/partners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/partners/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== USERS ====================
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  getById: (id: string) => fetchAPI(`/users/${id}`),
  create: (data: any) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== MASTER DATA ====================
export const masterDataAPI = {
  getByType: (type: string) => fetchAPI(`/master/${type}`),
  create: (type: string, data: any) => fetchAPI(`/master/${type}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (type: string, id: string, data: any) => fetchAPI(`/master/${type}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (type: string, id: string) => fetchAPI(`/master/${type}/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getData: (filters?: any) => fetchAPI('/dashboard', {
    method: 'POST',
    body: JSON.stringify(filters || {}),
  }),
};

// ==================== SEED DATA ====================
export const seedAPI = {
  seedData: () => fetchAPI('/seed', {
    method: 'POST',
  }),
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: () => fetchAPI('/health'),
};
