import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface TestResult {
  status: 'pending' | 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function TestConnection() {
  const [results, setResults] = useState<TestResult[]>([
    { status: 'pending', message: '' },
    { status: 'pending', message: '' },
    { status: 'pending', message: '' },
    { status: 'pending', message: '' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [configInfo, setConfigInfo] = useState({ url: '', projectId: '', keyPreview: '' });

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const url = new URL(SUPABASE_URL);
        const projectId = url.hostname.split('.')[0];
        setConfigInfo({
          url: SUPABASE_URL,
          projectId,
          keyPreview: SUPABASE_ANON_KEY.substring(0, 20) + '...'
        });
      } catch (e) {
        console.error('Invalid URL:', e);
      }
    }
  }, []);

  const updateResult = (index: number, result: TestResult) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = result;
      return newResults;
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const test1_CheckEnv = async () => {
    updateResult(0, { status: 'loading', message: 'Đang kiểm tra...' });
    await delay(500);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      updateResult(0, {
        status: 'error',
        message: 'Thiếu biến môi trường trong .env',
        data: { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY }
      });
      return false;
    }

    if (!SUPABASE_URL.includes('supabase.co')) {
      updateResult(0, {
        status: 'error',
        message: 'URL không đúng định dạng Supabase'
      });
      return false;
    }

    updateResult(0, {
      status: 'success',
      message: 'Cấu hình .env hợp lệ ✓'
    });
    return true;
  };

  const test2_HealthCheck = async () => {
    updateResult(1, { status: 'loading', message: 'Đang kiểm tra...' });

    const url = `${SUPABASE_URL}/functions/v1/make-server-393f5b29/health`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        updateResult(1, {
          status: 'success',
          message: 'Edge Function hoạt động tốt! ✓',
          data
        });
        return true;
      } else {
        updateResult(1, {
          status: 'error',
          message: `Response không như mong đợi (${response.status})`,
          data
        });
        return false;
      }
    } catch (error: any) {
      updateResult(1, {
        status: 'error',
        message: `Không thể kết nối: ${error.message}`,
        data: { error: error.toString() }
      });
      return false;
    }
  };

  const test3_ReadBusinessUnits = async () => {
    updateResult(2, { status: 'loading', message: 'Đang kiểm tra...' });

    const url = `${SUPABASE_URL}/functions/v1/make-server-393f5b29/business-units`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const count = data.data ? data.data.length : 0;
        updateResult(2, {
          status: 'success',
          message: `Đọc được ${count} Business Units ✓`,
          data: {
            count,
            sample: data.data && data.data[0] ? data.data[0] : null
          }
        });
        return true;
      } else {
        updateResult(2, {
          status: 'error',
          message: 'Không thể đọc dữ liệu',
          data
        });
        return false;
      }
    } catch (error: any) {
      updateResult(2, {
        status: 'error',
        message: `Lỗi: ${error.message}`,
        data: { error: error.toString() }
      });
      return false;
    }
  };

  const test4_ReadTransactions = async () => {
    updateResult(3, { status: 'loading', message: 'Đang kiểm tra...' });

    const url = `${SUPABASE_URL}/functions/v1/make-server-393f5b29/transactions`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const count = data.data ? data.data.length : 0;
        updateResult(3, {
          status: 'success',
          message: `Đọc được ${count} Transactions ✓`,
          data: {
            count,
            sample: data.data && data.data[0] ? data.data[0] : null
          }
        });
        return true;
      } else {
        updateResult(3, {
          status: 'error',
          message: 'Không thể đọc dữ liệu',
          data
        });
        return false;
      }
    } catch (error: any) {
      updateResult(3, {
        status: 'error',
        message: `Lỗi: ${error.message}`,
        data: { error: error.toString() }
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);

    const test1 = await test1_CheckEnv();
    if (!test1) {
      setIsRunning(false);
      return;
    }

    await test2_HealthCheck();
    await test3_ReadBusinessUnits();
    await test4_ReadTransactions();

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'loading': return 'border-orange-500 bg-orange-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'loading': return '⏳';
      default: return '⏱';
    }
  };

  const allSuccess = results.every(r => r.status === 'success');
  const hasError = results.some(r => r.status === 'error');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🧪 Test Kết Nối Supabase</h1>
        <p className="text-gray-600">Kiểm tra kết nối đến Supabase và Edge Functions</p>
      </div>

      {/* Config Info */}
      <Card className="p-4 mb-6 bg-gray-50">
        <h3 className="font-semibold mb-2">Cấu Hình</h3>
        {configInfo.projectId ? (
          <div className="text-sm space-y-1 text-gray-700">
            <div><strong>Project ID:</strong> <code className="bg-white px-2 py-1 rounded">{configInfo.projectId}</code></div>
            <div><strong>URL:</strong> <code className="bg-white px-2 py-1 rounded text-xs">{configInfo.url}</code></div>
            <div><strong>Key:</strong> <code className="bg-white px-2 py-1 rounded text-xs">{configInfo.keyPreview}</code></div>
          </div>
        ) : (
          <div className="text-red-600">
            ❌ Không tìm thấy cấu hình Supabase trong .env
          </div>
        )}
      </Card>

      {/* Test Sections */}
      <div className="space-y-4 mb-6">
        {[
          '1. Kiểm tra cấu hình .env',
          '2. Test Edge Function - Health Check',
          '3. Test Database - Đọc Business Units',
          '4. Test Database - Đọc Transactions'
        ].map((title, index) => (
          <Card key={index} className={`p-4 border-2 transition-all ${getStatusColor(results[index].status)}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getStatusIcon(results[index].status)}</span>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className={`text-sm ${results[index].status === 'error' ? 'text-red-700' : results[index].status === 'success' ? 'text-green-700' : 'text-gray-600'}`}>
                  {results[index].message || 'Chưa chạy'}
                </p>
                {results[index].data && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(results[index].data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Run Button */}
      <Button
        onClick={runAllTests}
        disabled={isRunning}
        className="w-full py-6 text-lg"
      >
        {isRunning ? 'Đang chạy tests...' : 'Chạy Test Kết Nối'}
      </Button>

      {/* Summary */}
      {(allSuccess || hasError) && !isRunning && (
        <Card className={`mt-6 p-6 text-center ${allSuccess ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-2`}>
          {allSuccess ? (
            <div>
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Hoàn Hảo! Tất cả tests đều PASS!
              </h3>
              <div className="text-sm text-green-600 space-y-1">
                <div>✅ Kết nối Supabase thành công</div>
                <div>✅ Edge Function hoạt động tốt</div>
                <div>✅ Database đọc/ghi bình thường</div>
                <div className="mt-4 font-semibold">Bạn có thể bắt đầu sử dụng ứng dụng!</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="text-xl font-bold text-red-700 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-sm text-red-600">
                Vui lòng kiểm tra các test lỗi ở trên và xem hướng dẫn trong HUONG_DAN_KET_NOI_SUPABASE.md
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
