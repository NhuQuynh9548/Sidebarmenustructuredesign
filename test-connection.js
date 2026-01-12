#!/usr/bin/env node

const SUPABASE_URL = 'https://geaklirrfdhdrqunjjjz.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWtsaXJyZmRoZHJxdW5qamp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTkyOTMsImV4cCI6MjA4MzczNTI5M30.l3D6rRdIfZYngBohs6QcvHqksQDBN5LVTfCVwhGQhh0';

console.log('\n🔍 ===== DEBUG KẾT NỐI SUPABASE =====\n');
console.log('Project ID: geaklirrfdhdrqunjjjz');
console.log('URL:', SUPABASE_URL);
console.log('');

async function test() {
    // Test 1: Health Check
    console.log('📌 Test 1: Edge Function Health Check...');
    try {
        const healthUrl = `${SUPABASE_URL}/functions/v1/make-server-393f5b29/health`;
        console.log('   URL:', healthUrl);

        const response = await fetch(healthUrl, {
            headers: {
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        console.log('   Status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log('   ❌ FAIL:', text);
            console.log('\n⚠️  EDGE FUNCTION CHƯA ĐƯỢC DEPLOY!');
            console.log('   Chạy lệnh sau để deploy:');
            console.log('   ./deploy-edge-function.sh geaklirrfdhdrqunjjjz\n');
            return false;
        }

        const data = await response.json();
        console.log('   Response:', JSON.stringify(data));

        if (data.status === 'ok') {
            console.log('   ✅ PASS - Edge Function hoạt động!\n');
        } else {
            console.log('   ⚠️  Response không đúng format\n');
            return false;
        }
    } catch (error) {
        console.log('   ❌ ERROR:', error.message);
        console.log('\n⚠️  EDGE FUNCTION CHƯA ĐƯỢC DEPLOY hoặc KHÔNG TÌM THẤY!');
        console.log('   Chạy lệnh sau để deploy:');
        console.log('   ./deploy-edge-function.sh geaklirrfdhdrqunjjjz\n');
        return false;
    }

    // Test 2: Business Units API
    console.log('📌 Test 2: Business Units API...');
    try {
        const buUrl = `${SUPABASE_URL}/functions/v1/make-server-393f5b29/business-units`;
        console.log('   URL:', buUrl);

        const response = await fetch(buUrl, {
            headers: {
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        console.log('   Status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log('   ❌ FAIL:', text);
            return false;
        }

        const data = await response.json();
        console.log('   Response:', JSON.stringify(data, null, 2));

        if (data.success) {
            const count = data.data ? data.data.length : 0;
            console.log(`   ✅ PASS - Đọc được ${count} records`);

            if (count === 0) {
                console.log('   ⚠️  Database trống (chưa có dữ liệu)');
            } else {
                console.log('   📊 Sample data:', JSON.stringify(data.data[0], null, 2));
            }
            console.log('');
        } else {
            console.log('   ⚠️  Response không đúng format\n');
            return false;
        }
    } catch (error) {
        console.log('   ❌ ERROR:', error.message, '\n');
        return false;
    }

    // Test 3: Direct Database Access
    console.log('📌 Test 3: Truy cập Database trực tiếp...');
    try {
        const dbUrl = `${SUPABASE_URL}/rest/v1/business_units?select=*&limit=5`;
        console.log('   URL:', dbUrl);

        const response = await fetch(dbUrl, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });

        console.log('   Status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log('   ❌ FAIL:', text);
            console.log('\n⚠️  Có thể:');
            console.log('   - Table "business_units" chưa tồn tại trong database');
            console.log('   - RLS policy chặn truy cập');
            console.log('   - Cần chạy migration để tạo tables\n');
            return false;
        }

        const data = await response.json();
        const count = data.length;

        console.log(`   ✅ PASS - Đọc được ${count} records`);

        if (count === 0) {
            console.log('   ⚠️  Table trống (chưa có dữ liệu)');
        } else {
            console.log('   📊 Sample:', JSON.stringify(data[0], null, 2));
        }
        console.log('');
    } catch (error) {
        console.log('   ❌ ERROR:', error.message, '\n');
        return false;
    }

    // Test 4: Check all tables
    console.log('📌 Test 4: Kiểm tra tất cả tables...');
    const tables = ['business_units', 'transactions', 'employees', 'partners'];

    for (const table of tables) {
        try {
            const url = `${SUPABASE_URL}/rest/v1/${table}?select=count&limit=0`;
            const response = await fetch(url, {
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`,
                    'Prefer': 'count=exact'
                }
            });

            if (response.ok) {
                console.log(`   ✅ ${table}: EXISTS`);
            } else {
                console.log(`   ❌ ${table}: NOT FOUND (${response.status})`);
            }
        } catch (error) {
            console.log(`   ❌ ${table}: ERROR - ${error.message}`);
        }
    }
    console.log('');

    console.log('✅ ===== TẤT CẢ TESTS HOÀN TẤT =====\n');
    return true;
}

test().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
