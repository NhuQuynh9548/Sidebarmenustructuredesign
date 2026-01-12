/*
  # BlueBolt Management System - Database Schema

  Hướng dẫn sử dụng:
  1. Mở Supabase Dashboard của bạn
  2. Vào SQL Editor (icon </> ở sidebar)
  3. Tạo New Query
  4. Copy toàn bộ nội dung file này
  5. Paste vào SQL Editor
  6. Click "Run" để thực thi

  Migration này sẽ tạo:
  - 6 bảng chính: business_units, employees, partners, transactions, users, master_data
  - Row Level Security (RLS) policies
  - Indexes để tối ưu performance
  - Triggers tự động cập nhật updated_at
  - Dữ liệu mẫu để test
  - Views cho analytics
*/

-- ============================================================
-- 1. BUSINESS UNITS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bu_code text UNIQUE NOT NULL,
  bu_name text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'active',
  director text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;

-- Policies for business_units
CREATE POLICY "Anyone can view business units"
  ON business_units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert business units"
  ON business_units FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update business units"
  ON business_units FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete business units"
  ON business_units FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_business_units_bu_code ON business_units(bu_code);
CREATE INDEX IF NOT EXISTS idx_business_units_status ON business_units(status);

-- ============================================================
-- 2. EMPLOYEES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  employee_name text NOT NULL,
  business_unit text NOT NULL,
  position text DEFAULT '',
  department text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  hire_date date DEFAULT CURRENT_DATE,
  salary numeric DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policies for employees
CREATE POLICY "Authenticated users can view employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_business_unit ON employees(business_unit);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- ============================================================
-- 3. PARTNERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_code text UNIQUE NOT NULL,
  partner_name text NOT NULL,
  partner_type text DEFAULT 'customer',
  business_unit text DEFAULT '',
  contact_person text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  tax_code text DEFAULT '',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Policies for partners
CREATE POLICY "Authenticated users can view partners"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete partners"
  ON partners FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partners_partner_code ON partners(partner_code);
CREATE INDEX IF NOT EXISTS idx_partners_business_unit ON partners(business_unit);
CREATE INDEX IF NOT EXISTS idx_partners_partner_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);

-- ============================================================
-- 4. TRANSACTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code text UNIQUE NOT NULL,
  transaction_date date DEFAULT CURRENT_DATE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  business_unit text NOT NULL,
  category text DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  description text DEFAULT '',
  partner_name text DEFAULT '',
  payment_method text DEFAULT 'cash',
  status text DEFAULT 'completed',
  created_by text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Authenticated users can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_code ON transactions(transaction_code);
CREATE INDEX IF NOT EXISTS idx_transactions_business_unit ON transactions(business_unit);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================================
-- 5. USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'employee',
  business_units text[] DEFAULT '{}',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================================
-- 6. MASTER DATA TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS master_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  parent_code text DEFAULT '',
  sort_order integer DEFAULT 0,
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(type, code)
);

-- Enable RLS
ALTER TABLE master_data ENABLE ROW LEVEL SECURITY;

-- Policies for master_data
CREATE POLICY "Authenticated users can view master data"
  ON master_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert master data"
  ON master_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update master data"
  ON master_data FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete master data"
  ON master_data FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_master_data_type ON master_data(type);
CREATE INDEX IF NOT EXISTS idx_master_data_code ON master_data(code);
CREATE INDEX IF NOT EXISTS idx_master_data_parent_code ON master_data(parent_code);
CREATE INDEX IF NOT EXISTS idx_master_data_status ON master_data(status);

-- ============================================================
-- 7. SEED DATA
-- ============================================================

-- Seed Business Units
INSERT INTO business_units (bu_code, bu_name, description, status, director) VALUES
  ('BU001', 'BlueBolt G&A', 'General & Administration', 'active', 'Nguyễn Văn A'),
  ('BU002', 'BlueBolt R&D', 'Research & Development', 'active', 'Trần Thị B'),
  ('BU003', 'BlueBolt Academy', 'Training & Education', 'active', 'Lê Văn C'),
  ('BU004', 'BlueBolt Services', 'Services Division', 'active', 'Phạm Văn D'),
  ('BU005', 'BlueBolt Software', 'Software Development', 'active', 'Hoàng Thị E')
ON CONFLICT (bu_code) DO NOTHING;

-- Seed Users
INSERT INTO users (username, email, full_name, role, business_units, status) VALUES
  ('admin', 'admin@bluebolt.vn', 'Administrator', 'admin', ARRAY['BU001', 'BU002', 'BU003', 'BU004', 'BU005'], 'active'),
  ('ceo', 'ceo@bluebolt.vn', 'CEO', 'ceo', ARRAY['BU001', 'BU002', 'BU003', 'BU004', 'BU005'], 'active'),
  ('manager.software', 'manager.software@bluebolt.vn', 'Software Manager', 'bu_manager', ARRAY['BU005'], 'active'),
  ('manager.academy', 'manager.academy@bluebolt.vn', 'Academy Manager', 'bu_manager', ARRAY['BU003'], 'active'),
  ('manager.services', 'manager.services@bluebolt.vn', 'Services Manager', 'bu_manager', ARRAY['BU004'], 'active')
ON CONFLICT (username) DO NOTHING;

-- Seed Master Data - Categories
INSERT INTO master_data (type, code, name, description, status) VALUES
  ('income_category', 'REVENUE', 'Doanh thu', 'Doanh thu từ dịch vụ và sản phẩm', 'active'),
  ('income_category', 'TRAINING', 'Đào tạo', 'Doanh thu từ khóa học', 'active'),
  ('expense_category', 'SALARY', 'Lương nhân viên', 'Chi phí lương và phụ cấp', 'active'),
  ('expense_category', 'OFFICE', 'Văn phòng', 'Chi phí văn phòng phẩm, tiện ích', 'active'),
  ('expense_category', 'MARKETING', 'Marketing', 'Chi phí quảng cáo và tiếp thị', 'active')
