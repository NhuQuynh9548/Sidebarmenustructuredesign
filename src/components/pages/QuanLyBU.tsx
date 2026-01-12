import React, { useState } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Filter, X, RotateCcw } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDraggableColumns, DraggableColumnHeader, ColumnConfig } from '../hooks/useDraggableColumns';

interface BUData {
  id: string;
  code: string;
  name: string;
  leader: string;
  startDate: string;
  staff: number;
  status: 'active' | 'paused';
}

// Default column configuration
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'code', label: 'Mã BU', field: 'code', align: 'left', visible: true },
  { id: 'name', label: 'Tên BU', field: 'name', align: 'left', visible: true },
  { id: 'leader', label: 'Quản Lý', field: 'leader', align: 'left', visible: true },
  { id: 'startDate', label: 'Ngày Bắt Đầu', field: 'startDate', align: 'center', visible: true },
  { id: 'staff', label: 'Nhân Sự', field: 'staff', align: 'center', visible: true },
  { id: 'status', label: 'Trạng Thái', field: 'status', align: 'center', visible: true },
  { id: 'actions', label: 'Hành Động', align: 'center', visible: true },
];

export function QuanLyBU() {
  // Draggable columns
  const { columns, moveColumn, resetColumns } = useDraggableColumns({
    defaultColumns: DEFAULT_COLUMNS,
    storageKey: 'quan-ly-bu-columns',
    userId: 'user_001' // In real app, get from auth context
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBU, setEditingBU] = useState<BUData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [buList, setBuList] = useState<BUData[]>([
    {
      id: '1',
      code: 'BU-SER',
      name: 'BlueBolt Services',
      leader: 'Nguyễn Văn A',
      startDate: '2022-01-15',
      staff: 45,
      status: 'active'
    },
    {
      id: '2',
      code: 'BU-SOF',
      name: 'BlueBolt Software',
      leader: 'Trần Thị B',
      startDate: '2022-03-20',
      staff: 68,
      status: 'active'
    },
    {
      id: '3',
      code: 'BU-ACA',
      name: 'BlueBolt Academy',
      leader: 'Lê Minh C',
      startDate: '2022-06-10',
      staff: 32,
      status: 'active'
    },
    {
      id: '4',
      code: 'BU-WOR',
      name: 'BlueBolt Workspace',
      leader: 'Phạm Thu D',
      startDate: '2022-09-05',
      staff: 28,
      status: 'paused'
    },
    {
      id: '5',
      code: 'BU-GA',
      name: 'BlueBolt G&A',
      leader: 'Hoàng Văn E',
      startDate: '2023-01-12',
      staff: 22,
      status: 'active'
    },
    {
      id: '6',
      code: 'BU-RD',
      name: 'BlueBolt R&D',
      leader: 'Đặng Thị F',
      startDate: '2023-04-18',
      staff: 38,
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState<Omit<BUData, 'id'>>({
    code: '',
    name: '',
    leader: '',
    startDate: '',
    staff: 0,
    status: 'active'
  });

  // Filter data
  const filteredBUs = buList.filter(bu => {
    const matchSearch = bu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bu.leader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || bu.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handle Create
  const handleCreate = () => {
    setEditingBU(null);
    setFormData({
      code: '',
      name: '',
      leader: '',
      startDate: '',
      staff: 0,
      status: 'active'
    });
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (bu: BUData) => {
    setEditingBU(bu);
    setFormData({
      code: bu.code,
      name: bu.name,
      leader: bu.leader,
      startDate: bu.startDate,
      staff: bu.staff,
      status: bu.status
    });
    setShowModal(true);
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code || !formData.name || !formData.leader || !formData.startDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (editingBU) {
      // Update
      setBuList(buList.map(bu => 
        bu.id === editingBU.id 
          ? { ...formData, id: editingBU.id }
          : bu
      ));
    } else {
      // Create
      const newBU: BUData = {
        ...formData,
        id: Date.now().toString()
      };
      setBuList([...buList, newBU]);
    }

    setShowModal(false);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    setBuList(buList.filter(bu => bu.id !== id));
    setShowDeleteConfirm(null);
  };

  // Render cell based on column
  const renderCell = (column: ColumnConfig, bu: BUData) => {
    const alignClass = 
      column.align === 'center' ? 'text-center' :
      column.align === 'right' ? 'text-right' : 'text-left';

    switch (column.id) {
      case 'code':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="font-mono text-sm font-semibold text-gray-700">{bu.code}</span>
          </td>
        );
      
      case 'name':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">{bu.name}</span>
            </div>
          </td>
        );
      
      case 'leader':
        return (
          <td key={column.id} className={`py-4 px-6 text-gray-700 ${alignClass}`}>
            {bu.leader}
          </td>
        );
      
      case 'startDate':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {new Date(bu.startDate).toLocaleDateString('vi-VN')}
            </span>
          </td>
        );
      
      case 'staff':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {bu.staff}
            </span>
          </td>
        );
      
      case 'status':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                bu.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {bu.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
            </span>
          </td>
        );
      
      case 'actions':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <div className="flex items-center justify-center gap-2">
              <button
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                onClick={() => handleEdit(bu)}
                title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                onClick={() => setShowDeleteConfirm(bu.id)}
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        );
      
      default:
        return <td key={column.id} className={`py-4 px-6 ${alignClass}`}>-</td>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Business Unit</h1>
        <p className="text-gray-600">Quản lý các đơn vị kinh doanh của BLUEBOLT</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm BU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'paused')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="paused">Tạm dừng</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetColumns}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Đặt lại thứ tự cột"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleCreate}
              className="bg-[#1E6BB8] hover:bg-[#1557A0] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm BU Mới
            </button>
          </div>
        </div>
      </div>

      {/* BU Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DndProvider backend={HTML5Backend}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.filter(c => c.visible).map((column, index) => (
                    <DraggableColumnHeader 
                      key={column.id} 
                      column={column} 
                      index={index}
                      moveColumn={moveColumn}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBUs.map((bu) => (
                  <tr key={bu.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    {columns.filter(c => c.visible).map((column) => renderCell(column, bu))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DndProvider>

        {filteredBUs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy Business Unit nào</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Xác Nhận Xóa</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa Business Unit này?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal - Centered Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingBU ? 'Chỉnh Sửa Business Unit' : 'Tạo Mới Đơn Vị'}
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

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <form onSubmit={handleSubmit} id="bu-form">
                <div className="space-y-5">
                  {/* Row 1: Mã BU & Trạng Thái */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Mã BU
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="BU-168"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Trạng Thái
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'paused' })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      >
                        <option value="active">Hoạt động</option>
                        <option value="paused">Tạm dừng</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Tên Đơn Vị */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Tên Đơn Vị
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: BlueBolt Software"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  {/* Row 3: Người Phụ Trách (Leader) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Người Phụ Trách (Leader)
                    </label>
                    <input
                      type="text"
                      value={formData.leader}
                      onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                      placeholder="Nhập tên người quản lý"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  {/* Row 4: Ngày Thành Lập & Số Lượng Nhân Sự */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Ngày Thành Lập
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Số Lượng Nhân Sự
                      </label>
                      <input
                        type="number"
                        value={formData.staff}
                        onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
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
                form="bu-form"
                className="px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
              >
                {editingBU ? 'Xác nhận cập nhật' : 'Xác nhận tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
