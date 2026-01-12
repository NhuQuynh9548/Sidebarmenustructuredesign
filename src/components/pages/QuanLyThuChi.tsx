import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, DollarSign, X, AlertCircle, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Save, Calendar, Building2, FileText, Paperclip, TrendingUp, TrendingDown, RefreshCw, ChevronDown, ChevronUp, User, Users, Upload, Printer, Send, CheckCircle, XCircle, Image as ImageIcon, ExternalLink, Briefcase, RotateCcw, Settings, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatePicker } from '../DatePicker';
import { useTransactions } from '../../hooks/useTransactions';

interface AllocationPreview {
  bu: string;
  percentage: number;
  amount: number;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

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
  allocationPreview?: AllocationPreview[];
  attachments: number;
  attachedFiles?: AttachedFile[];
  paymentStatus: 'paid' | 'unpaid';
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  description: string;
}

type SortField = 'transactionDate' | 'transactionCode' | 'amount';
type SortOrder = 'asc' | 'desc' | null;
type ModalMode = 'create' | 'view' | 'edit' | null;

interface ColumnConfig {
  id: string;
  label: string;
  field?: keyof Transaction | 'actions';
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  visible: boolean;
}

// Default column configuration
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'transactionDate', label: 'Ngày CT', sortable: true, align: 'left', visible: true },
  { id: 'transactionCode', label: 'Mã GD', sortable: true, align: 'left', visible: true },
  { id: 'category', label: 'Danh mục', sortable: false, align: 'left', visible: true },
  { id: 'transactionType', label: 'Loại', sortable: false, align: 'left', visible: true },
  { id: 'objectName', label: 'Đối tượng', sortable: false, align: 'left', visible: true },
  { id: 'project', label: 'Dự án', sortable: false, align: 'left', visible: true },
  { id: 'amount', label: 'Số tiền', sortable: true, align: 'right', visible: true },
  { id: 'businessUnit', label: 'BU', sortable: false, align: 'left', visible: true },
  { id: 'paymentMethod', label: 'PTTT', sortable: false, align: 'left', visible: true },
  { id: 'costAllocation', label: 'Phân bổ', sortable: false, align: 'center', visible: true },
  { id: 'attachments', label: 'CT', sortable: false, align: 'center', visible: true },
  { id: 'paymentStatus', label: 'TT', sortable: false, align: 'left', visible: true },
  { id: 'approvalStatus', label: 'Phê duyệt', sortable: false, align: 'left', visible: true },
  { id: 'actions', label: 'Hành động', sortable: false, align: 'center', visible: true },
];

