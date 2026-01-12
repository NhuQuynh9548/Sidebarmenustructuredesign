/*
  # Create MasterData and System Administration Tables

  ## 1. MasterData Tables (6 tables)
  
  ### Income/Expense Categories (Danh Mục Thu Chi)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Category code
    - `name` (text) - Category name
    - `type` (text) - 'income' or 'expense'
    - `description` (text) - Description
    - `parent_code` (text) - Parent category for hierarchy
    - `sort_order` (integer) - Display order
    - `status` (text) - 'active' or 'inactive'
    - `created_at`, `updated_at` (timestamptz)

  ### Cost Allocation Rules (Phân Bổ Chi Phí)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Rule code
    - `name` (text) - Rule name
    - `description` (text) - Rule description
    - `allocation_type` (text) - 'revenue_based', 'headcount_based', 'equal', 'custom'
    - `allocation_percentages` (jsonb) - BU allocation percentages
    - `status` (text)
    - `created_at`, `updated_at`

  ### Projects (Quản Lý Dự Án)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Project code
    - `name` (text) - Project name
    - `description` (text)
    - `business_unit` (text) - Assigned BU
    - `start_date` (date)
    - `end_date` (date)
    - `budget` (numeric)
    - `status` (text) - 'planning', 'active', 'completed', 'cancelled'
    - `created_at`, `updated_at`

  ### Employee Levels (Cấp Bậc Nhân Sự)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Level code
    - `name` (text) - Level name
    - `description` (text)
    - `level_order` (integer) - Hierarchy order
    - `status` (text)
    - `created_at`, `updated_at`

  ### Specializations/Roles (Chuyên Môn Vai Trò)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Specialization code
    - `name` (text) - Specialization name
    - `description` (text)
    - `category` (text) - 'technical', 'business', 'support'
    - `status` (text)
    - `created_at`, `updated_at`

  ### Payment Methods (Phương Thức Thanh Toán)
    - `id` (uuid, primary key)
    - `code` (text, unique) - Payment method code
    - `name` (text) - Payment method name
    - `description` (text)
    - `account_info` (jsonb) - Bank account details if applicable
    - `status` (text)
    - `created_at`, `updated_at`

  ## 2. System Administration Tables (6 tables)

  ### System Users (Quản Lý Người Dùng)
    - Links to auth.users, extends with business info
    - `id` (uuid, primary key)
    - `user_id` (uuid) - References auth.users
    - `username` (text, unique)
    - `full_name` (text)
    - `email` (text, unique)
    - `phone` (text)
    - `business_units` (text[]) - Array of BU codes
    - `status` (text) - 'active', 'inactive', 'locked'
    - `last_login` (timestamptz)
    - `created_at`, `updated_at`

  ### Roles (Vai Trò)
    - `id` (uuid, primary key)
    - `code` (text, unique)
    - `name` (text)
    - `description` (text)
    - `is_system_role` (boolean) - System-defined vs custom
    - `status` (text)
    - `created_at`, `updated_at`

  ### Permissions (Quyền Hạn)
    - `id` (uuid, primary key)
    - `code` (text, unique)
    - `name` (text)
    - `description` (text)
    - `module` (text) - Which module/feature
    - `action` (text) - 'create', 'read', 'update', 'delete', 'approve', etc.
    - `created_at`, `updated_at`

  ### Role Permissions (Liên Kết Vai Trò-Quyền)
    - `id` (uuid, primary key)
    - `role_id` (uuid) - Foreign key to roles
    - `permission_id` (uuid) - Foreign key to permissions
    - `created_at`

  ### User Roles (Người Dùng - Vai Trò)
    - `id` (uuid, primary key)
    - `user_id` (uuid) - Foreign key to system_users
    - `role_id` (uuid) - Foreign key to roles
    - `created_at`

  ### Security Settings (Thiết Lập Bảo Mật)
    - `id` (uuid, primary key)
    - `setting_key` (text, unique)
    - `setting_value` (jsonb)
    - `description` (text)
    - `updated_by` (uuid)
    - `updated_at`

  ### System Logs (Nhật Ký Hệ Thống)
    - `id` (uuid, primary key)
    - `user_id` (uuid)
    - `action` (text)
    - `module` (text)
    - `description` (text)
    - `metadata` (jsonb) - Additional context
    - `ip_address` (text)
    - `user_agent` (text)
    - `created_at` (timestamptz)

  ## 3. Security
    - RLS disabled for development (will enable later with proper policies)
*/

