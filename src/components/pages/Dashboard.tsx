import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Eye, X, ChartBar as BarChart3, ListFilter as Filter, Calendar, RefreshCw } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { dashboardAPI } from '../../services/supabaseApi';

export function Dashboard() {
  const { selectedBU, canSelectBU, currentUser } = useApp();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load real data from database
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const result = await dashboardAPI.getData();
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Process transactions from database into BU performance data
  const processBUDataFromTransactions = (transactions: any[]): any[] => {
    const buMap: { [key: string]: { incomeTransactions: any[], expenseTransactions: any[] } } = {};

    // Group transactions by business unit
    transactions.forEach((txn: any) => {
      const bu = txn.business_unit || 'Không phân bổ';
      if (!buMap[bu]) {
        buMap[bu] = { incomeTransactions: [], expenseTransactions: [] };
      }

      const transactionData = {
        code: txn.transaction_code,
        date: new Date(txn.transaction_date).toLocaleDateString('vi-VN'),
        category: txn.category,
        amount: Number(txn.amount),
        description: txn.description || '-'
      };

      if (txn.type === 'income') {
        buMap[bu].incomeTransactions.push(transactionData);
      } else if (txn.type === 'expense') {
        buMap[bu].expenseTransactions.push(transactionData);
      }
    });

    // Convert to array format
    return Object.entries(buMap).map(([buName, data], index) => ({
      id: (index + 1).toString(),
      bu: buName,
      incomeTransactions: data.incomeTransactions,
      expenseTransactions: data.expenseTransactions
    }));
  };
  
  const [selectedBUForModal, setSelectedBUForModal] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterTimeRange, setFilterTimeRange] = useState<string>('year');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Helper function to parse date string DD/MM/YYYY or D/M/YYYY
  const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('/');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  // Get date range based on filter
  const getDateRange = (): { start: Date; end: Date } => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    switch (filterTimeRange) {
      case 'month': {
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0)
        };
      }
      case 'quarter': {
        const quarterMonth = Math.floor(currentMonth / 3) * 3;
        return {
          start: new Date(currentYear, quarterMonth, 1),
          end: new Date(currentYear, quarterMonth + 3, 0)
        };
      }
      case 'year': {
        return {
          start: new Date(currentYear, 0, 1),
          end: new Date(currentYear, 11, 31)
        };
      }
      case 'custom': {
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate)
          };
        }
        // Default to current month if custom dates not set
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0)
        };
      }
      default:
        return {
          start: new Date(currentYear, 0, 1),
          end: new Date(currentYear, 11, 31)
        };
    }
  };

  const dateRange = getDateRange();

  // BU Performance Data from database
  const buPerformanceData = useMemo(() => {
    if (!dashboardData?.transactions) return [];
    return processBUDataFromTransactions(dashboardData.transactions);
  }, [dashboardData]);

  // Fallback BU Performance Data with detailed transactions (for demo purposes if no DB data)
  const fallbackBuPerformanceData = [
    {
      id: '1',
      bu: 'BlueBolt Services',
      incomeTransactions: [
        { code: 'PT000001', date: '2/1/2026', category: 'Doanh thu thực thu', amount: 60000000, description: 'Các khoản thu trước 31/12/2025 còn lại qua 2026' }
      ],
      expenseTransactions: [
        { code: 'PC000002', date: '5/1/2026', category: 'Lương, thưởng, phụ cấp', amount: 57525000, description: '-' },
        { code: 'PC000005', date: '5/1/2026', category: 'Dịch vụ tư vấn, kế toán', amount: 3500000, description: '-' },
        { code: 'PC000003', date: '5/1/2026', category: 'Bảo hiểm xã hội', amount: 3300250, description: '-' },
        { code: 'PC000004', date: '5/1/2026', category: 'Chi phí văn phòng', amount: 20000000, description: '-' },
        { code: 'PC000006', date: '6/1/2026', category: 'Chi phí marketing', amount: 2500000, description: '-' },
        { code: 'PC000007', date: '8/1/2026', category: 'Chi phí khác', amount: 800000, description: '-' }
      ]
    },
    {
      id: '2',
      bu: 'BlueBolt Software',
      incomeTransactions: [
        { code: 'T0125_01', date: '15/1/2025', category: 'Doanh thu dịch vụ', amount: 50000000, description: 'Hợp đồng Q1/2025' },
        { code: 'T0226_01', date: '5/2/2026', category: 'Doanh thu dự án', amount: 80000000, description: 'Project A - Milestone 1' },
        { code: 'T0326_02', date: '12/3/2026', category: 'Doanh thu bảo hành', amount: 30000000, description: 'Support Package' },
        { code: 'T0426_03', date: '20/4/2026', category: 'Doanh thu dự án', amount: 75000000, description: 'Project B' },
        { code: 'T0526_04', date: '10/5/2026', category: 'Doanh thu dịch vụ', amount: 60000000, description: 'Maintenance' },
        { code: 'T0626_05', date: '15/6/2026', category: 'Doanh thu dự án', amount: 90000000, description: 'Project C' },
        { code: 'T0726_06', date: '8/7/2026', category: 'Doanh thu dịch vụ', amount: 45000000, description: 'Consulting' },
        { code: 'T0826_07', date: '22/8/2026', category: 'Doanh thu dự án', amount: 85000000, description: 'Project D' },
        { code: 'T0926_08', date: '5/9/2026', category: 'Doanh thu dịch vụ', amount: 55000000, description: 'Support' },
        { code: 'T1026_09', date: '18/10/2026', category: 'Doanh thu dự án', amount: 95000000, description: 'Project E' },
        { code: 'T1126_10', date: '12/11/2026', category: 'Doanh thu dịch vụ', amount: 65000000, description: 'Training' },
        { code: 'T1226_11', date: '28/12/2026', category: 'Doanh thu dự án', amount: 100000000, description: 'Project F' }
      ],
      expenseTransactions: [
        { code: 'C0125_05', date: '20/1/2025', category: 'Chi phí nhân sự', amount: 30000000, description: 'Lương tháng 1/2025' },
        { code: 'C0226_03', date: '15/2/2026', category: 'Chi phí vận hành', amount: 15000000, description: 'Server & Infrastructure' },
        { code: 'C0326_04', date: '20/3/2026', category: 'Chi phí marketing', amount: 8000000, description: 'Digital Ads Campaign' },
        { code: 'C0426_05', date: '18/4/2026', category: 'Chi phí nhân sự', amount: 32000000, description: 'Lương tháng 4' },
        { code: 'C0526_06', date: '22/5/2026', category: 'Chi phí vận hành', amount: 18000000, description: 'Cloud Services' },
        { code: 'C0626_07', date: '10/6/2026', category: 'Chi phí marketing', amount: 12000000, description: 'SEO Campaign' },
        { code: 'C0726_08', date: '15/7/2026', category: 'Chi phí nhân sự', amount: 35000000, description: 'Lương tháng 7' },
        { code: 'C0826_09', date: '20/8/2026', category: 'Chi phí vận hành', amount: 20000000, description: 'Software Licenses' },
        { code: 'C0926_10', date: '12/9/2026', category: 'Chi phí marketing', amount: 10000000, description: 'Social Media' },
        { code: 'C1026_11', date: '25/10/2026', category: 'Chi phí nhân sự', amount: 38000000, description: 'Lương tháng 10' },
        { code: 'C1126_12', date: '18/11/2026', category: 'Chi phí vận hành', amount: 22000000, description: 'Security' },
        { code: 'C1226_13', date: '30/12/2026', category: 'Chi phí marketing', amount: 15000000, description: 'Year-end Campaign' }
      ]
    },
    {
      id: '3',
      bu: 'BlueBolt Academy',
      incomeTransactions: [
        { code: 'T0125_02', date: '18/1/2025', category: 'Doanh thu đào tạo', amount: 30000000, description: 'Khóa học tháng 1' },
        { code: 'T0226_05', date: '22/2/2026', category: 'Doanh thu workshop', amount: 15000000, description: 'Workshop doanh nghiệp' },
        { code: 'T0326_06', date: '15/3/2026', category: 'Doanh thu đào tạo', amount: 35000000, description: 'Khóa học tháng 3' },
        { code: 'T0526_07', date: '20/5/2026', category: 'Doanh thu workshop', amount: 20000000, description: 'Workshop Q2' },
        { code: 'T0726_08', date: '12/7/2026', category: 'Doanh thu đào tạo', amount: 40000000, description: 'Khóa học hè' },
        { code: 'T0926_09', date: '18/9/2026', category: 'Doanh thu workshop', amount: 25000000, description: 'Workshop Q3' },
        { code: 'T1126_10', date: '22/11/2026', category: 'Doanh thu đào tạo', amount: 45000000, description: 'Khóa học cuối năm' }
      ],
      expenseTransactions: [
        { code: 'C0125_03', date: '22/1/2025', category: 'Chi phí giảng viên', amount: 15000000, description: 'Thù lao giảng viên' },
        { code: 'C0226_06', date: '25/2/2026', category: 'Chi phí vật tư', amount: 5000000, description: 'Tài liệu học viên' },
        { code: 'C0326_07', date: '18/3/2026', category: 'Chi phí giảng viên', amount: 18000000, description: 'Thù lao Q1' },
        { code: 'C0526_08', date: '25/5/2026', category: 'Chi phí vật tư', amount: 8000000, description: 'Thiết bị đào tạo' },
        { code: 'C0726_09', date: '15/7/2026', category: 'Chi phí giảng viên', amount: 22000000, description: 'Thù lao giảng viên hè' },
        { code: 'C0926_10', date: '20/9/2026', category: 'Chi phí vật tư', amount: 10000000, description: 'Tài liệu Q3' },
        { code: 'C1126_11', date: '28/11/2026', category: 'Chi phí giảng viên', amount: 25000000, description: 'Thù lao cuối năm' }
      ]
    },
    {
      id: '4',
      bu: 'BlueBolt R&D',
      incomeTransactions: [
        { code: 'T0326_03', date: '18/3/2026', category: 'Doanh thu nghiên cứu', amount: 40000000, description: 'Hợp đồng R&D' },
        { code: 'T0626_04', date: '22/6/2026', category: 'Doanh thu nghiên cứu', amount: 35000000, description: 'Research Project Q2' },
        { code: 'T0926_05', date: '15/9/2026', category: 'Doanh thu nghiên cứu', amount: 45000000, description: 'Innovation Project' }
      ],
      expenseTransactions: [
        { code: 'C0226_01', date: '10/2/2026', category: 'Chi phí nghiên cứu', amount: 20000000, description: 'Lab equipment' },
        { code: 'V0326_01', date: '15/3/2026', category: 'Tạm ứng nhân viên', amount: 15000000, description: 'Tạm ứng cho dự án' },
        { code: 'C0626_02', date: '20/6/2026', category: 'Chi phí nghiên cứu', amount: 18000000, description: 'Research Materials' },
        { code: 'C0926_03', date: '25/9/2026', category: 'Chi phí nghiên cứu', amount: 22000000, description: 'Innovation Lab' }
      ]
    },
    {
      id: '5',
      bu: 'BlueBolt G&A',
      incomeTransactions: [
        { code: 'T0125_04', date: '25/1/2025', category: 'Doanh thu khác', amount: 20000000, description: 'Thu nhập phụ' },
        { code: 'T0426_05', date: '15/4/2026', category: 'Doanh thu khác', amount: 15000000, description: 'Thu nhập Q2' },
        { code: 'T0726_06', date: '20/7/2026', category: 'Doanh thu khác', amount: 18000000, description: 'Thu nhập Q3' },
        { code: 'T1026_07', date: '25/10/2026', category: 'Doanh thu khác', amount: 22000000, description: 'Thu nhập Q4' }
      ],
      expenseTransactions: [
        { code: 'C0125_01', date: '16/1/2025', category: 'Chi phí văn phòng', amount: 5000000, description: 'Văn phòng phẩm' },
        { code: 'C0125_02', date: '19/1/2025', category: 'Chi phí marketing', amount: 15000000, description: 'Brand campaign' },
        { code: 'C0426_03', date: '20/4/2026', category: 'Chi phí văn phòng', amount: 6000000, description: 'Office Supplies' },
        { code: 'C0726_04', date: '22/7/2026', category: 'Chi phí marketing', amount: 12000000, description: 'Marketing Q3' },
        { code: 'C1026_05', date: '28/10/2026', category: 'Chi phí văn phòng', amount: 7000000, description: 'Office Equipment' }
      ]
    }
  ];

  // Filter transactions based on date range
  const filterTransactionsByDate = (transactions: any[], dateRange: { start: Date; end: Date }) => {
    return transactions.filter(txn => {
      const txnDate = parseDate(txn.date);
      return txnDate >= dateRange.start && txnDate <= dateRange.end;
    });
  };

  // Filter BU data based on selected BU and date range
  const filteredBUData = useMemo(() => {
    const buFiltered = selectedBU === 'all' 
      ? buPerformanceData 
      : buPerformanceData.filter(bu => bu.bu === selectedBU);

    // Filter transactions by date and calculate totals
    return buFiltered.map(bu => {
      const filteredIncome = filterTransactionsByDate(bu.incomeTransactions, dateRange);
      const filteredExpense = filterTransactionsByDate(bu.expenseTransactions, dateRange);
      
      const totalRevenue = filteredIncome.reduce((sum, txn) => sum + txn.amount, 0);
      const totalExpense = filteredExpense.reduce((sum, txn) => sum + txn.amount, 0);
      const profit = totalRevenue - totalExpense;
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      return {
        ...bu,
        totalRevenue,
        totalExpense,
        profit,
        margin,
        incomeTransactions: filteredIncome,
        expenseTransactions: filteredExpense
      };
    });
  }, [selectedBU, dateRange.start, dateRange.end]);

  // Calculate totals based on filtered data
  const totalRevenue = filteredBUData.reduce((sum, bu) => sum + bu.totalRevenue, 0);
  const totalExpense = filteredBUData.reduce((sum, bu) => sum + bu.totalExpense, 0);
  const totalProfit = filteredBUData.reduce((sum, bu) => sum + bu.profit, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Update KPI Data dynamically based on filtered data
  const kpiData = [
    {
      title: 'Tổng Doanh thu',
      value: (totalRevenue / 1000000000).toFixed(2),
      unit: 'Tỷ VND',
      change: '12% so với kỳ trước',
      trend: 'up',
      icon: BarChart3,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Tổng Chi phí',
      value: (totalExpense / 1000000000).toFixed(2),
      unit: 'Tỷ VND',
      change: '5% so với kỳ trước',
      trend: 'up',
      icon: TrendingDown,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Lợi nhuận thuần (P&L)',
      value: (totalProfit / 1000000000).toFixed(2),
      unit: 'Tỷ VND',
      change: `↗ 18% so với k��� trước`,
      trend: totalProfit >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      bgColor: totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: 'text-gray-800',
      iconBg: totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100',
      iconColor: totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Tỷ lệ lợi nhuận',
      value: profitMargin.toFixed(1),
      unit: '%',
      change: '',
      trend: 'neutral',
      icon: Percent,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  // Generate cash flow data based on time range
  const cashFlowData = useMemo(() => {
    const monthlyData: { [key: string]: { thu: number; chi: number; loiNhuan: number } } = {};

    // Initialize all months in the date range
    const current = new Date(dateRange.start);
    while (current <= dateRange.end) {
      const monthKey = `${current.getMonth() + 1}/${current.getFullYear()}`;
      monthlyData[monthKey] = { thu: 0, chi: 0, loiNhuan: 0 };
      current.setMonth(current.getMonth() + 1);
    }

    // Aggregate transactions by month
    filteredBUData.forEach(bu => {
      bu.incomeTransactions.forEach(txn => {
        const txnDate = parseDate(txn.date);
        const monthKey = `${txnDate.getMonth() + 1}/${txnDate.getFullYear()}`;
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].thu += txn.amount;
        }
      });

      bu.expenseTransactions.forEach(txn => {
        const txnDate = parseDate(txn.date);
        const monthKey = `${txnDate.getMonth() + 1}/${txnDate.getFullYear()}`;
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].chi += txn.amount;
        }
      });
    });

    // Convert to array and calculate profit
    const result = Object.entries(monthlyData).map(([key, data]) => {
      const [month, year] = key.split('/');
      const monthName = filterTimeRange === 'year' 
        ? `T${month}/${year.slice(2)}` 
        : `${month}/${year}`;
      
      return {
        month: monthName,
        thu: data.thu,
        chi: data.chi,
        loiNhuan: data.thu - data.chi
      };
    });

    return result;
  }, [filteredBUData, dateRange.start, dateRange.end, filterTimeRange]);

  // Expense by Category (Donut Chart) - calculated from filtered data
  const expenseByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    filteredBUData.forEach(bu => {
      bu.expenseTransactions.forEach(txn => {
        const category = txn.category;
        categories[category] = (categories[category] || 0) + txn.amount;
      });
    });

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 categories
  }, [filteredBUData]);

  const DONUT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(Math.abs(value)) + ' ₫';
  };

  // Format short currency for charts
  const formatShortCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  // Handle view BU detail
  const handleViewBUDetail = (bu: typeof filteredBUData[0]) => {
    setSelectedBUForModal(bu.bu);
    setShowDetailModal(true);
  };

  const selectedBUData = filteredBUData.find(b => b.bu === selectedBUForModal);

  // Get time range display text
  const getTimeRangeText = () => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    
    switch (filterTimeRange) {
      case 'month': {
        const currentMonth = new Date().getMonth();
        return `${months[currentMonth]} ${new Date().getFullYear()}`;
      }
      case 'quarter': {
        const currentMonth = new Date().getMonth();
        const quarter = Math.floor(currentMonth / 3) + 1;
        return `Quý ${quarter}/${new Date().getFullYear()}`;
      }
      case 'year': {
        return `Năm ${new Date().getFullYear()}`;
      }
      case 'custom': {
        if (customStartDate && customEndDate) {
          return `${new Date(customStartDate).toLocaleDateString('vi-VN')} - ${new Date(customEndDate).toLocaleDateString('vi-VN')}`;
        }
        return 'Tùy chỉnh';
      }
      default:
        return `Năm ${new Date().getFullYear()}`;
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Tài Chính</h1>
        <p className="text-gray-600">
          Tổng quan hiệu suất tài chính và báo cáo theo Business Unit
          {!canSelectBU && selectedBU !== 'all' && (
            <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              Đang xem: {selectedBU}
            </span>
          )}
        </p>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Bộ lọc:</span>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={filterTimeRange}
              onChange={(e) => setFilterTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            >
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {/* Custom Date Range Input */}
          {filterTimeRange === 'custom' && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-700">Từ:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white text-sm"
              />
              <span className="text-sm font-medium text-blue-700">Đến:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent bg-white text-sm"
              />
            </div>
          )}

          {/* Display current filter */}
          <div className="ml-auto flex items-center gap-2 bg-[#1E6BB8] text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">📅 {getTimeRangeText()}</span>
          </div>
        </div>

        {/* BU Filter Info */}
        <div className="mt-4">
          {!canSelectBU ? (
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 inline-flex">
              <span className="text-sm text-orange-700">
                📊 Bạn đang xem dữ liệu của <strong>{selectedBU}</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 inline-flex">
              <span className="text-sm text-blue-700">
                💡 Thay đổi BU ở <strong>thanh điều hướng phía trên</strong>
                {selectedBU === 'all' && ' (Đang xem: Tất cả BU)'}
                {selectedBU !== 'all' && ` (Đang xem: ${selectedBU})`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={index}
              className={`${kpi.bgColor} rounded-xl shadow-md p-6 border border-gray-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-3xl font-bold ${kpi.textColor}`}>
                      {kpi.value}
                    </h3>
                    <span className="text-sm text-gray-500">{kpi.unit}</span>
                  </div>
                </div>
                <div className={`${kpi.iconBg} p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
              </div>
              
              {kpi.change && (
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                  <p className="text-xs text-green-600">{kpi.change}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Cash Flow Trend - Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Xu hướng Dòng tiền</h2>
            <p className="text-sm text-gray-600">Theo dõi thu chi và lợi nhuận theo {filterTimeRange === 'year' ? 'tháng' : 'kỳ'}</p>
          </div>
          
          {cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  stroke="#9CA3AF"
                  tickFormatter={(value) => formatShortCurrency(value)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="thu" 
                  name="Tổng Thu"
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="chi" 
                  name="Tổng Chi"
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="loiNhuan" 
                  name="Lợi nhuận"
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Không có dữ liệu trong khoảng thời gian này</p>
              </div>
            </div>
          )}
        </div>

        {/* Expense by Category - Donut Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Cơ cấu Chi phí</h2>
            <p className="text-sm text-gray-600">Phân bổ theo danh mục</p>
          </div>

          {expenseByCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 space-y-2">
                {expenseByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: DONUT_COLORS[index] }}
                      ></div>
                      <span className="text-gray-700">{category.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{category.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <DollarSign className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Không có dữ liệu chi phí</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BU Performance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Báo cáo Hiệu suất theo BU</h2>
          <p className="text-sm text-gray-600">Tổng quan tài chính từng đơn vị kinh doanh</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Business Unit
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tổng Thu
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tổng Chi
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Lợi nhuận
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Biên lợi nhuận
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBUData.map((bu) => (
                <tr key={bu.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1E6BB8] to-[#155a9e] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                        {bu.bu.split(' ')[1]?.substring(0, 2).toUpperCase() || 'BU'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{bu.bu}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(bu.totalRevenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-red-600">
                      {formatCurrency(bu.totalExpense)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-semibold ${bu.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {bu.profit >= 0 ? '+' : '-'}{formatCurrency(bu.profit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        bu.margin >= 30 ? 'bg-green-100 text-green-700' :
                        bu.margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                        bu.margin >= 0 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {bu.margin >= 0 ? '+' : ''}{bu.margin.toFixed(2)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewBUDetail(bu)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E6BB8] hover:bg-[#155a9e] text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr className="font-bold">
                <td className="px-6 py-4 text-gray-900">TỔNG CỘNG</td>
                <td className="px-6 py-4 text-right text-green-600">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="px-6 py-4 text-right text-red-600">
                  {formatCurrency(totalExpense)}
                </td>
                <td className="px-6 py-4 text-right text-blue-600">
                  {formatCurrency(totalProfit)}
                </td>
                <td className="px-6 py-4 text-right text-gray-900">
                  {profitMargin.toFixed(2)}%
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* BU Detail Modal */}
      {showDetailModal && selectedBUData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch - {selectedBUData.bu}</h2>
                <p className="text-sm text-gray-600 mt-1">Kỳ: {getTimeRangeText()}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <p className="text-lg text-green-700 mb-2 font-medium">Tổng Thu</p>
                <p className="text-4xl font-bold text-green-700">
                  {formatCurrency(selectedBUData.totalRevenue)}
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <p className="text-lg text-red-700 mb-2 font-medium">Tổng Chi</p>
                <p className="text-4xl font-bold text-red-700">
                  {formatCurrency(selectedBUData.totalExpense)}
                </p>
              </div>
            </div>

            {/* Transactions Lists */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* Income Transactions Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Giao dịch Thu ({selectedBUData.incomeTransactions.length})
                  </h3>
                </div>

                {selectedBUData.incomeTransactions.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã GD</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mô tả</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBUData.incomeTransactions.map((txn, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{txn.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{txn.category}</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                              {formatCurrency(txn.amount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{txn.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">Không có giao dịch thu</div>
                )}
              </div>

              {/* Expense Transactions Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Giao dịch Chi ({selectedBUData.expenseTransactions.length})
                  </h3>
                </div>

                {selectedBUData.expenseTransactions.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã GD</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mô tả</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBUData.expenseTransactions.map((txn, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{txn.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{txn.category}</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                              {formatCurrency(txn.amount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{txn.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">Không có giao dịch chi</div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