export function QuanLyThuChi() {
  // Get current user ID (in real app, from auth context)
  const currentUserId = 'user_001';

  // Column order state with localStorage persistence
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem(`thu-chi-columns-${currentUserId}`);
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  // Save column config to localStorage
  useEffect(() => {
    localStorage.setItem(`thu-chi-columns-${currentUserId}`, JSON.stringify(columns));
  }, [columns, currentUserId]);

  // Move column function for drag & drop
  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    setColumns(newColumns);
  };

  // Reset to default
  const resetColumns = () => {
    if (window.confirm('Đặt lại thứ tự cột về mặc định?')) {
      setColumns(DEFAULT_COLUMNS);
    }
  };

  // Use database hook for transactions
  const {
    transactions: dbTransactions,
    loading: dbLoading,
    error: dbError,
    loadTransactions,
    createTransaction: dbCreateTransaction,
    updateTransaction: dbUpdateTransaction,
    deleteTransaction: dbDeleteTransaction
  } = useTransactions();

  // Normalize database transactions to UI format
  const transactions = dbTransactions.map(txn => ({
    id: txn.id,
    transactionCode: txn.transactionCode || '',
    transactionDate: txn.transactionDate || '',
    transactionType: txn.transactionType || 'income',
    category: txn.category || '',
    project: '',
    objectType: 'partner' as const,
    objectName: txn.objectName || '',
    paymentMethod: txn.paymentMethod || '',
    businessUnit: txn.businessUnit || '',
    amount: txn.amount || 0,
    costAllocation: 'direct' as const,
    attachments: txn.attachments || 0,
    attachedFiles: [],
    paymentStatus: txn.paymentStatus || 'unpaid',
    approvalStatus: txn.approvalStatus || 'draft',
    description: txn.description || '',
  }));

  const _mockTransactions = [
    {
      id: '1',
      transactionCode: 'T0125_01',
      transactionDate: '15/01/2025',
      transactionType: 'income',
      category: 'Doanh thu dịch vụ',
      project: 'PRJ-2024-001',
      objectType: 'partner',
      objectName: 'Công ty TNHH ABC',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt Software',
      amount: 50000000,
      costAllocation: 'direct',
      attachments: 2,
      attachedFiles: [
        { id: '1', name: 'hop_dong.pdf', size: 1024000, type: 'application/pdf', url: '#' },
        { id: '2', name: 'bien_ban.jpg', size: 512000, type: 'image/jpeg', url: '#' }
      ],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Thanh toán dự án phần mềm'
    },
    {
      id: '2',
      transactionCode: 'C0125_01',
      transactionDate: '16/01/2025',
      transactionType: 'expense',
      category: 'Chi phí văn phòng',
      objectType: 'partner',
      objectName: 'Nhà cung cấp JKL',
      paymentMethod: 'Tiền mặt',
      businessUnit: 'BlueBolt G&A',
      amount: 5000000,
      costAllocation: 'indirect',
      allocationRule: 'Theo tỷ lệ doanh thu',
      allocationPreview: [
        { bu: 'BlueBolt G&A', percentage: 17, amount: 850000 },
        { bu: 'BlueBolt R&D', percentage: 14, amount: 700000 },
        { bu: 'BlueBolt Academy', percentage: 13, amount: 650000 },
        { bu: 'BlueBolt Services', percentage: 19, amount: 950000 },
        { bu: 'BlueBolt Software', percentage: 37, amount: 1850000 }
      ],
      attachments: 1,
      attachedFiles: [
        { id: '3', name: 'hoa_don.pdf', size: 800000, type: 'application/pdf', url: '#' }
      ],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Mua văn phòng phẩm'
    },
    {
      id: '3',
      transactionCode: 'V0125_01',
      transactionDate: '17/01/2025',
      transactionType: 'loan',
      category: 'Tạm ứng nhân viên',
      project: 'PRJ-2024-002',
      objectType: 'employee',
      objectName: 'Nguyễn Văn An',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt Software',
      amount: 10000000,
      costAllocation: 'direct',
      attachments: 0,
      attachedFiles: [],
      paymentStatus: 'unpaid',
      approvalStatus: 'pending',
      description: 'Tạm ứng công tác phí'
    },
    {
      id: '4',
      transactionCode: 'T0125_02',
      transactionDate: '18/01/2025',
      transactionType: 'income',
      category: 'Doanh thu đào tạo',
      objectType: 'partner',
      objectName: 'Tập đoàn DEF',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt Academy',
      amount: 30000000,
      costAllocation: 'direct',
      attachments: 3,
      attachedFiles: [
        { id: '4', name: 'contract_signed.pdf', size: 1500000, type: 'application/pdf', url: '#' },
        { id: '5', name: 'invoice_001.pdf', size: 900000, type: 'application/pdf', url: '#' },
        { id: '6', name: 'payment_proof.jpg', size: 600000, type: 'image/jpeg', url: '#' }
      ],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Khóa đào tạo doanh nghiệp'
    },
    {
      id: '5',
      transactionCode: 'C0125_02',
      transactionDate: '19/01/2025',
      transactionType: 'expense',
      category: 'Chi phí marketing',
      objectType: 'partner',
      objectName: 'Agency Marketing XYZ',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt G&A',
      amount: 15000000,
      costAllocation: 'direct',
      attachments: 1,
      attachedFiles: [
        { id: '7', name: 'quotation.pdf', size: 750000, type: 'application/pdf', url: '#' }
      ],
      paymentStatus: 'unpaid',
      approvalStatus: 'draft',
      description: 'Chiến dịch quảng cáo Q1'
    },
    {
      id: '6',
      transactionCode: 'C1224_01',
      transactionDate: '28/12/2024',
      transactionType: 'expense',
      category: 'Chi phí vận hành',
      project: 'PRJ-2024-003',
      objectType: 'partner',
      objectName: 'Công ty CP XYZ',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt Software',
      amount: 25000000,
      costAllocation: 'direct',
      attachments: 0,
      attachedFiles: [],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Chi phí tháng 12/2024'
    },
    {
      id: '7',
      transactionCode: 'T0226_01',
      transactionDate: '05/02/2026',
      transactionType: 'income',
      category: 'Doanh thu dịch vụ',
      project: 'PRJ-2024-001',
      objectType: 'partner',
      objectName: 'Công ty TNHH ABC',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt Software',
      amount: 80000000,
      costAllocation: 'direct',
      attachments: 1,
      attachedFiles: [
        { id: '8', name: 'invoice_feb.pdf', size: 950000, type: 'application/pdf', url: '#' }
      ],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Thu doanh thu tháng 2/2026'
    },
    {
      id: '8',
      transactionCode: 'C0226_01',
      transactionDate: '10/02/2026',
      transactionType: 'expense',
      category: 'Chi phí nhân sự',
      objectType: 'employee',
      objectName: 'Trần Thị Bình',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt R&D',
      amount: 20000000,
      costAllocation: 'direct',
      attachments: 0,
      attachedFiles: [],
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      description: 'Lương tháng 2/2026'
    },
    {
      id: '9',
      transactionCode: 'V0326_01',
      transactionDate: '15/03/2026',
      transactionType: 'loan',
      category: 'Tạm ứng nhân viên',
      project: 'PRJ-2024-004',
      objectType: 'employee',
      objectName: 'Lê Hoàng Cường',
      paymentMethod: 'Chuyển khoản',
      businessUnit: 'BlueBolt R&D',
      amount: 15000000,
      costAllocation: 'direct',
      attachments: 0,
      attachedFiles: [],
      paymentStatus: 'unpaid',
      approvalStatus: 'pending',
      description: 'Tạm ứng cho dự án tháng 3'
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('month');
  const [filterBU, setFilterBU] = useState<string>('all');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>('all');
  const [filterTransactionType, setFilterTransactionType] = useState<string>('all');
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Custom date range
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Modal states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalType, setModalType] = useState<'income' | 'expense' | 'loan'>('income');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<AttachedFile[]>([]);

  // Form data
  const [formData, setFormData] = useState<Partial<Transaction>>({
    transactionCode: '',
    transactionDate: new Date().toLocaleDateString('vi-VN'),
    transactionType: 'income',
    category: '',
    project: '',
    objectType: 'partner',
    objectName: '',
    paymentMethod: 'Chuyển khoản',
    businessUnit: '',
    amount: 0,
    costAllocation: 'direct',
    allocationRule: '',
    allocationPreview: [],
    attachments: 0,
    attachedFiles: [],
    paymentStatus: 'unpaid',
    approvalStatus: 'draft',
    description: '',
  });

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const buList = ['BlueBolt G&A', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt Services', 'BlueBolt Software'];
  const categoryIncome = ['Doanh thu dịch vụ', 'Doanh thu đào tạo', 'Doanh thu bản quyền', 'Thu khác'];
  const categoryExpense = ['Chi phí văn phòng', 'Chi phí marketing', 'Chi phí nhân sự', 'Chi phí vận hành', 'Chi khác'];
  const categoryLoan = ['Tạm ứng nhân viên', 'Vay ngắn hạn', 'Vay dài hạn'];
  const allocationRules = ['Theo tỷ lệ doanh thu', 'Theo số lượng nhân sự', 'Theo diện tích văn phòng'];
  const partnerList = ['Công ty TNHH ABC', 'Công ty CP XYZ', 'Tập đoàn DEF', 'Nhà cung cấp JKL', 'Agency Marketing XYZ'];
  const employeeList = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Hoa'];
  
  // Projects from Master Data
  const projectList = [
    { code: 'PRJ-2024-001', name: 'BlueBolt ERP System' },
    { code: 'PRJ-2024-002', name: 'AI Chatbot Platform' },
    { code: 'PRJ-2023-015', name: 'Website Corporate' },
    { code: 'PRJ-2024-003', name: 'Mobile Banking App' },
    { code: 'PRJ-2024-004', name: 'Data Analytics Platform' },
  ];

  // Generate transaction code based on transaction date
  const generateTransactionCode = (type: 'income' | 'expense' | 'loan', transactionDate: string) => {
    // Parse DD/MM/YYYY to get month and year
    const [day, month, year] = transactionDate.split('/').map(Number);
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year).slice(-2);
    const prefix = type === 'income' ? 'T' : type === 'expense' ? 'C' : 'V';
    
    // Count transactions of same type and same month/year
    const sameMonthYearTransactions = transactions.filter(t => {
      const [tDay, tMonth, tYear] = t.transactionDate.split('/').map(Number);
      const tMonthStr = String(tMonth).padStart(2, '0');
      const tYearStr = String(tYear).slice(-2);
      const tPrefix = t.transactionType === 'income' ? 'T' : t.transactionType === 'expense' ? 'C' : 'V';
      
      return tPrefix === prefix && tMonthStr === monthStr && tYearStr === yearStr;
    });
    
    const nextNumber = String(sameMonthYearTransactions.length + 1).padStart(2, '0');
    return `${prefix}${monthStr}${yearStr}_${nextNumber}`;
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-update transaction code when date changes (only in create mode)
  useEffect(() => {
    if (modalMode === 'create' && formData.transactionDate && formData.transactionType) {
      const newCode = generateTransactionCode(formData.transactionType, formData.transactionDate);
      if (newCode !== formData.transactionCode) {
        setFormData(prev => ({ ...prev, transactionCode: newCode }));
      }
    }
  }, [formData.transactionDate, modalMode]);

  // Parse DD/MM/YYYY to Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Get date range based on filter
  const getDateRange = (): { start: Date; end: Date } | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filterTimeRange) {
      case 'week': {
        const dayOfWeek = today.getDay();
        const start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
      }
      case 'month': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start, end };
      }
      case 'quarter': {
        const quarter = Math.floor(today.getMonth() / 3);
        const start = new Date(today.getFullYear(), quarter * 3, 1);
        const end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        return { start, end };
      }
      case 'year': {
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        return { start, end };
      }
      case 'custom': {
        if (customStartDate && customEndDate) {
          return {
            start: parseDate(customStartDate),
            end: parseDate(customEndDate)
          };
        }
        return null;
      }
      default:
        return null;
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      txn.transactionCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      txn.objectName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      txn.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (txn.project && txn.project.toLowerCase().includes(debouncedSearch.toLowerCase()));
    
    const matchesBU = filterBU === 'all' || txn.businessUnit === filterBU;
    const matchesApprovalStatus = filterApprovalStatus === 'all' || txn.approvalStatus === filterApprovalStatus;
    const matchesTransactionType = filterTransactionType === 'all' || txn.transactionType === filterTransactionType;
    
    // Date range filter
    let matchesDateRange = true;
    const dateRange = getDateRange();
    if (dateRange) {
      const txnDate = parseDate(txn.transactionDate);
      matchesDateRange = txnDate >= dateRange.start && txnDate <= dateRange.end;
    }
    
    return matchesSearch && matchesBU && matchesApprovalStatus && matchesTransactionType && matchesDateRange;
  });

  // Sorting logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;
    let comparison = 0;
    
    if (sortField === 'transactionCode') {
      comparison = a.transactionCode.localeCompare(b.transactionCode);
    } else if (sortField === 'transactionDate') {
      const dateA = parseDate(a.transactionDate);
      const dateB = parseDate(b.transactionDate);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

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
    setFilterTimeRange('month');
    setFilterBU('all');
    setFilterApprovalStatus('all');
    setFilterTransactionType('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
  };

  // Calculate KPIs based on filtered transactions (only approved)
  const calculateKPIs = () => {
    const approvedTransactions = filteredTransactions.filter(t => t.approvalStatus === 'approved');
    
    const totalIncome = approvedTransactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = approvedTransactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalLoan = approvedTransactions
      .filter(t => t.transactionType === 'loan' && t.paymentStatus === 'unpaid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, totalLoan, balance };
  };

  const kpis = calculateKPIs();

  // File handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      const allFiles = [...(uploadedFiles || []), ...newFiles];
      setUploadedFiles(allFiles);
      setFormData({ 
        ...formData, 
        attachments: allFiles.length,
        attachedFiles: allFiles 
      });
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = (uploadedFiles || []).filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    setFormData({ 
      ...formData, 
      attachments: updatedFiles.length,
      attachedFiles: updatedFiles 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // CRUD Operations
  const handleCreate = (type: 'income' | 'expense' | 'loan') => {
    const todayDate = new Date().toLocaleDateString('vi-VN');
    setModalMode('create');
    setModalType(type);
    setSelectedTransaction(null);
    setUploadedFiles([]);
    setFormData({
      transactionCode: generateTransactionCode(type, todayDate),
      transactionDate: todayDate,
      transactionType: type,
      category: '',
      project: '',
      objectType: 'partner',
      objectName: '',
      paymentMethod: 'Chuyển khoản',
      businessUnit: '',
      amount: 0,
      costAllocation: 'direct',
      allocationRule: '',
      allocationPreview: [],
      attachments: 0,
      attachedFiles: [],
      paymentStatus: 'unpaid',
      approvalStatus: 'draft',
      description: '',
    });
  };

  const handleView = (transaction: Transaction) => {
    setModalMode('view');
    setModalType(transaction.transactionType);
    setSelectedTransaction(transaction);
    setFormData({ ...transaction });
    setUploadedFiles(transaction.attachedFiles || []);
  };

  const handleEdit = (transaction: Transaction) => {
    setModalMode('edit');
    setModalType(transaction.transactionType);
    setSelectedTransaction(transaction);
    setFormData({ ...transaction });
    setUploadedFiles(transaction.attachedFiles || []);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingTransaction) {
      const result = await dbDeleteTransaction(deletingTransaction.id);
      if (result.success) {
        setShowDeleteConfirm(false);
        setDeletingTransaction(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || formData.amount <= 0) {
      alert('Số tiền phải lớn hơn 0');
      return;
    }

    if (!formData.category || !formData.businessUnit || !formData.objectName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.costAllocation === 'indirect' && !formData.allocationRule) {
      alert('Vui lòng chọn quy tắc phân bổ cho chi phí gián tiếp');
      return;
    }

    // Prepare data for database
    const dbData = {
      transactionDate: formData.transactionDate,
      transactionType: formData.transactionType,
      category: formData.category,
      objectName: formData.objectName,
      objectType: formData.objectType,
      paymentMethod: formData.paymentMethod,
      businessUnit: formData.businessUnit,
      amount: formData.amount,
      description: formData.description,
      paymentStatus: formData.paymentStatus,
      approvalStatus: formData.approvalStatus,
      attachments: formData.attachments || 0,
    };

    if (modalMode === 'create') {
      const result = await dbCreateTransaction(dbData);
      if (result.success) {
        setModalMode(null);
        setSelectedTransaction(null);
        setUploadedFiles([]);
      }
    } else if (modalMode === 'edit' && selectedTransaction) {
      const result = await dbUpdateTransaction(selectedTransaction.id, dbData);
      if (result.success) {
        setModalMode(null);
        setSelectedTransaction(null);
        setUploadedFiles([]);
      }
    }
  };

  const handleSubmitForApproval = () => {
    // Validation
    if (!formData.amount || formData.amount <= 0) {
      alert('Số tiền phải lớn hơn 0');
      return;
    }

    if (!formData.category || !formData.businessUnit || !formData.objectName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.costAllocation === 'indirect' && !formData.allocationRule) {
      alert('Vui lòng chọn quy tắc phân bổ cho chi phí gián tiếp');
      return;
    }

    if (modalMode === 'create' || modalMode === 'edit') {
      const txnData = {
        ...formData as Transaction,
        approvalStatus: 'pending' as const,
      };

      if (modalMode === 'create') {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          ...txnData,
        };
        setTransactions([newTransaction, ...transactions]);
      } else if (selectedTransaction) {
        setTransactions(transactions.map(t =>
          t.id === selectedTransaction.id ? { ...t, ...txnData } : t
        ));
      }
      
      alert('Phiếu đã được gửi phê duyệt thành công!');
      setModalMode(null);
      setSelectedTransaction(null);
      setUploadedFiles([]);
    }
  };

  const handleApprove = (transaction: Transaction) => {
    setTransactions(transactions.map(t =>
      t.id === transaction.id ? { ...t, approvalStatus: 'approved' as const } : t
    ));
    setModalMode(null);
    alert('Phiếu đã được phê duyệt!');
  };

  const handleReject = (transaction: Transaction) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      setTransactions(transactions.map(t =>
        t.id === transaction.id ? { ...t, approvalStatus: 'rejected' as const, rejectionReason: reason } : t
      ));
      setModalMode(null);
      alert('Phiếu đã bị từ chối!');
    }
  };

  const handlePrint = () => {
    alert('Chức năng in phiếu sẽ được triển khai!');
  };

  const handleAllocationRuleChange = (rule: string) => {
    setFormData({ ...formData, allocationRule: rule });
    
    // Generate allocation preview
    if (rule === 'Theo tỷ lệ doanh thu' && formData.amount) {
      const preview: AllocationPreview[] = [
        { bu: 'BlueBolt G&A', percentage: 17, amount: formData.amount * 0.17 },
        { bu: 'BlueBolt R&D', percentage: 14, amount: formData.amount * 0.14 },
        { bu: 'BlueBolt Academy', percentage: 13, amount: formData.amount * 0.13 },
        { bu: 'BlueBolt Services', percentage: 19, amount: formData.amount * 0.19 },
        { bu: 'BlueBolt Software', percentage: 37, amount: formData.amount * 0.37 }
      ];
      setFormData({ ...formData, allocationRule: rule, allocationPreview: preview });
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'income': 'Thu',
      'expense': 'Chi',
      'loan': 'Vay'
    };
    return labels[type] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'income': 'text-green-600',
      'expense': 'text-red-600',
      'loan': 'text-blue-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const getAmountColor = (type: string) => {
    const colors: Record<string, string> = {
      'income': 'text-green-600 font-bold',
      'expense': 'text-red-600 font-bold',
      'loan': 'text-blue-600 font-bold'
    };
    return colors[type] || 'text-gray-900 font-bold';
  };

  const getApprovalStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      'draft': { label: 'Nháp', color: 'bg-gray-100 text-gray-700' },
      'pending': { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
      'approved': { label: 'Đã duyệt', color: 'bg-green-100 text-green-700' },
      'rejected': { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
      'cancelled': { label: 'Đã hủy', color: 'bg-gray-100 text-gray-700' }
    };
    return config[status] || config['draft'];
  };

  const getPaymentStatusBadge = (status: string) => {
    return status === 'paid'
      ? { label: 'Đã TT', color: 'bg-green-100 text-green-700' }
      : { label: 'Chưa TT', color: 'bg-orange-100 text-orange-700' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const canEdit = (transaction: Transaction) => {
    return transaction.approvalStatus === 'draft' || transaction.approvalStatus === 'rejected';
  };

  const canDelete = (transaction: Transaction) => {
    return transaction.approvalStatus !== 'approved';
  };

  const isReadOnly = modalMode === 'view';

  const getCategoryOptions = () => {
    if (modalType === 'income') return categoryIncome;
    if (modalType === 'expense') return categoryExpense;
    return categoryLoan;
  };

  const getProjectName = (code: string) => {
    const project = projectList.find(p => p.code === code);
    return project ? `${project.code} - ${project.name}` : code;
  };

  // Draggable Column Header Component
  const DraggableColumnHeader = ({ column, index }: { column: ColumnConfig; index: number }) => {
    const ref = React.useRef<HTMLTableCellElement>(null);

    const [{ isDragging }, drag, preview] = useDrag({
      type: 'COLUMN',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: 'COLUMN',
      hover: (item: { index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveColumn(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    preview(drop(ref));

    const alignClass = 
      column.align === 'center' ? 'text-center' :
      column.align === 'right' ? 'text-right' : 'text-left';

    // Get sortField based on column id
    const getSortFieldFromId = (id: string): SortField | null => {
      if (id === 'transactionDate' || id === 'transactionCode' || id === 'amount') {
        return id as SortField;
      }
      return null;
    };

    const columnSortField = getSortFieldFromId(column.id);

    return (
      <th
        ref={ref}
        className={`px-4 py-3 ${alignClass} ${
          isDragging ? 'opacity-30 bg-blue-50' : ''
        } ${isOver ? 'bg-blue-100' : ''} transition-all`}
      >
        <div className="flex items-center gap-2">
          <div ref={drag} className="cursor-move hover:bg-gray-200 rounded p-1 transition-colors" title="Kéo để sắp xếp">
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
          {column.sortable && columnSortField ? (
            <button
              onClick={() => handleSort(columnSortField)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-[#1E6BB8] transition-colors"
            >
              {column.label}
              {getSortIcon(columnSortField)}
            </button>
          ) : (
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{column.label}</span>
          )}
        </div>
      </th>
    );
  };

  // Render cell based on column
  const renderCell = (column: ColumnConfig, txn: Transaction) => {
    const alignClass = 
      column.align === 'center' ? 'text-center' :
      column.align === 'right' ? 'text-right' : 'text-left';

    switch (column.id) {
      case 'transactionDate':
        return <td key={column.id} className={`px-4 py-3 whitespace-nowrap text-sm text-gray-600 ${alignClass}`}>{txn.transactionDate}</td>;
      
      case 'transactionCode':
        return <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}><span className="font-bold text-gray-900">{txn.transactionCode}</span></td>;
      
      case 'category':
        return <td key={column.id} className={`px-4 py-3 text-sm text-gray-600 ${alignClass}`}>{txn.category}</td>;
      
      case 'transactionType':
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}>
            <span className={`font-semibold ${getTransactionTypeColor(txn.transactionType)}`}>
              {getTransactionTypeLabel(txn.transactionType)}
            </span>
          </td>
        );
      
      case 'objectName':
        return (
          <td key={column.id} className={`px-4 py-3 ${alignClass}`}>
            <div className="flex items-center gap-2">
              {txn.objectType === 'partner' ? <Building2 className="w-4 h-4 text-gray-400" /> : <User className="w-4 h-4 text-gray-400" />}
              <span className="text-sm text-gray-900">{txn.objectName}</span>
            </div>
          </td>
        );
      
      case 'project':
        return (
          <td key={column.id} className={`px-4 py-3 ${alignClass}`}>
            {txn.project ? (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#F7931E]" />
                <span className="text-sm text-gray-900">{txn.project}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </td>
        );
      
      case 'amount':
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}>
            <span className={getAmountColor(txn.transactionType)}>
              {formatCurrency(txn.amount)}
            </span>
          </td>
        );
      
      case 'businessUnit':
        return <td key={column.id} className={`px-4 py-3 text-sm text-gray-600 ${alignClass}`}>{txn.businessUnit}</td>;
      
      case 'paymentMethod':
        return <td key={column.id} className={`px-4 py-3 text-sm text-gray-600 ${alignClass}`}>{txn.paymentMethod}</td>;
      
      case 'costAllocation':
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}>
            <span className={`text-xs px-2 py-1 rounded ${txn.costAllocation === 'direct' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
              {txn.costAllocation === 'direct' ? 'Trực tiếp' : 'Gián tiếp'}
            </span>
          </td>
        );
      
      case 'attachments':
        return (
          <td key={column.id} className={`px-4 py-3 text-center ${alignClass}`}>
            {txn.attachments > 0 && (
              <span className="inline-flex items-center gap-1 text-gray-600">
                <Paperclip className="w-4 h-4" />
                <span className="text-xs">{txn.attachments}</span>
              </span>
            )}
          </td>
        );
      
      case 'paymentStatus':
        const paymentBadge = getPaymentStatusBadge(txn.paymentStatus);
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge.color}`}>{paymentBadge.label}</span>
          </td>
        );
      
      case 'approvalStatus':
        const approvalBadge = getApprovalStatusBadge(txn.approvalStatus);
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap ${alignClass}`}>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${approvalBadge.color}`}>{approvalBadge.label}</span>
          </td>
        );
      
      case 'actions':
        return (
          <td key={column.id} className={`px-4 py-3 whitespace-nowrap text-center ${alignClass}`}>
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => handleView(txn)}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Xem"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(txn)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={canEdit(txn) ? 'Sửa' : 'Không thể sửa'}
                disabled={!canEdit(txn)}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(txn)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={canDelete(txn) ? 'Xóa' : 'Không thể xóa'}
                disabled={!canDelete(txn)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        );
      
      default:
        return <td key={column.id} className={`px-4 py-3 ${alignClass}`}>-</td>;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QUẢN LÝ THU - CHI - VAY</h1>
          <p className="text-gray-600">Quản lý giao dịch tài chính và phê duyệt thanh toán</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Tổng Thu */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Tổng Thu</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.totalIncome)}</p>
            </div>
          </div>
          <div className="text-xs opacity-75">Đã phê duyệt</div>
        </div>

        {/* Tổng Chi */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Tổng Chi</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.totalExpense)}</p>
            </div>
          </div>
          <div className="text-xs opacity-75">Đã phê duyệt</div>
        </div>

        {/* Số dư hiện tại */}
        <div className={`bg-gradient-to-br ${kpis.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl shadow-lg p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Số dư hiện tại</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.balance)}</p>
            </div>
          </div>
          <div className="text-xs opacity-75">Thu - Chi</div>
        </div>

        {/* Tổng nợ vay */}
        <div className="bg-gradient-to-br from-[#F7931E] to-[#E8860D] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Tổng nợ vay</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.totalLoan)}</p>
            </div>
          </div>
          <div className="text-xs opacity-75">Chưa thanh toán</div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Bộ lọc</h3>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showFilterPanel ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {showFilterPanel && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Mã GD, Đối tượng, Danh mục, Dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={filterTimeRange}
                  onChange={(e) => setFilterTimeRange(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
                >
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>

                <select
                  value={filterBU}
                  onChange={(e) => setFilterBU(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
                >
                  <option value="all">Tất cả BU</option>
                  {buList.map(bu => (
                    <option key={bu} value={bu}>{bu}</option>
                  ))}
                </select>

                <select
                  value={filterApprovalStatus}
                  onChange={(e) => setFilterApprovalStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="draft">Nháp</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>

                <button
                  onClick={handleClearFilter}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            {filterTimeRange === 'custom' && (
              <div className="flex gap-4 items-center bg-blue-50 border border-blue-200 rounded-lg p-4">
                <span className="text-sm font-semibold text-blue-900">Khoảng thời gian:</span>
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={customStartDate}
                    onChange={setCustomStartDate}
                  />
                  <span className="text-gray-600">-</span>
                  <DatePicker
                    value={customEndDate}
                    onChange={setCustomEndDate}
                  />
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={resetColumns}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors shadow-sm"
                title="Đặt lại thứ tự cột về mặc định"
              >
                <RotateCcw className="w-4 h-4" />
                Đặt lại cột
              </button>
              <button
                onClick={() => handleCreate('income')}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tạo Phiếu Thu
              </button>
              <button
                onClick={() => handleCreate('expense')}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tạo Phiếu Chi
              </button>
              <button
                onClick={() => handleCreate('loan')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F7931E] hover:bg-[#E8860D] text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tạo Phiếu Vay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium mb-1">💡 Tùy chỉnh hiển thị cột</p>
            <p className="text-sm text-blue-700">
              Kéo biểu tượng <GripVertical className="w-3 h-3 inline" /> bên cạnh tên cột để sắp xếp lại theo thói quen sử dụng của bạn. 
              Hệ thống sẽ tự động lưu cấu hình hiển thị cho tài khoản của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Transaction Type Filter Buttons */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTransactionType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterTransactionType === 'all'
                  ? 'bg-[#1E6BB8] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterTransactionType('income')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterTransactionType === 'income'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Thu
            </button>
            <button
              onClick={() => setFilterTransactionType('expense')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterTransactionType === 'expense'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chi
            </button>
            <button
              onClick={() => setFilterTransactionType('loan')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterTransactionType === 'loan'
                  ? 'bg-[#F7931E] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vay
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.filter(c => c.visible).map((column, index) => (
                  <DraggableColumnHeader key={column.id} column={column} index={index} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  {columns.filter(c => c.visible).map((column) => renderCell(column, txn))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy giao dịch nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, sortedTransactions.length)}</span> trong tổng số <span className="font-semibold">{sortedTransactions.length}</span> giao dịch
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

      {/* Create/View/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {modalMode === 'create' && `Tạo Phiếu ${getTransactionTypeLabel(modalType)} Mới`}
                    {modalMode === 'view' && `Chi Tiết Phiếu ${getTransactionTypeLabel(modalType)}`}
                    {modalMode === 'edit' && `Chỉnh Sửa Phiếu ${getTransactionTypeLabel(modalType)}`}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isReadOnly ? 'Thông tin chi tiết giao dịch' : 'Vui lòng điền đầy đủ thông tin bắt buộc (*)'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalMode(null);
                    setUploadedFiles([]);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <form onSubmit={handleSubmit} id="transaction-form">
                <div className="space-y-6">
                  {/* Thông tin giao dịch */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                      Thông tin giao dịch
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mã Giao Dịch (Auto)
                        </label>
                        <input
                          type="text"
                          value={formData.transactionCode}
                          disabled
                          className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="text-red-500">*</span> Ngày Giao Dịch
                        </label>
                        <DatePicker
                          value={formData.transactionDate || ''}
                          onChange={(date) => setFormData({ ...formData, transactionDate: date })}
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="text-red-500">*</span> Danh Mục
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">Chọn danh mục...</option>
                          {getCategoryOptions().map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          Dự Án
                        </label>
                        <select
                          value={formData.project || ''}
                          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Không chọn dự án</option>
                          {projectList.map(proj => (
                            <option key={proj.code} value={proj.code}>{getProjectName(proj.code)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-red-500">*</span> Business Unit
                        </label>
                        <select
                          value={formData.businessUnit}
                          onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
                          disabled={isReadOnly || formData.costAllocation === 'indirect'}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">Chọn BU...</option>
                          {buList.map(bu => (
                            <option key={bu} value={bu}>{bu}</option>
                          ))}
                        </select>
                        {formData.costAllocation === 'indirect' && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⓘ BU sẽ được phân bổ tự động theo quy tắc
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Đối tượng giao dịch */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                      Đối tượng giao dịch
                    </h3>
                    <div className="mb-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="partner"
                            checked={formData.objectType === 'partner'}
                            onChange={(e) => setFormData({ ...formData, objectType: e.target.value as any, objectName: '' })}
                            disabled={isReadOnly}
                            className="w-4 h-4 text-[#1E6BB8]"
                          />
                          <span className="text-sm font-medium text-gray-700">Đối tác</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="employee"
                            checked={formData.objectType === 'employee'}
                            onChange={(e) => setFormData({ ...formData, objectType: e.target.value as any, objectName: '' })}
                            disabled={isReadOnly}
                            className="w-4 h-4 text-[#1E6BB8]"
                          />
                          <span className="text-sm font-medium text-gray-700">Nhân viên</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="text-red-500">*</span> {formData.objectType === 'partner' ? 'Đối tác' : 'Nhân viên'}
                        </label>
                        <select
                          value={formData.objectName}
                          onChange={(e) => setFormData({ ...formData, objectName: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">Chọn...</option>
                          {(formData.objectType === 'partner' ? partnerList : employeeList).map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="text-red-500">*</span> Phương Thức Thanh Toán
                        </label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="Chuyển khoản">Chuyển khoản</option>
                          <option value="Tiền mặt">Tiền mặt</option>
                          <option value="Séc">Séc</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Số tiền và phân bổ */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                      Số tiền và phân bổ chi phí
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-red-500">*</span> Số Tiền (VND)
                        </label>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => {
                            const amount = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, amount });
                            if (formData.costAllocation === 'indirect' && formData.allocationRule) {
                              handleAllocationRuleChange(formData.allocationRule);
                            }
                          }}
                          placeholder="0"
                          min="1"
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        />
                        {formData.amount && formData.amount > 0 && (
                          <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.amount)}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="text-red-500">*</span> Phân Bổ Chi Phí
                        </label>
                        <select
                          value={formData.costAllocation}
                          onChange={(e) => setFormData({ ...formData, costAllocation: e.target.value as any, allocationRule: '', allocationPreview: [] })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="direct">Trực tiếp</option>
                          <option value="indirect">Gián tiếp</option>
                        </select>
                      </div>
                    </div>

                    {formData.costAllocation === 'indirect' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="text-red-500">*</span> Quy Tắc Phân Bổ
                          </label>
                          <select
                            value={formData.allocationRule}
                            onChange={(e) => handleAllocationRuleChange(e.target.value)}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          >
                            <option value="">Chọn quy tắc...</option>
                            {allocationRules.map(rule => (
                              <option key={rule} value={rule}>{rule}</option>
                            ))}
                          </select>
                        </div>

                        {formData.allocationPreview && formData.allocationPreview.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3">Preview Phân Bổ</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-blue-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-blue-900">BU</th>
                                    <th className="px-3 py-2 text-right font-semibold text-blue-900">Tỷ Lệ</th>
                                    <th className="px-3 py-2 text-right font-semibold text-blue-900">Số Tiền</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-200">
                                  {formData.allocationPreview.map((alloc) => (
                                    <tr key={alloc.bu}>
                                      <td className="px-3 py-2 text-gray-900">{alloc.bu}</td>
                                      <td className="px-3 py-2 text-right text-gray-700">{alloc.percentage}%</td>
                                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{formatCurrency(alloc.amount)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hợp đồng đính kèm */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
                      Hợp đồng đính kèm
                    </h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload hình ảnh chứng từ
                      </label>
                      {!isReadOnly ? (
                        <div>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1E6BB8] transition-colors cursor-pointer">
                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                              <Upload className="w-12 h-12 text-gray-400 mb-2" />
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Click để upload hoặc kéo thả file
                              </p>
                              <p className="text-xs text-gray-500">
                                Hỗ trợ: JPG, PNG, PDF (Tối đa 10MB)
                              </p>
                            </label>
                          </div>
                          
                          {/* File List */}
                          {uploadedFiles && uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-semibold text-gray-700">File đã chọn ({uploadedFiles.length}):</p>
                              {uploadedFiles.map((file) => (
                                <div key={file.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-center gap-3 flex-1">
                                    {file.type.startsWith('image/') ? (
                                      <ImageIcon className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <FileText className="w-5 h-5 text-green-600" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(file.id)}
                                    className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {uploadedFiles && uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center gap-3 flex-1">
                                  {file.type.startsWith('image/') ? (
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-gray-600" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 p-1.5 text-[#1E6BB8] hover:bg-blue-50 rounded transition-colors"
                                  title="Xem file"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <Paperclip className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Không có file đính kèm</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô Tả / Ghi Chú
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Nhập mô tả chi tiết..."
                      rows={3}
                      disabled={isReadOnly}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    />
                  </div>

                  {/* Show rejection reason */}
                  {selectedTransaction?.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-900 mb-1">Lý do từ chối:</p>
                      <p className="text-sm text-red-700">{selectedTransaction.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer với các nút theo trạng thái */}
            <div className="border-t border-gray-200 px-6 py-4">
              {/* Phiếu NHÁP hoặc TẠO MỚI - Hiển thị nút Lưu Nháp & Gửi Duyệt */}
              {(modalMode === 'create' || (modalMode === 'edit' && formData.approvalStatus === 'draft')) && !isReadOnly && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setUploadedFiles([]);
                    }}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    form="transaction-form"
                    className="flex items-center gap-2 px-8 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <Save className="w-4 h-4" />
                    Lưu nháp
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitForApproval}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <Send className="w-4 h-4" />
                    Gửi duyệt
                  </button>
                </div>
              )}

              {/* Phiếu CHỜ DUYỆT - Hiển thị nút Phê duyệt & Từ chối */}
              {modalMode === 'view' && formData.approvalStatus === 'pending' && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setUploadedFiles([]);
                    }}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedTransaction && handleReject(selectedTransaction)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedTransaction && handleApprove(selectedTransaction)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              )}

              {/* Phiếu ĐÃ DUYỆT - Hiển thị nút In phiếu */}
              {modalMode === 'view' && formData.approvalStatus === 'approved' && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setUploadedFiles([]);
                    }}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <Printer className="w-4 h-4" />
                    In phiếu
                  </button>
                </div>
              )}

              {/* Phiếu ĐÃ TỪ CHỐI - Chỉ hiển thị nút Đóng */}
              {modalMode === 'view' && formData.approvalStatus === 'rejected' && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setUploadedFiles([]);
                    }}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* Chế độ EDIT cho phiếu bị TỪ CHỐI */}
              {modalMode === 'edit' && formData.approvalStatus === 'rejected' && !isReadOnly && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setUploadedFiles([]);
                    }}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[140px]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    form="transaction-form"
                    className="flex items-center gap-2 px-8 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitForApproval}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
                  >
                    <Send className="w-4 h-4" />
                    Gửi lại duyệt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingTransaction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa giao dịch</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa giao dịch này?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mã GD:</span> {deletingTransaction.transactionCode}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Loại:</span> {getTransactionTypeLabel(deletingTransaction.transactionType)}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Số tiền:</span> {formatCurrency(deletingTransaction.amount)}
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
    </DndProvider>
  );
}
