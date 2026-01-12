import { useState, useEffect } from 'react';
import { employeesAPI } from '../services/supabaseApi';

interface Employee {
  id: string;
  employeeId?: string;
  fullName?: string;
  position?: string;
  department?: string;
  businessUnit?: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  status?: string;
  salary?: number;
  // Legacy fields for compatibility
  name?: string;
  role?: string;
  bu?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await employeesAPI.getAll();
      if (result.success && result.data) {
        setEmployees(result.data);
      } else {
        setError(result.error || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await employeesAPI.create(data);
      if (result.success) {
        await loadEmployees();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Không thể tạo nhân viên');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tạo nhân viên';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, data: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await employeesAPI.update(id, data);
      if (result.success) {
        await loadEmployees();
        return { success: true };
      } else {
        setError(result.error || 'Không thể cập nhật nhân viên');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi cập nhật nhân viên';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await employeesAPI.delete(id);
      if (result.success) {
        await loadEmployees();
        return { success: true };
      } else {
        setError(result.error || 'Không thể xóa nhân viên');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi xóa nhân viên';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
