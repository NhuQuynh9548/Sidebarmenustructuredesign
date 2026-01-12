import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Ban, Users, X, AlertCircle, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Save, Mail, Phone, MapPin, CreditCard, Building2, FileText, Calendar, DollarSign, Briefcase, User, Download, RotateCcw } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDraggableColumns, DraggableColumnHeader, ColumnConfig } from '../hooks/useDraggableColumns';

interface BankAccount {
  accountNumber: string;
  bankName: string;
  branch: string;
  swiftCode: string;
  isDefault: boolean;
}

interface Contract {
  id: string;
  contractNumber: string;
  signDate: string;
  expiryDate: string;
  value: number;
  fileName: string;
}

interface Partner {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerType: 'customer' | 'supplier' | 'both';
  taxCode: string;
  phone: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  address: string;
  email: string;
  representativeName: string;
  representativeTitle: string;
  representativePhone: string;
  bankAccounts: BankAccount[];
  paymentMethod: string;
  paymentTerm: number;
  contracts: Contract[];
  balance: number;
}

type SortField = 'partnerId' | 'partnerName' | 'taxCode';
type SortOrder = 'asc' | 'desc' | null;
type ModalMode = 'create' | 'view' | 'edit' | null;

export function QuanLyDoiTac() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      partnerId: 'PT001',
      partnerName: 'Công ty TNHH Công Nghệ ABC',
      partnerType: 'customer',
      taxCode: '0123456789',
      phone: '0281234567',
      contactPerson: 'Nguyễn Văn A',
      status: 'active',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      email: 'contact@abc.com.vn',
      representativeName: 'Nguyễn Văn A',
      representativeTitle: 'Giám đốc',
      representativePhone: '0901111111',
      bankAccounts: [
        { accountNumber: '1234567890', bankName: 'Vietcombank', branch: 'Chi nhánh TP.HCM', swiftCode: 'BFTVVNVX', isDefault: true }
      ],
      paymentMethod: 'Chuyển khoản',
      paymentTerm: 30,
      contracts: [
        { id: 'c1', contractNumber: 'HĐ-2024-001', signDate: '01/01/2024', expiryDate: '31/12/2024', value: 500000000, fileName: 'contract_001.pdf' }
      ],
      balance: 0
    },
    {
      id: '2',
      partnerId: 'PT002',
      partnerName: 'Công ty CP Phần Mềm XYZ',
      partnerType: 'supplier',
      taxCode: '0987654321',
      phone: '0282345678',
      contactPerson: 'Trần Thị B',
      status: 'active',
      address: '456 Lê Lợi, Q3, TP.HCM',
      email: 'info@xyz.com.vn',
      representativeName: 'Trần Thị B',
      representativeTitle: 'CEO',
      representativePhone: '0902222222',
      bankAccounts: [
        { accountNumber: '9876543210', bankName: 'Techcombank', branch: 'CN Cộng Hòa', swiftCode: 'VTCBVNVX', isDefault: true }
      ],
      paymentMethod: 'Chuyển khoản',
      paymentTerm: 15,
      contracts: [
        { id: 'c2', contractNumber: 'HĐ-2024-002', signDate: '15/02/2024', expiryDate: '15/02/2025', value: 300000000, fileName: 'contract_002.pdf' }
      ],
      balance: 0
    },
    {
      id: '3',
      partnerId: 'PT003',
      partnerName: 'Tập đoàn DEF',
      partnerType: 'both',
      taxCode: '0111222333',
      phone: '0283456789',
      contactPerson: 'Lê Văn C',
      status: 'active',
      address: '789 Trần Hưng Đạo, Q5, TP.HCM',
      email: 'hello@def.com.vn',
      representativeName: 'Lê Văn C',
      representativeTitle: 'Tổng Giám đốc',
      representativePhone: '0903333333',
      bankAccounts: [
        { accountNumber: '5555666677', bankName: 'VPBank', branch: 'CN Tân Bình', swiftCode: 'VPBKVNVX', isDefault: true },
        { accountNumber: '8888999900', bankName: 'ACB', branch: 'CN Quận 1', swiftCode: 'ASCBVNVX', isDefault: false }
      ],
      paymentMethod: 'Tiền mặt',
      paymentTerm: 7,
      contracts: [
        { id: 'c3', contractNumber: 'HĐ-2024-003', signDate: '10/01/2024', expiryDate: '10/02/2025', value: 800000000, fileName: 'contract_003.pdf' }
      ],
      balance: 50000000
    },
    {
      id: '4',
      partnerId: 'PT004',
      partnerName: 'Công ty TNHH GHI Solutions',
      partnerType: 'customer',
      taxCode: '0444555666',
      phone: '0284567890',
      contactPerson: 'Phạm Thị D',
      status: 'active',
      address: '234 Võ Văn Tần, Q3, TP.HCM',
      email: 'support@ghi.vn',
      representativeName: 'Phạm Thị D',
      representativeTitle: 'Phó Giám đốc',
      representativePhone: '0904444444',
      bankAccounts: [
        { accountNumber: '1111222233', bankName: 'BIDV', branch: 'CN Bình Thạnh', swiftCode: 'BIDVVNVX', isDefault: true }
      ],
      paymentMethod: 'Chuyển khoản',
      paymentTerm: 45,
      contracts: [],
      balance: 0
    },
    {
      id: '5',
      partnerId: 'PT005',
      partnerName: 'Nhà cung cấp JKL',
      partnerType: 'supplier',
      taxCode: '0777888999',
      phone: '0285678901',
      contactPerson: 'Hoàng Văn E',
      status: 'inactive',
      address: '567 Nguyễn Thị Minh Khai, Q1, TP.HCM',
      email: 'contact@jkl.com',
      representativeName: 'Hoàng Văn E',
      representativeTitle: 'Giám đốc Kinh doanh',
      representativePhone: '0905555555',
      bankAccounts: [
        { accountNumber: '3333444455', bankName: 'Sacombank', branch: 'CN Quận 10', swiftCode: 'SGTTVNVX', isDefault: true }
      ],
      paymentMethod: 'Chuyển khoản',
      paymentTerm: 30,
      contracts: [
        { id: 'c4', contractNumber: 'HĐ-2023-015', signDate: '20/12/2023', expiryDate: '20/01/2025', value: 200000000, fileName: 'contract_004.pdf' }
      ],
      balance: 0
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivatingPartner, setDeactivatingPartner] = useState<Partner | null>(null);

  // Modal states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'contracts'>('info');

  // Form data
  const [formData, setFormData] = useState<Partial<Partner>>({
    partnerId: '',
    partnerName: '',
    partnerType: 'customer',
    taxCode: '',
    phone: '',
    contactPerson: '',
    status: 'active',
    address: '',
    email: '',
    representativeName: '',
    representativeTitle: '',
    representativePhone: '',
    bankAccounts: [{ accountNumber: '', bankName: '', branch: '', swiftCode: '', isDefault: true }],
    paymentMethod: 'Chuyển khoản',
    paymentTerm: 30,
    contracts: [],
    balance: 0,
  });

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter logic
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.partnerId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      partner.partnerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      partner.taxCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      partner.phone.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesType = filterType === 'all' || partner.partnerType === filterType || (filterType === 'both' && partner.partnerType === 'both');
    
    return matchesSearch && matchesType;
  });

  // Sorting logic
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;
    let comparison = 0;
    if (sortField === 'partnerId') comparison = a.partnerId.localeCompare(b.partnerId);
    else if (sortField === 'partnerName') comparison = a.partnerName.localeCompare(b.partnerName);
    else if (sortField === 'taxCode') comparison = a.taxCode.localeCompare(b.taxCode);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPartners = sortedPartners.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') { setSortField(null); setSortOrder(null); }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    if (sortOrder === 'asc') return <ArrowUp className="w-4 h-4 text-[#1E6BB8]" />;
    return <ArrowDown className="w-4 h-4 text-[#1E6BB8]" />;
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setFilterType('all');
    setCurrentPage(1);
  };

  // CRUD Operations
  const handleCreate = () => {
    setModalMode('create');
    setSelectedPartner(null);
    setActiveTab('info');
    setFormData({
      partnerId: `PT${String(partners.length + 1).padStart(3, '0')}`,
      partnerName: '',
      partnerType: 'customer',
      taxCode: '',
      phone: '',
      contactPerson: '',
      status: 'active',
      address: '',
      email: '',
      representativeName: '',
      representativeTitle: '',
      representativePhone: '',
      bankAccounts: [{ accountNumber: '', bankName: '', branch: '', swiftCode: '', isDefault: true }],
      paymentMethod: 'Chuyển khoản',
      paymentTerm: 30,
      contracts: [],
      balance: 0,
    });
  };

  const handleView = (partner: Partner) => {
    setModalMode('view');
    setSelectedPartner(partner);
    setActiveTab('info');
    setFormData({ ...partner });
  };

  const handleEdit = (partner: Partner) => {
    setModalMode('edit');
    setSelectedPartner(partner);
    setActiveTab('info');
    setFormData({ ...partner });
  };

  const handleDeactivate = (partner: Partner) => {
    setDeactivatingPartner(partner);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = () => {
    if (deactivatingPartner) {
      setPartners(partners.map(p =>
        p.id === deactivatingPartner.id ? { ...p, status: 'inactive' as const } : p
      ));
      setShowDeactivateConfirm(false);
      setDeactivatingPartner(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate tax code
    if (formData.taxCode && (formData.taxCode.length < 10 || formData.taxCode.length > 13)) {
      alert('Mã số thuế phải có từ 10-13 chữ số');
      return;
    }

    // Check duplicate tax code
    const isDuplicateTaxCode = partners.some(p => 
      p.taxCode === formData.taxCode && p.id !== selectedPartner?.id
    );
    if (isDuplicateTaxCode) {
      alert('Mã số thuế đã tồn tại trong hệ thống');
      return;
    }

    // Check duplicate phone
    const isDuplicatePhone = partners.some(p => 
      p.phone === formData.phone && p.id !== selectedPartner?.id
    );
    if (isDuplicatePhone) {
      alert('Số điện thoại đã tồn tại trong hệ thống');
      return;
    }
    
    if (modalMode === 'create') {
      const newPartner: Partner = {
        id: Date.now().toString(),
        ...formData as Partner,
      };
      setPartners([...partners, newPartner]);
    } else if (modalMode === 'edit' && selectedPartner) {
      setPartners(partners.map(p =>
        p.id === selectedPartner.id ? { ...p, ...formData } as Partner : p
      ));
    }
    
    setModalMode(null);
    setSelectedPartner(null);
  };

  const getPartnerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'customer': 'Khách hàng',
      'supplier': 'Nhà cung cấp',
      'both': 'KH & NCC'
    };
    return labels[type] || type;
  };

  const getPartnerTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'customer': 'bg-blue-100 text-blue-700',
      'supplier': 'bg-green-100 text-green-700',
      'both': 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isContractExpiringSoon = (expiryDate: string) => {
    const [day, month, year] = expiryDate.split('/');
    const expiry = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const canDeactivate = (partner: Partner) => {
    if (partner.balance !== 0) return { canDeactivate: false, reason: 'Đối tác còn dư nợ' };
    const activeContracts = partner.contracts.filter(c => {
      const [day, month, year] = c.expiryDate.split('/');
      const expiry = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return expiry > new Date();
    });
    if (activeContracts.length > 0) return { canDeactivate: false, reason: 'Đối tác còn hợp đồng hiệu lực' };
    return { canDeactivate: true, reason: '' };
  };

  const addBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [
        ...(formData.bankAccounts || []),
        { accountNumber: '', bankName: '', branch: '', swiftCode: '', isDefault: false }
      ]
    });
  };

  const removeBankAccount = (index: number) => {
    const newBankAccounts = formData.bankAccounts?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, bankAccounts: newBankAccounts });
  };

  const updateBankAccount = (index: number, field: keyof BankAccount, value: string | boolean) => {
    const newBankAccounts = [...(formData.bankAccounts || [])];
    if (field === 'isDefault' && value === true) {
      newBankAccounts.forEach((acc, i) => {
        acc.isDefault = i === index;
      });
    } else {
      newBankAccounts[index] = { ...newBankAccounts[index], [field]: value };
    }
    setFormData({ ...formData, bankAccounts: newBankAccounts });
  };

  const isReadOnly = modalMode === 'view';

  // Draggable columns
  const columns: ColumnConfig[] = [
    { key: 'partnerId', label: 'Mã Đối Tác' },
    { key: 'partnerName', label: 'Tên Đối Tác' },
    { key: 'partnerType', label: 'Loại' },
    { key: 'taxCode', label: 'Mã Số Thuế' },
    { key: 'phone', label: 'Số ĐT' },
    { key: 'contactPerson', label: 'Người Liên Hệ' },
    { key: 'status', label: 'Trạng Thái' },
    { key: 'actions', label: 'Hành Động' },
  ];

  const { draggableColumns, handleColumnDragEnd } = useDraggableColumns(columns);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QUẢN LÝ ĐỐI TÁC</h1>
          <p className="text-gray-600">Quản lý thông tin khách hàng và nhà cung cấp</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Thêm Đối tác
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Mã đối tác, Tên, MST, hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
            >
              <option value="all">Tất cả loại đối tác</option>
              <option value="customer">Khách hàng</option>
              <option value="supplier">Nhà cung cấp</option>
              <option value="both">Cả hai</option>
            </select>

            <button
              onClick={handleClearFilter}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('partnerId')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-[#1E6BB8] transition-colors"
                  >
                    Mã Đối Tác
                    {getSortIcon('partnerId')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('partnerName')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-[#1E6BB8] transition-colors"
                  >
                    Tên Đối Tác
                    {getSortIcon('partnerName')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('taxCode')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-[#1E6BB8] transition-colors"
                  >
                    Mã Số Thuế
                    {getSortIcon('taxCode')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số ĐT</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người Liên Hệ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPartners.map((partner) => {
                const deactivateCheck = canDeactivate(partner);
                return (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900">{partner.partnerId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{partner.partnerName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPartnerTypeBadgeColor(partner.partnerType)}`}>
                        {getPartnerTypeLabel(partner.partnerType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{partner.taxCode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{partner.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{partner.contactPerson}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(partner.status)}`}>
                        {partner.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(partner)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết 360°"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(partner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeactivate(partner)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={deactivateCheck.canDeactivate ? 'Ngừng hợp tác' : deactivateCheck.reason}
                          disabled={!deactivateCheck.canDeactivate || partner.status === 'inactive'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedPartners.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy đối tác nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, sortedPartners.length)}</span> trong tổng số <span className="font-semibold">{sortedPartners.length}</span> đối tác
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

      {/* Create/View/Edit Modal - 360° View */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {modalMode === 'create' && 'Thêm Đối Tác Mới'}
                    {modalMode === 'view' && 'Xem Thông Tin Đối Tác (360° View)'}
                    {modalMode === 'edit' && 'Chỉnh Sửa Thông Tin Đối Tác'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {modalMode === 'view' ? 'Thông tin chi tiết đối tác' : 'Vui lòng điền đầy đủ thông tin bên dưới'}
                  </p>
                </div>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-[#1E6BB8] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Thông tin chung
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'contracts'
                      ? 'bg-[#1E6BB8] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Hợp đồng & Lịch sử
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-6">
              <form onSubmit={handleSubmit} id="partner-form">
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                        Thông tin cơ bản
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="text-red-500">*</span> Mã Đối Tác (Auto)
                          </label>
                          <input
                            type="text"
                            value={formData.partnerId}
                            disabled
                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="text-red-500">*</span> Tên Đối Tác
                          </label>
                          <input
                            type="text"
                            value={formData.partnerName}
                            onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                            placeholder="Công ty TNHH ABC"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="text-red-500">*</span> Loại Đối Tác
                          </label>
                          <select
                            value={formData.partnerType}
                            onChange={(e) => setFormData({ ...formData, partnerType: e.target.value as any })}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          >
                            <option value="customer">Khách hàng</option>
                            <option value="supplier">Nhà cung cấp</option>
                            <option value="both">Cả hai (KH & NCC)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-red-500">*</span> Mã Số Thuế (10-13 số)
                          </label>
                          <input
                            type="text"
                            value={formData.taxCode}
                            onChange={(e) => setFormData({ ...formData, taxCode: e.target.value.replace(/\D/g, '') })}
                            placeholder="0123456789"
                            maxLength={13}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-red-500">*</span> Số Điện Thoại
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0281234567"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-red-500">*</span> Email Nhận Hóa Đơn
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="contact@company.vn"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-red-500">*</span> Địa Chỉ Trụ Sở
                          </label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                            rows={2}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Người đại diện */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                        Người đại diện
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            Họ Tên
                          </label>
                          <input
                            type="text"
                            value={formData.representativeName}
                            onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                            placeholder="Nguyễn Văn A"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            Chức Vụ
                          </label>
                          <input
                            type="text"
                            value={formData.representativeTitle}
                            onChange={(e) => setFormData({ ...formData, representativeTitle: e.target.value })}
                            placeholder="Giám đốc"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            SĐT Trực Tiếp
                          </label>
                          <input
                            type="tel"
                            value={formData.representativePhone}
                            onChange={(e) => setFormData({ ...formData, representativePhone: e.target.value })}
                            placeholder="0901234567"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tài khoản ngân hàng */}
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase">
                          Tài khoản ngân hàng
                        </h3>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={addBankAccount}
                            className="text-sm text-[#1E6BB8] hover:text-[#1557A0] font-medium"
                          >
                            + Thêm tài khoản
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {formData.bankAccounts?.map((account, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Số Tài Khoản</label>
                                <input
                                  type="text"
                                  value={account.accountNumber}
                                  onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                                  placeholder="1234567890"
                                  disabled={isReadOnly}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên Ngân Hàng</label>
                                <input
                                  type="text"
                                  value={account.bankName}
                                  onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                                  placeholder="Vietcombank"
                                  disabled={isReadOnly}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Chi Nhánh</label>
                                <input
                                  type="text"
                                  value={account.branch}
                                  onChange={(e) => updateBankAccount(index, 'branch', e.target.value)}
                                  placeholder="CN TP.HCM"
                                  disabled={isReadOnly}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Swift Code / Mã T24</label>
                                <input
                                  type="text"
                                  value={account.swiftCode}
                                  onChange={(e) => updateBankAccount(index, 'swiftCode', e.target.value)}
                                  placeholder="BFTVVNVX"
                                  disabled={isReadOnly}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] disabled:bg-gray-100"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={account.isDefault}
                                  onChange={(e) => updateBankAccount(index, 'isDefault', e.target.checked)}
                                  disabled={isReadOnly}
                                  className="w-4 h-4 text-[#1E6BB8] rounded focus:ring-[#1E6BB8]"
                                />
                                <span className="text-sm font-medium text-gray-700">Tài khoản mặc định</span>
                              </label>
                              {!isReadOnly && formData.bankAccounts && formData.bankAccounts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBankAccount(index)}
                                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Điều khoản thanh toán */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                        Điều khoản thanh toán
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            Phương Thức Thanh Toán Mặc Định
                          </label>
                          <select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="Chuyển khoản">Chuyển khoản</option>
                            <option value="Tiền mặt">Tiền mặt</option>
                            <option value="Séc">Séc</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Thời Hạn Thanh Toán (ngày)
                          </label>
                          <input
                            type="number"
                            value={formData.paymentTerm}
                            onChange={(e) => setFormData({ ...formData, paymentTerm: parseInt(e.target.value) || 0 })}
                            placeholder="30"
                            min="0"
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contracts' && (
                  <div className="space-y-6">
                    {/* Danh sách hợp đồng */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                        Danh sách hợp đồng
                      </h3>
                      {formData.contracts && formData.contracts.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số Hợp Đồng</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày Ký</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày Hết Hạn</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giá Trị</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {formData.contracts.map((contract) => (
                                <tr 
                                  key={contract.id} 
                                  className={`${isContractExpiringSoon(contract.expiryDate) ? 'bg-red-50' : ''}`}
                                >
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {contract.contractNumber}
                                    {isContractExpiringSoon(contract.expiryDate) && (
                                      <span className="ml-2 text-xs text-red-600 font-semibold">⚠️ Sắp hết hạn</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{contract.signDate}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{contract.expiryDate}</td>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(contract.value)}</td>
                                  <td className="px-4 py-3">
                                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                                      <Download className="w-4 h-4" />
                                      {contract.fileName}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p>Chưa có hợp đồng nào</p>
                        </div>
                      )}
                    </div>

                    {/* Lịch sử giao dịch */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                        Lịch sử giao dịch
                      </h3>
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>Chưa có giao dịch nào</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

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
                  form="partner-form"
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

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && deactivatingPartner && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Xác nhận ngừng hợp tác</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn ngừng hợp tác với đối tác này?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mã:</span> {deactivatingPartner.partnerId}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Tên:</span> {deactivatingPartner.partnerName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">MST:</span> {deactivatingPartner.taxCode}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeactivate}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}