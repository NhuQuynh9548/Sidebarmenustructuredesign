/*
  # Enable Public Access to Tables

  Allow anonymous users to access tables without authentication
  This is needed for development and testing
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view business units" ON business_units;
DROP POLICY IF EXISTS "Admins can insert business units" ON business_units;
DROP POLICY IF EXISTS "Admins can update business units" ON business_units;
DROP POLICY IF EXISTS "Admins can delete business units" ON business_units;

-- Create new public policies for business_units
CREATE POLICY "Public can view business units"
  ON business_units FOR SELECT
  USING (true);

CREATE POLICY "Public can insert business units"
  ON business_units FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update business units"
  ON business_units FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete business units"
  ON business_units FOR DELETE
  USING (true);

-- Update transactions policies
DROP POLICY IF EXISTS "Authenticated users can view transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can delete transactions" ON transactions;

CREATE POLICY "Public can view transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Public can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update transactions"
  ON transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete transactions"
  ON transactions FOR DELETE
  USING (true);

-- Update employees policies
DROP POLICY IF EXISTS "Authenticated users can view employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can update employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can delete employees" ON employees;

CREATE POLICY "Public can view employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Public can insert employees"
  ON employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update employees"
  ON employees FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete employees"
  ON employees FOR DELETE
  USING (true);

-- Update partners policies
DROP POLICY IF EXISTS "Authenticated users can view partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can insert partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can update partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can delete partners" ON partners;

CREATE POLICY "Public can view partners"
  ON partners FOR SELECT
  USING (true);

CREATE POLICY "Public can insert partners"
  ON partners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update partners"
  ON partners FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete partners"
  ON partners FOR DELETE
  USING (true);

-- Update users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

CREATE POLICY "Public can view users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Public can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update users"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete users"
  ON users FOR DELETE
  USING (true);

-- Update master_data policies
DROP POLICY IF EXISTS "Authenticated users can view master data" ON master_data;
DROP POLICY IF EXISTS "Admins can insert master data" ON master_data;
DROP POLICY IF EXISTS "Admins can update master data" ON master_data;
DROP POLICY IF EXISTS "Admins can delete master data" ON master_data;

CREATE POLICY "Public can view master data"
  ON master_data FOR SELECT
  USING (true);

CREATE POLICY "Public can insert master data"
  ON master_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update master data"
  ON master_data FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete master data"
  ON master_data FOR DELETE
  USING (true);