ON CONFLICT (type, code) DO NOTHING;

-- Seed Master Data - Payment Methods
INSERT INTO master_data (type, code, name, description, status) VALUES
  ('payment_method', 'CASH', 'Tiền mặt', 'Thanh toán bằng tiền mặt', 'active'),
  ('payment_method', 'BANK', 'Chuyển khoản', 'Thanh toán qua ngân hàng', 'active'),
  ('payment_method', 'CARD', 'Thẻ', 'Thanh toán bằng thẻ', 'active'),
  ('payment_method', 'EWALLET', 'Ví điện tử', 'Thanh toán qua ví điện tử', 'active')
ON CONFLICT (type, code) DO NOTHING;

-- Seed Master Data - Positions
INSERT INTO master_data (type, code, name, description, status) VALUES
  ('position', 'CEO', 'CEO', 'Giám đốc điều hành', 'active'),
  ('position', 'CTO', 'CTO', 'Giám đốc công nghệ', 'active'),
  ('position', 'MANAGER', 'Manager', 'Quản lý', 'active'),
  ('position', 'LEAD', 'Team Lead', 'Trưởng nhóm', 'active'),
  ('position', 'DEVELOPER', 'Developer', 'Lập trình viên', 'active'),
  ('position', 'DESIGNER', 'Designer', 'Thiết kế', 'active')
ON CONFLICT (type, code) DO NOTHING;

-- Seed Sample Employees
INSERT INTO employees (employee_id, employee_name, business_unit, position, email, phone, salary, status) VALUES
  ('EMP001', 'Nguyễn Văn A', 'BU001', 'CEO', 'nguyen.van.a@bluebolt.vn', '0901234567', 50000000, 'active'),
  ('EMP002', 'Trần Thị B', 'BU002', 'CTO', 'tran.thi.b@bluebolt.vn', '0902234567', 40000000, 'active'),
  ('EMP003', 'Lê Văn C', 'BU003', 'Manager', 'le.van.c@bluebolt.vn', '0903234567', 30000000, 'active'),
  ('EMP004', 'Phạm Văn D', 'BU004', 'Manager', 'pham.van.d@bluebolt.vn', '0904234567', 30000000, 'active'),
  ('EMP005', 'Hoàng Thị E', 'BU005', 'Manager', 'hoang.thi.e@bluebolt.vn', '0905234567', 30000000, 'active')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Sample Partners
INSERT INTO partners (partner_code, partner_name, partner_type, business_unit, contact_person, email, phone, status) VALUES
  ('PT001', 'Công ty ABC', 'customer', 'BU005', 'Người liên hệ A', 'contact@abc.com', '0911111111', 'active'),
  ('PT002', 'Công ty XYZ', 'customer', 'BU003', 'Người liên hệ B', 'contact@xyz.com', '0922222222', 'active'),
  ('PT003', 'Nhà cung cấp DEF', 'supplier', 'BU001', 'Người liên hệ C', 'contact@def.com', '0933333333', 'active')
ON CONFLICT (partner_code) DO NOTHING;

-- Seed Sample Transactions
INSERT INTO transactions (transaction_code, transaction_date, type, business_unit, category, amount, description, payment_method, status) VALUES
  ('TXN001', CURRENT_DATE - INTERVAL '30 days', 'income', 'BU005', 'REVENUE', 100000000, 'Dự án phát triển phần mềm', 'BANK', 'completed'),
  ('TXN002', CURRENT_DATE - INTERVAL '25 days', 'income', 'BU003', 'TRAINING', 50000000, 'Khóa học lập trình', 'BANK', 'completed'),
  ('TXN003', CURRENT_DATE - INTERVAL '20 days', 'expense', 'BU001', 'SALARY', 150000000, 'Lương tháng 12', 'BANK', 'completed'),
  ('TXN004', CURRENT_DATE - INTERVAL '15 days', 'expense', 'BU001', 'OFFICE', 10000000, 'Văn phòng phẩm', 'CASH', 'completed'),
  ('TXN005', CURRENT_DATE - INTERVAL '10 days', 'income', 'BU004', 'REVENUE', 75000000, 'Dịch vụ tư vấn', 'BANK', 'completed')
ON CONFLICT (transaction_code) DO NOTHING;

-- ============================================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_business_units_updated_at') THEN
    CREATE TRIGGER update_business_units_updated_at
      BEFORE UPDATE ON business_units
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_employees_updated_at') THEN
    CREATE TRIGGER update_employees_updated_at
      BEFORE UPDATE ON employees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_partners_updated_at') THEN
    CREATE TRIGGER update_partners_updated_at
      BEFORE UPDATE ON partners
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_transactions_updated_at') THEN
    CREATE TRIGGER update_transactions_updated_at
      BEFORE UPDATE ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_master_data_updated_at') THEN
    CREATE TRIGGER update_master_data_updated_at
      BEFORE UPDATE ON master_data
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================
-- 9. VIEWS FOR ANALYTICS
-- ============================================================

-- View: Dashboard Summary
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
  t.business_unit,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_revenue,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) -
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_profit,
  COUNT(*) as transaction_count
FROM transactions t
WHERE t.status = 'completed'
GROUP BY t.business_unit;

-- ============================================================
-- HOÀN TẤT!
-- ============================================================

-- Xác nhận migration thành công
SELECT 'Schema created successfully! ✅' as message;
