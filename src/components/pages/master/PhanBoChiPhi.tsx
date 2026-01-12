import React, { useState } from 'react';
import { Search, Plus, Edit2, Power, X, Check, AlertCircle, Calendar } from 'lucide-react';

interface BUAllocation {
  buName: string;
  percentage: number;
}

interface AllocationRule {
  id: string;
  code: string;
  name: string;
  description: string;
  allocations: BUAllocation[];
  isDefault: boolean;
  status: 'active' | 'inactive';
  effectiveDate: string;
  expiryDate: string | null;
}

export function PhanBoChiPhi() {
  const [rules, setRules] = useState<AllocationRule[]>([
    {
      id: '1',
      code: 'PB_CHUNG',
      name: 'Phân bổ chung',
      description: 'Phân bổ chi phí theo tỷ lệ cố định',
      allocations: [
        { buName: 'BlueBolt G&A', percentage: 17 },
        { buName: 'BlueBolt R&D', percentage: 14 },
        { buName: 'BlueBolt Academy', percentage: 13 },
        { buName: 'BlueBolt Services', percentage: 19 },
        { buName: 'BlueBolt Software', percentage: 37 },
      ],
      isDefault: true,
      status: 'active',
      effectiveDate: '30/12/2025',
      expiryDate: null
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AllocationRule | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivatingRule, setDeactivatingRule] = useState<AllocationRule | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    effectiveDate: '',
    expiryDate: '',
    allocations: [
      { buName: 'BlueBolt G&A', percentage: 0 },
      { buName: 'BlueBolt R&D', percentage: 0 },
      { buName: 'BlueBolt Academy', percentage: 0 },
      { buName: 'BlueBolt Services', percentage: 0 },
      { buName: 'BlueBolt Software', percentage: 0 },
    ]
  });

  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getTotalPercentage = (allocations: BUAllocation[]) => {
    return allocations.reduce((sum, a) => sum + a.percentage, 0);
  };

  const handleAdd = () => {
    setEditingRule(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      effectiveDate: '',
      expiryDate: '',
      allocations: [
        { buName: 'BlueBolt G&A', percentage: 0 },
        { buName: 'BlueBolt R&D', percentage: 0 },
        { buName: 'BlueBolt Academy', percentage: 0 },
        { buName: 'BlueBolt Services', percentage: 0 },
        { buName: 'BlueBolt Software', percentage: 0 },
      ]
    });
    setShowModal(true);
  };

  const handleEdit = (rule: AllocationRule) => {
    setEditingRule(rule);
    setFormData({
      code: rule.code,
      name: rule.name,
      description: rule.description,
      effectiveDate: rule.effectiveDate,
      expiryDate: rule.expiryDate || '',
      allocations: [...rule.allocations]
    });
    setShowModal(true);
  };

  const handleDeactivate = (rule: AllocationRule) => {
    setDeactivatingRule(rule);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = () => {
    if (deactivatingRule) {
      setRules(rules.map(r =>
        r.id === deactivatingRule.id
          ? { ...r, status: 'inactive' }
          : r
      ));
      setShowDeactivateConfirm(false);
      setDeactivatingRule(null);
    }
  };

  const handleActivate = (rule: AllocationRule) => {
    setRules(rules.map(r =>
      r.id === rule.id
        ? { ...r, status: 'active' }
        : r
    ));
  };

  const handlePercentageChange = (index: number, value: number) => {
    const newAllocations = [...formData.allocations];
    newAllocations[index].percentage = value;
    setFormData({ ...formData, allocations: newAllocations });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const total = getTotalPercentage(formData.allocations);
    if (total !== 100) {
      alert(`⚠️ Tổng tỷ lệ phân bổ phải bằng 100%!\nHiện tại: ${total}%`);
      return;
    }
    
    if (editingRule) {
      setRules(rules.map(r =>
        r.id === editingRule.id
          ? { ...r, ...formData, isDefault: editingRule.isDefault }
          : r
      ));
    } else {
      const newRule: AllocationRule = {
        id: Date.now().toString(),
        ...formData,
        isDefault: false,
        status: 'active',
      };
      setRules([...rules, newRule]);
    }
    
    setShowModal(false);
  };

  const formatDescription = (rule: AllocationRule) => {
    const parts = rule.allocations.map(a => `${a.buName.replace('BlueBolt ', '')}: ${a.percentage}%`);
    return `Phân bổ chi phí theo tỷ lệ cố định: ${parts.join(', ')}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quy tắc phân bổ</h1>
          <p className="text-gray-600">Quản lý dữ liệu hệ thống cho quy tắc phân bổ.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm quy tắc mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm quy tắc phân bổ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:bg-white transition-all text-gray-700"
          />
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-6">
        {filteredRules.map((rule) => {
          const total = getTotalPercentage(rule.allocations);
          const isValid = total === 100;

          return (
            <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Rule Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{rule.name}</h2>
                    {rule.isDefault && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">
                        Mặc định
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                      rule.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rule.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {rule.status === 'active' ? (
                      <button
                        onClick={() => handleDeactivate(rule)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Power className="w-4 h-4" />
                        Ngừng hiệu lực
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(rule)}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Power className="w-4 h-4" />
                        Kích hoạt
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-semibold">Code:</span> {rule.code}</p>
                  <p>{formatDescription(rule)}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Từ {rule.effectiveDate}</span>
                    {rule.expiryDate ? (
                      <span>đến {rule.expiryDate}</span>
                    ) : (
                      <a href="#" className="text-[#1E6BB8] hover:underline">Hiệu lực vô thời hạn</a>
                    )}
                  </div>
                </div>
              </div>

              {/* Allocation Details */}
              <div className="p-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Chi tiết phân bổ
                </h3>
                
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {rule.allocations.map((allocation) => (
                    <div key={allocation.buName} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">{allocation.buName}</p>
                      <p className="text-2xl font-bold text-[#1E6BB8]">{allocation.percentage.toFixed(2)}%</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-green-700">Tổng: {total}%</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-semibold text-red-700">
                        Tổng: {total}% (Phải bằng 100%)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Không tìm thấy quy tắc phân bổ nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingRule ? 'Chỉnh Sửa Quy Tắc' : 'Tạo Mới Quy Tắc'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Tổng tỷ lệ phân bổ phải bằng 100%
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
              <form onSubmit={handleSubmit} id="rule-form">
                <div className="space-y-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Mã Quy Tắc
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="PB_CHUNG"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Tên Quy Tắc
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Phân bổ chung"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Mô Tả
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Phân bổ chi phí theo tỷ lệ cố định"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Ngày Hiệu Lực
                      </label>
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        placeholder="30/12/2025"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Ngày Hết Hạn (Tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="Để trống = Vô thời hạn"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Allocations */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
                      Chi Tiết Phân Bổ (Tổng: {getTotalPercentage(formData.allocations)}%)
                    </h3>
                    <div className="space-y-3">
                      {formData.allocations.map((allocation, index) => (
                        <div key={allocation.buName} className="flex items-center gap-4">
                          <label className="flex-1 text-sm font-medium text-gray-700">
                            {allocation.buName}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={allocation.percentage}
                              onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              max="100"
                              className="w-32 px-4 py-2 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                              required
                            />
                            <span className="text-sm font-medium text-gray-600">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getTotalPercentage(formData.allocations) === 100 ? (
                          <>
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              Tổng: {getTotalPercentage(formData.allocations).toFixed(2)}% ✓
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-semibold text-red-700">
                              Tổng: {getTotalPercentage(formData.allocations).toFixed(2)}% (Phải bằng 100%)
                            </span>
                          </>
                        )}
                      </div>
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
                form="rule-form"
                className="px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
              >
                {editingRule ? 'Xác nhận cập nhật' : 'Xác nhận tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && deactivatingRule && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Power className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Ngừng hiệu lực</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn ngừng quy tắc này?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Quy tắc:</span> {deactivatingRule.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Code:</span> {deactivatingRule.code}
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
                  className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
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
