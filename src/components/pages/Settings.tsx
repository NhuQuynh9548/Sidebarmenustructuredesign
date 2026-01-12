import React, { useState, useEffect } from 'react';
import { Database, Check, AlertCircle, RefreshCw, Loader, Server, HardDrive } from 'lucide-react';
import { businessUnitsAPI, transactionsAPI } from '../../services/supabaseApi';

export function Settings() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await businessUnitsAPI.getAll();
      setIsConnected(result.success);
      if (result.success) {
        loadStats();
      }
    } catch (error) {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [busResult, txnsResult] = await Promise.all([
        businessUnitsAPI.getAll(),
        transactionsAPI.getAll(),
      ]);

      setStats({
        businessUnits: busResult.data?.length || 0,
        transactions: txnsResult.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult('');

    try {
      setSeedResult('✅ Kết nối trực tiếp với Supabase Database đã sẵn sàng!');
      loadStats();
    } catch (error: any) {
      setSeedResult(`❌ Lỗi: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-600">Quản lý kết nối backend và dữ liệu hệ thống</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isConnected === true ? 'bg-green-100' :
              isConnected === false ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              <Server className={`w-6 h-6 ${
                isConnected === true ? 'text-green-600' :
                isConnected === false ? 'text-red-600' :
                'text-gray-400'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Trạng Thái Kết Nối</h2>
              <p className="text-sm text-gray-600">Supabase Backend Server</p>
            </div>
          </div>
          
          <button
            onClick={checkConnection}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E6BB8] hover:bg-[#155a9e] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Kiểm tra lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            isConnected === true ? 'bg-green-50 border-green-200' :
            isConnected === false ? 'bg-red-50 border-red-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isConnected === true ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : isConnected === false ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              <span className={`font-semibold ${
                isConnected === true ? 'text-green-700' :
                isConnected === false ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {isConnected === true ? 'Đã kết nối' :
                 isConnected === false ? 'Mất kết nối' :
                 'Đang kiểm tra...'}
              </span>
            </div>
            <p className="text-sm text-gray-600">Backend API Status</p>
          </div>

          <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Supabase KV Store</span>
            </div>
            <p className="text-sm text-gray-600">Key-Value Database</p>
          </div>

          <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Edge Functions</span>
            </div>
            <p className="text-sm text-gray-600">Serverless API</p>
          </div>
        </div>
      </div>

      {/* Database Statistics */}
      {stats && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thống Kê Dữ Liệu</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Business Units</p>
              <p className="text-3xl font-bold text-blue-900">{stats.businessUnits}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Giao dịch</p>
              <p className="text-3xl font-bold text-green-900">{stats.transactions}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Nhân sự</p>
              <p className="text-3xl font-bold text-purple-900">-</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">Đối tác</p>
              <p className="text-3xl font-bold text-orange-900">-</p>
            </div>
          </div>
        </div>
      )}

      {/* Seed Data Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Seed Dữ Liệu Mẫu</h2>
            <p className="text-gray-600 mb-4">
              Tạo dữ liệu mẫu ban đầu cho hệ thống bao gồm Business Units, giao dịch, nhân sự, và đối tác demo.
              Chức năng này hữu ích khi bạn muốn test hệ thống với dữ liệu mẫu.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1">Lưu ý quan trọng:</p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Chức năng này sẽ tạo dữ liệu mẫu vào database</li>
                    <li>Nếu đã có dữ liệu, việc seed có thể tạo duplicate</li>
                    <li>Nên sử dụng khi database còn trống</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleSeedData}
              disabled={isSeeding || !isConnected}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Đang seed dữ liệu...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Seed Dữ Liệu Mẫu
                </>
              )}
            </button>

            {seedResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                seedResult.startsWith('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{seedResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Endpoints Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">API Endpoints</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
            <code className="text-gray-700">/business-units</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
            <code className="text-gray-700">/transactions</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
            <code className="text-gray-700">/employees</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
            <code className="text-gray-700">/partners</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono text-xs">POST</span>
            <code className="text-gray-700">/dashboard</code>
          </div>
        </div>
      </div>
    </div>
  );
}
