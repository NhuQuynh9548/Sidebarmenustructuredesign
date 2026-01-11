import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Filter, X, RotateCcw, Loader } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDraggableColumns, DraggableColumnHeader, ColumnConfig } from '../hooks/useDraggableColumns';
import { businessUnitsAPI } from '../../services/api';

interface BUData {
  id: string;
  buCode?: string;
  buName?: string;
  director?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  // Legacy fields for compatibility
  code?: string;
  name?: string;
  leader?: string;
  startDate?: string;
  staff?: number;
}

// Default column configuration
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'code', label: 'Mã BU', field: 'code', align: 'left', visible: true },
  { id: 'name', label: 'Tên BU', field: 'name', align: 'left', visible: true },
  { id: 'description', label: 'Mô tả', field: 'description', align: 'left', visible: true },
  { id: 'leader', label: 'Giám Đốc', field: 'leader', align: 'left', visible: true },
  { id: 'status', label: 'Trạng Thái', field: 'status', align: 'center', visible: true },
  { id: 'actions', label: 'Hành Động', align: 'center', visible: true },
];

export function QuanLyBU() {
  // Draggable columns
  const { columns, moveColumn, resetColumns } = useDraggableColumns({
    defaultColumns: DEFAULT_COLUMNS,
    storageKey: 'quan-ly-bu-columns',
    userId: 'user_001'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBU, setEditingBU] = useState<BUData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [buList, setBuList] = useState<BUData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    buCode: '',
    buName: '',
    description: '',
    director: '',
    status: 'active'
  });

  // Load BU data from API
  const loadBusinessUnits = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await businessUnitsAPI.getAll();
      if (result.success && result.data) {
        setBuList(result.data);
      } else {
        setError(result.error || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error loading business units:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessUnits();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingBU) {
        // Update existing BU
        const result = await businessUnitsAPI.update(editingBU.id, formData);
        if (result.success) {
          await loadBusinessUnits();
          setShowModal(false);
          resetForm();
        } else {
          setError(result.error || 'Không thể cập nhật BU');
        }
      } else {
        // Create new BU
        const result = await businessUnitsAPI.create(formData);
        if (result.success) {
          await loadBusinessUnits();
          setShowModal(false);
          resetForm();
        } else {
          setError(result.error || 'Không thể tạo BU');
        }
      }
    } catch (err) {
      setError('Lỗi khi lưu dữ liệu');
      console.error('Error saving BU:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const result = await businessUnitsAPI.delete(id);
      if (result.success) {
        await loadBusinessUnits();
        setShowDeleteConfirm(null);
      } else {
        setError(result.error || 'Không thể xóa BU');
      }
    } catch (err) {
      setError('Lỗi khi xóa dữ liệu');
      console.error('Error deleting BU:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      buCode: '',
      buName: '',
      description: '',
      director: '',
      status: 'active'
    });
    setEditingBU(null);
  };

  const handleEdit = (bu: BUData) => {
    setEditingBU(bu);
    setFormData({
      buCode: bu.buCode || bu.code || '',
      buName: bu.buName || bu.name || '',
      description: bu.description || '',
      director: bu.director || bu.leader || '',
      status: bu.status || 'active'
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Normalize BU data for display
  const normalizeData = (bu: BUData) => ({
    id: bu.id,
    code: bu.buCode || bu.code || '',
    name: bu.buName || bu.name || '',
    description: bu.description || '',
    leader: bu.director || bu.leader || '',
    status: bu.status || 'active',
    startDate: bu.createdAt ? new Date(bu.createdAt).toLocaleDateString('vi-VN') : '-',
    staff: bu.staff || 0
  });

  // Filter logic
  const filteredBUs = buList
    .filter(bu => bu != null) // Filter out null/undefined values
    .map(normalizeData)
    .filter(bu => {
      const matchesSearch = 
        bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bu.leader.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || bu.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  const renderCell = (bu: ReturnType<typeof normalizeData>, column: ColumnConfig) => {
    switch (column.id) {
      case 'code':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E6BB8] to-[#155a9e] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {bu.code.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900">{bu.code}</span>
          </div>
        );
      case 'name':
        return <span className="text-gray-900">{bu.name}</span>;
      case 'description':
        return <span className="text-gray-600 text-sm">{bu.description || '-'}</span>;
      case 'leader':
        return <span className="text-gray-900">{bu.leader}</span>;
      case 'status':
        return (
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            bu.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {bu.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEdit(buList.find(b => b.id === bu.id)!)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(bu.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Business Unit</h1>
              <p className="text-gray-600">Quản lý các đơn vị kinh doanh trong hệ thống</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-[#1E6BB8] hover:bg-[#155a9e] text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm BU Mới
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[300px]">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên, hoặc quản lý..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="paused">Tạm dừng</option>
              </select>
            </div>

            <button
              onClick={resetColumns}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset cột về mặc định"
            >
              <RotateCcw className="w-4 h-4" />
              Reset cột
            </button>

            <button
              onClick={loadBusinessUnits}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Tải lại
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Tìm thấy {filteredBUs.length} BU</span>
            <span className="text-blue-600">💡 Kéo thả tiêu đề cột để sắp xếp</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading && buList.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#1E6BB8]" />
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.filter(col => col.visible).map((column, index) => (
                      <DraggableColumnHeader
                        key={column.id}
                        column={column}
                        index={index}
                        moveColumn={moveColumn}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBUs.length > 0 ? (
                    filteredBUs.map((bu) => (
                      <tr key={bu.id} className="hover:bg-gray-50 transition-colors">
                        {columns.filter(col => col.visible).map((column) => (
                          <td
                            key={column.id}
                            className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'}`}
                          >
                            {renderCell(bu, column)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.filter(col => col.visible).length} className="px-6 py-12 text-center">
                        <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Không tìm thấy Business Unit nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBU ? 'Chỉnh Sửa BU' : 'Thêm BU Mới'}
                </h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mã BU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.buCode}
                      onChange={(e) => setFormData({ ...formData, buCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                      placeholder="VD: BU001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên BU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.buName}
                      onChange={(e) => setFormData({ ...formData, buName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                      placeholder="VD: BlueBolt Services"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                      placeholder="Mô tả về Business Unit..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giám Đốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                      placeholder="Tên giám đốc BU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#1E6BB8] hover:bg-[#155a9e] text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : (editingBU ? 'Cập nhật' : 'Tạo mới')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Xác Nhận Xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa Business Unit này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}