import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Users, X, AlertCircle, ChevronLeft, ChevronRight, Save, Mail, Phone, Calendar, MapPin, CreditCard, RotateCcw } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDraggableColumns, DraggableColumnHeader, ColumnConfig } from '../hooks/useDraggableColumns';
import { useEmployees } from '../../hooks/useEmployees';

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  businessUnit: string;
  specialization: string;
  level: string;
  joinDate: string;
  workStatus: 'working' | 'probation' | 'resigned';
  birthDate: string;
  idCard: string;
  address: string;
}

type ModalMode = 'create' | 'view' | 'edit' | null;

// Default column configuration
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'employeeId', label: 'Mã NV', field: 'employeeId', sortable: true, align: 'left', visible: true },
  { id: 'fullName', label: 'Họ và Tên', field: 'fullName', sortable: true, align: 'left', visible: true },
  { id: 'businessUnit', label: 'Đơn Vị', field: 'businessUnit', align: 'left', visible: true },
  { id: 'specialization', label: 'Chuyên Môn', field: 'specialization', align: 'left', visible: true },
  { id: 'level', label: 'Cấp Bậc', field: 'level', align: 'left', visible: true },
  { id: 'joinDate', label: 'Ngày Vào Làm', field: 'joinDate', sortable: true, align: 'center', visible: true },
  { id: 'workStatus', label: 'Trạng Thái', field: 'workStatus', align: 'center', visible: true },
  { id: 'actions', label: 'Hành Động', align: 'center', visible: true },
];

