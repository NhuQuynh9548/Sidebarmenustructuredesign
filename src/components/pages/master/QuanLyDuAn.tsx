import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Briefcase, X, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { projectsAPI } from '../../../services/supabaseApi';

interface Project {
  id: string;
  code: string;
  name: string;
  bu_owner?: string;
  buOwner?: string;
  pm?: string;
  project_manager?: string;
  budget: number;
  spent?: number;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  status: 'ongoing' | 'paused' | 'completed' | 'closed';
}

export function QuanLyDuAn() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBU, setFilterBU] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    bu_owner: '',
    project_manager: '',
    budget: 0,
    start_date: '',
    end_date: '',
    status: 'ongoing' as 'ongoing' | 'paused' | 'completed' | 'closed',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await projectsAPI.getAll();
      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        console.error('Failed to load projects:', result.error);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const buList = ['BlueBolt Software', 'BlueBolt Services', 'BlueBolt R&D', 'BlueBolt Academy', 'BlueBolt G&A'];

  const filteredProjects = projects.filter(project => {
    const pm = project.project_manager || project.pm || '';
    const buOwner = project.bu_owner || project.buOwner || '';

    const matchesSearch =
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pm.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBU = filterBU === 'all' || buOwner === filterBU;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;

    return matchesSearch && matchesBU && matchesStatus;
  });

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      code: '',
      name: '',
      bu_owner: '',
      project_manager: '',
      budget: 0,
      start_date: '',
      end_date: '',
      status: 'ongoing',
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      code: project.code,
      name: project.name,
      bu_owner: project.bu_owner || project.buOwner || '',
      project_manager: project.project_manager || project.pm || '',
      budget: project.budget,
      start_date: project.start_date || project.startDate || '',
      end_date: project.end_date || project.endDate || '',
      status: project.status,
    });
    setShowModal(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingProject) {
      if ((deletingProject.spent || 0) > 0) {
        alert(`Không thể xóa dự án "${deletingProject.name}" vì đã có chi phí phát sinh!`);
        setShowDeleteConfirm(false);
        setDeletingProject(null);
        return;
      }

      try {
        const result = await projectsAPI.delete(deletingProject.id);
        if (result.success) {
          await loadData();
        } else {
          alert('Lỗi khi xóa: ' + result.error);
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Lỗi khi xóa dự án');
      }
      setShowDeleteConfirm(false);
      setDeletingProject(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProject) {
        const result = await projectsAPI.update(editingProject.id, formData);
        if (result.success) {
          await loadData();
        } else {
          alert('Lỗi khi cập nhật: ' + result.error);
          return;
        }
      } else {
        const result = await projectsAPI.create(formData);
        if (result.success) {
          await loadData();
        } else {
          alert('Lỗi khi tạo mới: ' + result.error);
          return;
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Lỗi khi lưu dữ liệu');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ongoing': 'Đang thực hiện',
      'paused': 'Tạm dừng',
      'completed': 'Hoàn thành',
      'closed': 'Quyết toán'
    };
    return labels[status] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'ongoing': 'bg-blue-100 text-blue-700',
      'paused': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0;
    return Math.min(Math.round((spent / budget) * 100), 100);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Dự Án</h1>
        <p className="text-gray-600">Danh mục để gắn các phiếu thu/chi vào từng dự án cụ thể nhằm theo dõi lỗ/lãi dự án</p>
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
                placeholder="Tìm kiếm mã, tên dự án, PM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
              />
            </div>

            {/* Filter BU */}
            <select
              value={filterBU}
              onChange={(e) => setFilterBU(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            >
              <option value="all">Tất cả BU</option>
              {buList.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ongoing">Đang thực hiện</option>
              <option value="paused">Tạm dừng</option>
              <option value="completed">Hoàn thành</option>
              <option value="closed">Quyết toán</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Thêm Dự Án
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E6BB8]"></div>
            <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã Dự Án</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên Dự Án</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BU Chủ Quản</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PM</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngân Sách</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiến Độ</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const spent = project.spent || 0;
                    const progress = getProgressPercentage(spent, project.budget);
                    const buOwner = project.bu_owner || project.buOwner || '-';
                    const pm = project.project_manager || project.pm || '-';

                    return (
                      <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-semibold text-[#1E6BB8]">{project.code}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#F7931E]" />
                            <span className="font-medium text-gray-900">{project.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{buOwner}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{pm}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</div>
                            <div className="text-xs text-gray-500">Đã chi: {formatCurrency(spent)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(project)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy dự án nào</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingProject ? 'Chỉnh Sửa Dự Án' : 'Tạo Mới Dự Án'}
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
              <form onSubmit={handleSubmit} id="project-form">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Mã Dự Án
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="PRJ-2024-001"
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
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      >
                        <option value="ongoing">Đang thực hiện</option>
                        <option value="paused">Tạm dừng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="closed">Quyết toán</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Tên Dự Án
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: BlueBolt ERP System"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        BU Chủ Quản
                      </label>
                      <select
                        value={formData.bu_owner}
                        onChange={(e) => setFormData({ ...formData, bu_owner: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      >
                        <option value="">Chọn BU...</option>
                        {buList.map(bu => (
                          <option key={bu} value={bu}>{bu}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Quản Trị Dự Án (PM)
                      </label>
                      <input
                        type="text"
                        value={formData.project_manager}
                        onChange={(e) => setFormData({ ...formData, project_manager: e.target.value })}
                        placeholder="Nhập tên PM"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                      Ngân Sách Dự Kiến (VND)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Ngày Bắt Đầu
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Ngày Kết Thúc
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent focus:bg-white transition-all"
                        required
                      />
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
                form="project-form"
                className="px-8 py-2.5 bg-[#1E6BB8] hover:bg-[#1557A0] text-white rounded-lg transition-colors font-medium min-w-[140px]"
              >
                {editingProject ? 'Xác nhận cập nhật' : 'Xác nhận tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingProject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa dự án này?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Mã:</span> {deletingProject.code}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Tên:</span> {deletingProject.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Đã chi:</span> {formatCurrency(deletingProject.spent)}
                </p>
              </div>

              {deletingProject.spent > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Dự án này đã có chi phí phát sinh. Không thể xóa!
                  </p>
                </div>
              )}

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
