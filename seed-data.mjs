import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://geaklirrfdhdrqunjjjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWtsaXJyZmRoZHJxdW5qamp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTkyOTMsImV4cCI6MjA4MzczNTI5M30.l3D6rRdIfZYngBohs6QcvHqksQDBN5LVTfCVwhGQhh0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('🌱 Starting data seeding...\n');

  // Seed Business Units
  console.log('📦 Seeding Business Units...');
  const businessUnits = [
    { bu_code: 'BU001', bu_name: 'BlueBolt G&A', description: 'General & Administration', status: 'active', director: 'Nguyễn Văn A' },
    { bu_code: 'BU002', bu_name: 'BlueBolt R&D', description: 'Research & Development', status: 'active', director: 'Trần Thị B' },
    { bu_code: 'BU003', bu_name: 'BlueBolt Academy', description: 'Training & Education', status: 'active', director: 'Lê Văn C' },
    { bu_code: 'BU004', bu_name: 'BlueBolt Services', description: 'Services Division', status: 'active', director: 'Phạm Văn D' },
    { bu_code: 'BU005', bu_name: 'BlueBolt Software', description: 'Software Development', status: 'active', director: 'Hoàng Thị E' }
  ];

  const { data: buData, error: buError } = await supabase
    .from('business_units')
    .insert(businessUnits)
    .select();

  if (buError) {
    console.error('❌ Error seeding business units:', buError.message);
  } else {
    console.log(`✅ Created ${buData.length} business units`);
  }

  // Seed Employees
  console.log('\n👥 Seeding Employees...');
  const employees = [
    { employee_id: 'EMP001', employee_name: 'Nguyễn Văn A', business_unit: 'BU001', position: 'CEO', email: 'nguyen.van.a@bluebolt.vn', phone: '0901234567', salary: 50000000, status: 'active' },
    { employee_id: 'EMP002', employee_name: 'Trần Thị B', business_unit: 'BU002', position: 'CTO', email: 'tran.thi.b@bluebolt.vn', phone: '0902234567', salary: 40000000, status: 'active' },
    { employee_id: 'EMP003', employee_name: 'Lê Văn C', business_unit: 'BU003', position: 'Manager', email: 'le.van.c@bluebolt.vn', phone: '0903234567', salary: 30000000, status: 'active' }
  ];

  const { data: empData, error: empError } = await supabase
    .from('employees')
    .insert(employees)
    .select();

  if (empError) {
    console.error('❌ Error seeding employees:', empError.message);
  } else {
    console.log(`✅ Created ${empData.length} employees`);
  }

  // Seed Transactions
  console.log('\n💰 Seeding Transactions...');
  const transactions = [
    { transaction_code: 'TXN001', transaction_date: '2026-01-01', type: 'income', business_unit: 'BU005', category: 'REVENUE', amount: 100000000, description: 'Dự án phát triển phần mềm', payment_method: 'BANK', status: 'completed' },
    { transaction_code: 'TXN002', transaction_date: '2026-01-05', type: 'income', business_unit: 'BU003', category: 'TRAINING', amount: 50000000, description: 'Khóa học lập trình', payment_method: 'BANK', status: 'completed' },
    { transaction_code: 'TXN003', transaction_date: '2026-01-10', type: 'expense', business_unit: 'BU001', category: 'SALARY', amount: 150000000, description: 'Lương tháng 1', payment_method: 'BANK', status: 'completed' }
  ];

  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .insert(transactions)
    .select();

  if (txError) {
    console.error('❌ Error seeding transactions:', txError.message);
  } else {
    console.log(`✅ Created ${txData.length} transactions`);
  }

  // Verify data
  console.log('\n🔍 Verifying seeded data...');
  const { data: verifyBU } = await supabase.from('business_units').select('*');
  const { data: verifyEmp } = await supabase.from('employees').select('*');
  const { data: verifyTx } = await supabase.from('transactions').select('*');

  console.log(`\n📊 Summary:`);
  console.log(`  Business Units: ${verifyBU?.length || 0}`);
  console.log(`  Employees: ${verifyEmp?.length || 0}`);
  console.log(`  Transactions: ${verifyTx?.length || 0}`);

  console.log('\n✅ Seeding complete!\n');
}

seedData().catch(console.error);
