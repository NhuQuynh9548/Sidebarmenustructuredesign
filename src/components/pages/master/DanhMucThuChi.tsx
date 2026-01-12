import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, FolderTree, X, AlertCircle } from 'lucide-react';
import { incomeExpenseCategoriesAPI } from '../../../services/supabaseApi';

interface Category {
  id: string;
  code: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
  status: 'active' | 'inactive';
  parent_code?: string;
  sort_order?: number;
}

export function DanhMucThuChi() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'expense' as 'income' | 'expense',
    description: '',
    status: 'active' as 'active' | 'inactive',
    sort_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await incomeExpenseCategoriesAPI.getAll();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || category.type === filterType;
    const matchesStatus = filterStatus === 'all' || category.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      code: '',
      name: '',
      type: 'expense',
      description: '',
      status: 'active',
      sort_order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      type: category.type,
      description: category.description || '',
      status: category.status,
      sort_order: category.sort_order || 0,
    });
    setShowModal(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      try {
        const result = await incomeExpenseCategoriesAPI.delete(deletingCategory.id);
        if (result.success) {
          await loadCategories();
        } else {
          alert(`Lỗi: ${result.error || 'Không thể xóa danh mục'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Có lỗi xảy ra khi xóa danh mục');
      }
      setShowDeleteConfirm(false);
      setDeletingCategory(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const result = await incomeExpenseCategoriesAPI.update(editingCategory.id, formData);
        if (result.success) {
          await loadCategories();
          setShowModal(false);
        } else {
          alert(`Lỗi: ${result.error || 'Không thể cập nhật'}`);
        }
      } else {
        const result = await incomeExpenseCategoriesAPI.create(formData);
        if (result.success) {
          await loadCategories();
          setShowModal(false);
        } else {
          alert(`Lỗi: ${result.error || 'Không thể tạo mới'}`);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'expense': 'Chi',
      'income': 'Thu',
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'expense': 'bg-red-100 text-red-700',
      'income': 'bg-green-100 text-green-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6BB8] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Danh Mục Tài Chính (Thu / Chi)</h1>
        <p className="text-gray-600">Quản lý cây danh mục (Chart of Accounts - COA) để phân loại dòng tiền</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm mã, tên danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
              />
            </div>

            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="expense">Chi</option>
              <option value="income">Thu</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Thêm Danh Mục
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên Danh Mục</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mô Tả</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-[#1E6BB8]">{category.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(category.type)}`}>
                      {getTypeLabel(category.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{category.description}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {category.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy danh mục nào</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Tạo Mới Danh Mục'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Vui lòng điền đầy đủ thông tin bên dưới.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <form onSubmit={handleSubmit} id="category-form">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Mã Danh Mục
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="EXP_SALARY, REV_SERVICE..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Loại Giao Dịch
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      >
                        <option value="expense">Chi</option>
                        <option value="income">Thu</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Tên Danh Mục
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Chi phí vận hành"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Mô Tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Giải thích chi tiết mục đích sử dụng..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Thứ Tự Hiển Thị
                      </label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Trạng Thái
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      >
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng sử dụng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="category-form"
                className="px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
              >
                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa danh mục này?</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mã:</span> {deletingCategory.code}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Tên:</span> {deletingCategory.name}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