-- ============================================================================
-- MASTERDATA TABLES
-- ============================================================================

-- 1. Income/Expense Categories
CREATE TABLE IF NOT EXISTS income_expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  description text DEFAULT '',
  parent_code text DEFAULT '',
  sort_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_type ON income_expense_categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_status ON income_expense_categories(status);

-- 2. Cost Allocation Rules
CREATE TABLE IF NOT EXISTS cost_allocation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  allocation_type text DEFAULT 'custom' CHECK (allocation_type IN ('revenue_based', 'headcount_based', 'equal', 'custom')),
  allocation_percentages jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  business_unit text DEFAULT '',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  budget numeric DEFAULT 0,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_bu ON projects(business_unit);

-- 4. Employee Levels
CREATE TABLE IF NOT EXISTS employee_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  level_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emp_levels_order ON employee_levels(level_order);

-- 5. Specializations/Roles
CREATE TABLE IF NOT EXISTS specializations_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'technical' CHECK (category IN ('technical', 'business', 'support', 'other')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_specializations_category ON specializations_roles(category);

-- 6. Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  account_info jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- SYSTEM ADMINISTRATION TABLES
-- ============================================================================

-- 1. System Users
CREATE TABLE IF NOT EXISTS system_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  business_units text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'locked')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_users_status ON system_users(status);
CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);

-- 2. Roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  is_system_role boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  module text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);

-- 4. Role Permissions (Junction Table)
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_perms_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_perms_perm ON role_permissions(permission_id);

-- 5. User Roles (Junction Table)
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES system_users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

-- 6. Security Settings
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb DEFAULT '{}',
  description text DEFAULT '',
  updated_by uuid,
  updated_at timestamptz DEFAULT now()
);

-- 7. System Logs
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  module text NOT NULL,
  description text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  ip_address text DEFAULT '',
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_module ON system_logs(module);
CREATE INDEX IF NOT EXISTS idx_logs_created ON system_logs(created_at DESC);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default system roles
INSERT INTO roles (code, name, description, is_system_role) VALUES
  ('admin', 'Administrator', 'Full system access', true),
  ('manager', 'Manager', 'Management level access', true),
  ('employee', 'Employee', 'Basic employee access', true),
  ('accountant', 'Accountant', 'Financial data access', true)
ON CONFLICT (code) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (code, name, description, module, action) VALUES
  ('bu_view', 'View Business Units', 'View BU data', 'business_units', 'read'),
  ('bu_create', 'Create Business Units', 'Create new BU', 'business_units', 'create'),
  ('bu_edit', 'Edit Business Units', 'Edit BU data', 'business_units', 'update'),
  ('bu_delete', 'Delete Business Units', 'Delete BU', 'business_units', 'delete'),
  ('txn_view', 'View Transactions', 'View transactions', 'transactions', 'read'),
  ('txn_create', 'Create Transactions', 'Create transactions', 'transactions', 'create'),
  ('txn_edit', 'Edit Transactions', 'Edit transactions', 'transactions', 'update'),
  ('txn_delete', 'Delete Transactions', 'Delete transactions', 'transactions', 'delete'),
  ('txn_approve', 'Approve Transactions', 'Approve/reject transactions', 'transactions', 'approve'),
  ('emp_view', 'View Employees', 'View employee data', 'employees', 'read'),
  ('emp_create', 'Create Employees', 'Create employees', 'employees', 'create'),
  ('emp_edit', 'Edit Employees', 'Edit employee data', 'employees', 'update'),
  ('emp_delete', 'Delete Employees', 'Delete employees', 'employees', 'delete'),
  ('partner_view', 'View Partners', 'View partner data', 'partners', 'read'),
  ('partner_create', 'Create Partners', 'Create partners', 'partners', 'create'),
  ('partner_edit', 'Edit Partners', 'Edit partner data', 'partners', 'update'),
  ('partner_delete', 'Delete Partners', 'Delete partners', 'partners', 'delete'),
  ('admin_users', 'Manage Users', 'User management', 'administration', 'manage'),
  ('admin_roles', 'Manage Roles', 'Role management', 'administration', 'manage'),
  ('admin_security', 'Security Settings', 'Security configuration', 'administration', 'manage'),
  ('admin_logs', 'View System Logs', 'View audit logs', 'administration', 'read')
