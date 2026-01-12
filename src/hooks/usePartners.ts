import { useState, useEffect } from 'react';
import { partnersAPI } from '../services/supabaseApi';

interface Partner {
  id: string;
  partnerCode?: string;
  partnerName?: string;
  taxCode?: string;
  address?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  partnerType?: string;
  status?: string;
  // Legacy fields
  code?: string;
  name?: string;
  type?: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPartners = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await partnersAPI.getAll();
      if (result.success && result.data) {
        setPartners(result.data);
      } else {
        setError(result.error || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error loading partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPartner = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await partnersAPI.create(data);
      if (result.success) {
        await loadPartners();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Không thể tạo đối tác');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tạo đối tác';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, data: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await partnersAPI.update(id, data);
      if (result.success) {
        await loadPartners();
        return { success: true };
      } else {
        setError(result.error || 'Không thể cập nhật đối tác');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi cập nhật đối tác';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await partnersAPI.delete(id);
      if (result.success) {
        await loadPartners();
        return { success: true };
      } else {
        setError(result.error || 'Không thể xóa đối tác');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi xóa đối tác';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  return {
    partners,
    loading,
    error,
    loadPartners,
    createPartner,
    updatePartner,
    deletePartner
  };
};
