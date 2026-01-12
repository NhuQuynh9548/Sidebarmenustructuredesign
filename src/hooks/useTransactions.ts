import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/supabaseApi';

interface Transaction {
  id: string;
  transactionCode: string;
  transactionDate: string;
  transactionType: 'income' | 'expense' | 'loan';
  category: string;
  project?: string;
  objectType: 'partner' | 'employee';
  objectName: string;
  paymentMethod: string;
  businessUnit: string;
  amount: number;
  costAllocation: 'direct' | 'indirect';
  allocationRule?: string;
  attachments: number;
  paymentStatus: 'paid' | 'unpaid';
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  description: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate transaction code
  const generateTransactionCode = (type: 'income' | 'expense' | 'loan'): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    
    const typePrefix = type === 'income' ? 'T' : type === 'expense' ? 'C' : 'V';
    
    // Count existing transactions of this type in current month/year
    const count = transactions.filter(t => 
      t.transactionCode.startsWith(`${typePrefix}${month}${year}`)
    ).length + 1;
    
    return `${typePrefix}${month}${year}_${String(count).padStart(2, '0')}`;
  };

  // Load all transactions
  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await transactionsAPI.getAll();
      if (result.success && result.data) {
        setTransactions(result.data);
      } else {
        setError(result.error || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create transaction
  const createTransaction = async (data: Omit<Transaction, 'id' | 'transactionCode'>) => {
    setLoading(true);
    setError('');
    try {
      const transactionCode = generateTransactionCode(data.transactionType);
      const result = await transactionsAPI.create({
        ...data,
        transactionCode
      });
      
      if (result.success) {
        await loadTransactions();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Không thể tạo giao dịch');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tạo giao dịch';
      setError(errorMsg);
      console.error('Error creating transaction:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    setLoading(true);
    setError('');
    try {
      const result = await transactionsAPI.update(id, data);
      if (result.success) {
        await loadTransactions();
        return { success: true };
      } else {
        setError(result.error || 'Không thể cập nhật giao dịch');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi cập nhật giao dịch';
      setError(errorMsg);
      console.error('Error updating transaction:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await transactionsAPI.delete(id);
      if (result.success) {
        await loadTransactions();
        return { success: true };
      } else {
        setError(result.error || 'Không thể xóa giao dịch');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi xóa giao dịch';
      setError(errorMsg);
      console.error('Error deleting transaction:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update approval status
  const updateApprovalStatus = async (
    id: string, 
    status: Transaction['approvalStatus'],
    rejectionReason?: string
  ) => {
    return updateTransaction(id, { 
      approvalStatus: status,
      rejectionReason 
    });
  };

  // Load on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateApprovalStatus,
    generateTransactionCode
  };
};