export function QuanLyNhanSu() {
  // Draggable columns
  const { columns, moveColumn, resetColumns } = useDraggableColumns({
    defaultColumns: DEFAULT_COLUMNS,
    storageKey: 'quan-ly-nhan-su-columns',
    userId: 'user_001' // In real app, get from auth context
  });

  // Use database hook for employees
  const {
    employees: dbEmployees,
    loading: dbLoading,
    error: dbError,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();

  // Normalize database employees to UI format
  const employees = dbEmployees.map(emp => ({
    id: emp.id,
    employeeId: emp.employeeId || '',
    fullName: emp.employeeName || '',
    email: emp.email || '',
    phone: emp.phone || '',
    businessUnit: emp.businessUnit || '',
    specialization: emp.position || '',
    level: emp.department || '',
    joinDate: emp.hireDate || '',
    workStatus: emp.status === 'active' ? 'working' as const : emp.status === 'inactive' ? 'resigned' as const : 'probation' as const,
    birthDate: '',
    idCard: '',
    address: '',
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterBU, setFilterBU] = useState<string>('all');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Modal states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    businessUnit: '',
    specialization: '',
    level: '',
    joinDate: '',
    workStatus: 'working' as 'working' | 'probation' | 'resigned',
    birthDate: '',
    idCard: '',
    address: '',
  });

  // Sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const buList = ['BlueBolt G&A', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt Services', 'BlueBolt Software'];
  const specializationList = ['BA', 'Developer', 'DevOps', 'Data Analyst', 'AI Engineer', 'PM', 'QA/QC', 'Designer', 'Sales', 'Marketing', 'Fullstack', 'Kế toán', 'Đào tạo (Trainer)'];
  const levelList = ['Nhân viên', 'Trưởng nhóm', 'Trưởng phòng', 'Quản lý (Manager)', 'Giám đốc'];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      emp.fullName.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesBU = filterBU === 'all' || emp.businessUnit === filterBU;
    const matchesSpecialization = filterSpecialization === 'all' || emp.specialization === filterSpecialization;
    const matchesStatus = filterStatus === 'all' || emp.workStatus === filterStatus;
    
    return matchesSearch && matchesBU && matchesSpecialization && matchesStatus;
  });

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;

    let comparison = 0;
    
    if (sortField === 'employeeId') {
      comparison = a.employeeId.localeCompare(b.employeeId);
    } else if (sortField === 'fullName') {
      comparison = a.fullName.localeCompare(b.fullName);
    } else if (sortField === 'joinDate') {
      const dateA = convertToDate(a.joinDate);
      const dateB = convertToDate(b.joinDate);
      comparison = dateA.getTime() - dateB.getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  const convertToDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setFilterBU('all');
    setFilterSpecialization('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // CRUD Operations
  const handleCreate = () => {
    setModalMode('create');
    setSelectedEmployee(null);
    setFormData({
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      fullName: '',
      email: '',
      phone: '',
      businessUnit: '',
      specialization: '',
      level: '',
      joinDate: '',
      workStatus: 'working',
      birthDate: '',
      idCard: '',
      address: '',
    });
  };

  const handleView = (employee: Employee) => {
    setModalMode('view');
    setSelectedEmployee(employee);
    setFormData({ ...employee });
  };

  const handleEdit = (employee: Employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData({ ...employee });
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingEmployee) {
      const result = await deleteEmployee(deletingEmployee.id);
      if (result.success) {
        setShowDeleteConfirm(false);
        setDeletingEmployee(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Transform UI data to database format
    const dbData = {
      employeeId: formData.employeeId,
      employeeName: formData.fullName,
      businessUnit: formData.businessUnit,
      position: formData.specialization,
      department: formData.level,
      email: formData.email,
      phone: formData.phone,
      hireDate: formData.joinDate,
      status: formData.workStatus === 'working' ? 'active' : formData.workStatus === 'resigned' ? 'inactive' : 'probation',
    };

    if (modalMode === 'create') {
      const result = await createEmployee(dbData);
      if (result.success) {
        setModalMode(null);
        setSelectedEmployee(null);
      }
    } else if (modalMode === 'edit' && selectedEmployee) {
      const result = await updateEmployee(selectedEmployee.id, dbData);
      if (result.success) {
        setModalMode(null);
        setSelectedEmployee(null);
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'working': 'Đang làm việc',
      'probation': 'Thử việc',
      'resigned': 'Nghỉ việc'
    };
    return labels[status] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'working': 'bg-green-100 text-green-700',
      'probation': 'bg-yellow-100 text-yellow-700',
      'resigned': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const isReadOnly = modalMode === 'view';

  // Render cell based on column
  const renderCell = (column: ColumnConfig, employee: Employee) => {
    const alignClass = 
      column.align === 'center' ? 'text-center' :
      column.align === 'right' ? 'text-right' : 'text-left';

    switch (column.id) {
      case 'employeeId':
        return (
          <td key={column.id} className={`py-4 px-6 whitespace-nowrap ${alignClass}`}>
            <span className="font-bold text-gray-900">{employee.employeeId}</span>
          </td>
        );
      
      case 'fullName':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="font-medium text-gray-900">{employee.fullName}</span>
          </td>
        );
      
      case 'businessUnit':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="text-sm text-gray-600">{employee.businessUnit}</span>
          </td>
        );
      
      case 'specialization':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="text-sm text-gray-600">{employee.specialization}</span>
          </td>
        );
      
      case 'level':
        return (
          <td key={column.id} className={`py-4 px-6 ${alignClass}`}>
            <span className="text-sm text-gray-600">{employee.level}</span>
          </td>
        );
      
      case 'joinDate':
        return (
          <td key={column.id} className={`py-4 px-6 whitespace-nowrap ${alignClass}`}>
            <span className="text-sm text-gray-600">{employee.joinDate}</span>
          </td>
        );
      
      case 'workStatus':
        return (
          <td key={column.id} className={`py-4 px-6 whitespace-nowrap ${alignClass}`}>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(employee.workStatus)}`}>
              {getStatusLabel(employee.workStatus)}
            </span>
          </td>
        );
      
      case 'actions':
        return (
          <td key={column.id} className={`py-4 px-6 whitespace-nowrap ${alignClass}`}>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleView(employee)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Xem"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(employee)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Sửa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(employee)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xóa"
                disabled={employee.workStatus === 'resigned'}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Nhân Sự</h1>
        <p className="text-gray-600">Quản lý thông tin nhân viên và phân quyền theo BU</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Mã nhân viên hoặc Họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterBU}
              onChange={(e) => setFilterBU(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
            >
              <option value="all">Tất cả đơn vị</option>
              {buList.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>

            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
            >
              <option value="all">Tất cả chuyên môn</option>
              {specializationList.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="working">Đang làm việc</option>
              <option value="probation">Thử việc</option>
              <option value="resigned">Nghỉ việc</option>
            </select>

            <button
              onClick={handleClearFilter}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

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
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Thêm NV
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
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
                      onSort={column.sortable ? handleSort : undefined}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      renderSortIcon={renderSortIcon}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    {columns.filter(c => c.visible).map((column) => renderCell(column, employee))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DndProvider>

        {paginatedEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy nhân viên nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, sortedEmployees.length)}</span> trong tổng số <span className="font-semibold">{sortedEmployees.length}</span> nhân viên
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[#1E6BB8] text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingEmployee && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Xác nhận nghỉ việc</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn cho nhân viên này nghỉ việc?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mã:</span> {deletingEmployee.employeeId}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Họ tên:</span> {deletingEmployee.fullName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">BU:</span> {deletingEmployee.businessUnit}
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
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/View/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {modalMode === 'create' && 'Thêm Nhân Viên Mới'}
                    {modalMode === 'view' && 'Xem Thông Tin Nhân Viên'}
                    {modalMode === 'edit' && 'Chỉnh Sửa Thông Tin Nhân Viên'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {modalMode === 'view' ? 'Chi tiết thông tin nhân viên' : 'Vui lòng điền đầy đủ thông tin bên dưới'}
                  </p>
                </div>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <form onSubmit={handleSubmit} id="employee-form">
                <div className="space-y-5">
                  {/* Row 1: Mã NV & Trạng thái */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Mã Nhân Viên (Auto)
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Trạng Thái Làm Việc
                      </label>
                      <select
                        value={formData.workStatus}
                        onChange={(e) => setFormData({ ...formData, workStatus: e.target.value as any })}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="working">Đang làm việc</option>
                        <option value="probation">Thử việc</option>
                        <option value="resigned">Nghỉ việc</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Họ tên */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      disabled={isReadOnly}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  {/* Row 3: Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@bluebolt.vn"
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Số Điện Thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 4: BU & Chuyên môn */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Đơn Vị (BU) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.businessUnit}
                        onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Chọn đơn vị</option>
                        {buList.map(bu => (
                          <option key={bu} value={bu}>{bu}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Chuyên Môn <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Chọn chuyên môn</option>
                        {specializationList.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Cấp bậc & Ngày vào làm */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Cấp Bậc <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Chọn cấp bậc</option>
                        {levelList.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày Vào Làm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.joinDate ? formData.joinDate.split('/').reverse().join('-') : ''}
                        onChange={(e) => {
                          const date = e.target.value.split('-').reverse().join('/');
                          setFormData({ ...formData, joinDate: date });
                        }}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 6: Ngày sinh & CMND */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày Sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate ? formData.birthDate.split('/').reverse().join('-') : ''}
                        onChange={(e) => {
                          const date = e.target.value.split('-').reverse().join('/');
                          setFormData({ ...formData, birthDate: date });
                        }}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Số CMND/CCCD <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.idCard}
                        onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                        placeholder="001234567890"
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 7: Địa chỉ */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa Chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
                      rows={2}
                      disabled={isReadOnly}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
              >
                {modalMode === 'view' ? 'Đóng' : 'Hủy bỏ'}
              </button>
              {modalMode !== 'view' && (
                <button
                  type="submit"
                  form="employee-form"
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
                >
                  <Save className="w-4 h-4" />
                  {modalMode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
