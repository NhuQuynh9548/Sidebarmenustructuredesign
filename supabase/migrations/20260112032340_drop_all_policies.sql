/*
  # Drop All Policies

  Remove all RLS policies to allow unrestricted access
*/

-- Drop all policies from business_units
DROP POLICY IF EXISTS "Public can view business units" ON business_units;
DROP POLICY IF EXISTS "Public can insert business units" ON business_units;
DROP POLICY IF EXISTS "Public can update business units" ON business_units;
DROP POLICY IF EXISTS "Public can delete business units" ON business_units;

-- Drop all policies from transactions
DROP POLICY IF EXISTS "Public can view transactions" ON transactions;
DROP POLICY IF EXISTS "Public can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Public can update transactions" ON transactions;
DROP POLICY IF EXISTS "Public can delete transactions" ON transactions;

-- Drop all policies from employees
DROP POLICY IF EXISTS "Public can view employees" ON employees;
DROP POLICY IF EXISTS "Public can insert employees" ON employees;
DROP POLICY IF EXISTS "Public can update employees" ON employees;
DROP POLICY IF EXISTS "Public can delete employees" ON employees;

-- Drop all policies from partners
DROP POLICY IF EXISTS "Public can view partners" ON partners;
DROP POLICY IF EXISTS "Public can insert partners" ON partners;
DROP POLICY IF EXISTS "Public can update partners" ON partners;
DROP POLICY IF EXISTS "Public can delete partners" ON partners;

-- Drop all policies from users
DROP POLICY IF EXISTS "Public can view users" ON users;
DROP POLICY IF EXISTS "Public can insert users" ON users;
DROP POLICY IF EXISTS "Public can update users" ON users;
DROP POLICY IF EXISTS "Public can delete users" ON users;

-- Drop all policies from master_data
DROP POLICY IF EXISTS "Public can view master data" ON master_data;
DROP POLICY IF EXISTS "Public can insert master data" ON master_data;
DROP POLICY IF EXISTS "Public can update master data" ON master_data;
DROP POLICY IF EXISTS "Public can delete master data" ON master_data;