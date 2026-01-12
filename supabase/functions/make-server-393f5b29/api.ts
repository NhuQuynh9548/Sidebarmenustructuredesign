import * as kv from "./kv_store.ts";

// ==================== BUSINESS UNITS ====================
export const getBusinessUnits = async () => {
  const bus = await kv.getByPrefix('bu:');
  return bus.map(item => item.value);
};

export const getBusinessUnit = async (id: string) => {
  return await kv.get(`bu:${id}`);
};

export const createBusinessUnit = async (data: any) => {
  const id = `BU${Date.now()}`;
  const bu = { id, ...data, createdAt: new Date().toISOString() };
  await kv.set(`bu:${id}`, bu);
  return bu;
};

export const updateBusinessUnit = async (id: string, data: any) => {
  const existing = await kv.get(`bu:${id}`);
  if (!existing) throw new Error('BU not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`bu:${id}`, updated);
  return updated;
};

export const deleteBusinessUnit = async (id: string) => {
  await kv.del(`bu:${id}`);
};

// ==================== TRANSACTIONS ====================
export const getTransactions = async () => {
  const txns = await kv.getByPrefix('txn:');
  return txns.map(item => item.value).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getTransaction = async (id: string) => {
  return await kv.get(`txn:${id}`);
};

export const createTransaction = async (data: any) => {
  const id = data.transactionCode || `TXN${Date.now()}`;
  const txn = { id, ...data, createdAt: new Date().toISOString() };
  await kv.set(`txn:${id}`, txn);
  return txn;
};

export const updateTransaction = async (id: string, data: any) => {
  const existing = await kv.get(`txn:${id}`);
  if (!existing) throw new Error('Transaction not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`txn:${id}`, updated);
  return updated;
};

export const deleteTransaction = async (id: string) => {
  await kv.del(`txn:${id}`);
};

// ==================== EMPLOYEES ====================
export const getEmployees = async () => {
  const employees = await kv.getByPrefix('emp:');
  return employees.map(item => item.value);
};

export const getEmployee = async (id: string) => {
  return await kv.get(`emp:${id}`);
};

export const createEmployee = async (data: any) => {
  const id = data.employeeId || `EMP${Date.now()}`;
  const employee = { id, ...data, createdAt: new Date().toISOString() };
  await kv.set(`emp:${id}`, employee);
  return employee;
};

export const updateEmployee = async (id: string, data: any) => {
  const existing = await kv.get(`emp:${id}`);
  if (!existing) throw new Error('Employee not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`emp:${id}`, updated);
  return updated;
};

export const deleteEmployee = async (id: string) => {
  await kv.del(`emp:${id}`);
};

// ==================== PARTNERS ====================
export const getPartners = async () => {
  const partners = await kv.getByPrefix('partner:');
  return partners.map(item => item.value);
};

export const getPartner = async (id: string) => {
  return await kv.get(`partner:${id}`);
};

export const createPartner = async (data: any) => {
  const id = data.partnerCode || `PT${Date.now()}`;
  const partner = { id, ...data, createdAt: new Date().toISOString() };
  await kv.set(`partner:${id}`, partner);
  return partner;
};

export const updatePartner = async (id: string, data: any) => {
  const existing = await kv.get(`partner:${id}`);
  if (!existing) throw new Error('Partner not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`partner:${id}`, updated);
  return updated;
};

export const deletePartner = async (id: string) => {
  await kv.del(`partner:${id}`);
};

// ==================== USERS ====================
export const getUsers = async () => {
  const users = await kv.getByPrefix('user:');
  return users.map(item => item.value);
};

export const getUser = async (id: string) => {
  return await kv.get(`user:${id}`);
};

export const createUser = async (data: any) => {
  const id = data.username || `USER${Date.now()}`;
  const user = { id, ...data, createdAt: new Date().toISOString() };
  await kv.set(`user:${id}`, user);
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const existing = await kv.get(`user:${id}`);
  if (!existing) throw new Error('User not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`user:${id}`, updated);
  return updated;
};

export const deleteUser = async (id: string) => {
  await kv.del(`user:${id}`);
};

// ==================== MASTER DATA ====================
export const getMasterData = async (type: string) => {
  const items = await kv.getByPrefix(`master:${type}:`);
  return items.map(item => item.value);
};

export const createMasterData = async (type: string, data: any) => {
  const id = `${type.toUpperCase()}${Date.now()}`;
  const item = { id, type, ...data, createdAt: new Date().toISOString() };
  await kv.set(`master:${type}:${id}`, item);
  return item;
};

export const updateMasterData = async (type: string, id: string, data: any) => {
  const existing = await kv.get(`master:${type}:${id}`);
  if (!existing) throw new Error('Master data not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await kv.set(`master:${type}:${id}`, updated);
  return updated;
};

export const deleteMasterData = async (type: string, id: string) => {
  await kv.del(`master:${type}:${id}`);
};

// ==================== DASHBOARD ANALYTICS ====================
export const getDashboardData = async (filters?: any) => {
  const transactions = await getTransactions();
  
  // Filter by BU if specified
  let filteredTxns = transactions;
  if (filters?.bu && filters.bu !== 'all') {
    filteredTxns = transactions.filter(t => t.businessUnit === filters.bu);
  }

  // Filter by date range if specified
  if (filters?.startDate && filters?.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    filteredTxns = filteredTxns.filter(t => {
      const txnDate = new Date(t.transactionDate);
      return txnDate >= start && txnDate <= end;
    });
  }

  // Calculate metrics
  const income = filteredTxns.filter(t => t.type === 'income');
  const expense = filteredTxns.filter(t => t.type === 'expense');
  
  const totalRevenue = income.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = expense.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalExpense,
    totalProfit,
    profitMargin,
    incomeCount: income.length,
    expenseCount: expense.length,
    transactions: filteredTxns
  };
};
