/*
  # Recreate Tables Without RLS

  Drop and recreate all tables without RLS enabled
*/

-- Drop all tables
DROP TABLE IF EXISTS business_units CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS master_data CASCADE;
DROP VIEW IF EXISTS dashboard_summary CASCADE;

-- Recreate business_units
CREATE TABLE business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bu_code text UNIQUE NOT NULL,
  bu_name text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'active',
  director text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recreate employees
CREATE TABLE employees (
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

-- Recreate partners
CREATE TABLE partners (
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

-- Recreate transactions
CREATE TABLE transactions (
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

-- Recreate users
CREATE TABLE users (
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

-- Recreate master_data
CREATE TABLE master_data (
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

-- Insert sample data
INSERT INTO business_units (bu_code, bu_name, description, status, director) VALUES
  ('BU001', 'BlueBolt G&A', 'General & Administration', 'active', 'Nguyễn Văn A'),
  ('BU002', 'BlueBolt R&D', 'Research & Development', 'active', 'Trần Thị B'),
  ('BU003', 'BlueBolt Academy', 'Training & Education', 'active', 'Lê Văn C'),
  ('BU004', 'BlueBolt Services', 'Services Division', 'active', 'Phạm Văn D'),
  ('BU005', 'BlueBolt Software', 'Software Development', 'active', 'Hoàng Thị E');