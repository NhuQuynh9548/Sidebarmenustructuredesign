#!/usr/bin/env node

const SUPABASE_URL = 'https://geaklirrfdhdrqunjjjz.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWtsaXJyZmRoZHJxdW5qamp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTkyOTMsImV4cCI6MjA4MzczNTI5M30.l3D6rRdIfZYngBohs6QcvHqksQDBN5LVTfCVwhGQhh0';

console.log('\n🔍 ===== TEST KẾT NỐI TRỰC TIẾP SUPABASE DATABASE =====\n');
console.log('Project ID: geaklirrfdhdrqunjjjz');
console.log('URL:', SUPABASE_URL);
console.log('');

async function testDirectDB() {
    const tables = [
        { name: 'business_units', desc: 'Business Units' },
        { name: 'transactions', desc: 'Transactions' },
        { name: 'employees', desc: 'Employees' },
        { name: 'partners', desc: 'Partners' },
        { name: 'users', desc: 'Users' },
        { name: 'master_data', desc: 'Master Data' }
    ];

    let allSuccess = true;

    for (const table of tables) {
        console.log(`📌 Test: ${table.desc} (${table.name})...`);
        const url = `${SUPABASE_URL}/rest/v1/${table.name}?select=*&limit=5`;
        console.log(`   URL: ${url}`);

        try {
            const response = await fetch(url, {
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`
                }
            });

            console.log(`   Status: ${response.status}`);

            if (!response.ok) {
                const text = await response.text();
                console.log(`   ❌ FAIL: ${text}\n`);
                allSuccess = false;
                continue;
            }

            const data = await response.json();
            const count = data.length;

            console.log(`   ✅ PASS - Đọc được ${count} records`);

            if (count > 0) {
                console.log(`   📊 Sample:`, JSON.stringify(data[0], null, 2));
            } else {
                console.log(`   ⚠️  Table trống (chưa có dữ liệu)`);
            }
            console.log('');
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}\n`);
            allSuccess = false;
        }
    }

    console.log('============================================');
    if (allSuccess) {
        console.log('✅ TẤT CẢ TESTS ĐỀU PASS!');
        console.log('🎉 Ứng dụng đã kết nối thành công với Supabase!');
        console.log('');
        console.log('Bước tiếp theo:');
        console.log('  npm run dev');
        console.log('  → Mở http://localhost:5173');
    } else {
        console.log('❌ MỘT SỐ TESTS FAILED!');
        console.log('Vui lòng kiểm tra lỗi ở trên.');
    }
    console.log('============================================\n');

    return allSuccess;
}

testDirectDB().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