ON CONFLICT (code) DO NOTHING;

-- Insert default payment methods
INSERT INTO payment_methods (code, name, description) VALUES
  ('CASH', 'Tiền mặt', 'Thanh toán bằng tiền mặt'),
  ('BANK', 'Chuyển khoản', 'Chuyển khoản ngân hàng'),
  ('CARD', 'Thẻ', 'Thanh toán qua thẻ'),
  ('EWALLET', 'Ví điện tử', 'Ví điện tử (Momo, ZaloPay, etc.)')
ON CONFLICT (code) DO NOTHING;

-- Insert default employee levels
INSERT INTO employee_levels (code, name, description, level_order) VALUES
  ('INTERN', 'Thực tập sinh', 'Intern level', 1),
  ('JUNIOR', 'Nhân viên', 'Junior level', 2),
  ('SENIOR', 'Nhân viên cao cấp', 'Senior level', 3),
  ('LEAD', 'Trưởng nhóm', 'Team Lead', 4),
  ('MANAGER', 'Quản lý', 'Manager level', 5),
  ('DIRECTOR', 'Giám đốc', 'Director level', 6)
ON CONFLICT (code) DO NOTHING;

-- Insert default specializations
INSERT INTO specializations_roles (code, name, description, category) VALUES
  ('DEV', 'Developer', 'Software Developer', 'technical'),
  ('QA', 'QA/QC', 'Quality Assurance', 'technical'),
  ('DEVOPS', 'DevOps', 'DevOps Engineer', 'technical'),
  ('BA', 'Business Analyst', 'Business Analyst', 'business'),
  ('PM', 'Project Manager', 'Project Manager', 'business'),
  ('DESIGNER', 'Designer', 'UI/UX Designer', 'technical'),
  ('ACCOUNTANT', 'Kế toán', 'Accountant', 'support'),
  ('HR', 'Nhân sự', 'Human Resources', 'support'),
  ('SALES', 'Sales', 'Sales', 'business'),
  ('MARKETING', 'Marketing', 'Marketing', 'business')
ON CONFLICT (code) DO NOTHING;

-- Insert sample income/expense categories
INSERT INTO income_expense_categories (code, name, type, description, sort_order) VALUES
  ('REV_SERVICE', 'Doanh thu dịch vụ', 'income', 'Revenue from services', 1),
  ('REV_PRODUCT', 'Doanh thu sản phẩm', 'income', 'Revenue from products', 2),
  ('REV_TRAINING', 'Doanh thu đào tạo', 'income', 'Revenue from training', 3),
  ('EXP_SALARY', 'Chi phí nhân sự', 'expense', 'Personnel costs', 1),
  ('EXP_OFFICE', 'Chi phí văn phòng', 'expense', 'Office expenses', 2),
  ('EXP_MARKETING', 'Chi phí marketing', 'expense', 'Marketing expenses', 3),
  ('EXP_IT', 'Chi phí CNTT', 'expense', 'IT infrastructure costs', 4),
  ('EXP_TRAVEL', 'Chi phí đi lại', 'expense', 'Travel expenses', 5)
ON CONFLICT (code) DO NOTHING;

-- Insert default allocation rules
INSERT INTO cost_allocation_rules (code, name, description, allocation_type) VALUES
  ('EQUAL', 'Phân bổ đều', 'Equal distribution across all BUs', 'equal'),
  ('REVENUE', 'Theo doanh thu', 'Based on revenue contribution', 'revenue_based'),
  ('HEADCOUNT', 'Theo số lượng nhân sự', 'Based on headcount', 'headcount_based')
ON CONFLICT (code) DO NOTHING;

-- Insert default security settings
INSERT INTO security_settings (setting_key, setting_value, description) VALUES
  ('password_min_length', '{"value": 8}', 'Minimum password length'),
  ('password_require_special', '{"value": true}', 'Require special characters in password'),
  ('session_timeout', '{"value": 3600}', 'Session timeout in seconds'),
  ('max_login_attempts', '{"value": 5}', 'Maximum failed login attempts before lockout'),
  ('lockout_duration', '{"value": 900}', 'Account lockout duration in seconds')
ON CONFLICT (setting_key) DO NOTHING;
