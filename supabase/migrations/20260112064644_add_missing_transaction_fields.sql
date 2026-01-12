/*
  # Add Missing Fields to Transactions Table

  1. Changes to transactions table
    - Add `approval_status` column (draft, pending, approved, rejected, cancelled)
    - Add `object_type` column (partner or employee)
    - Add `object_name` column (replaces partner_name, more generic)
    - Add `project_code` column (for project linking)
    - Add `cost_allocation` column (direct or indirect)
    - Add `allocation_rule` column (for indirect cost allocation)
    - Add `attachments_count` column (number of attached files)
    - Add `rejection_reason` column (for rejected transactions)
    - Add `payment_status` column (replaces status)

  2. Data Migration
    - Set existing records to approved status
    - Migrate partner_name to object_name
    - Set object_type to 'partner' for existing records
*/

-- Add new columns
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS object_type text DEFAULT 'partner',
  ADD COLUMN IF NOT EXISTS object_name text,
  ADD COLUMN IF NOT EXISTS project_code text,
  ADD COLUMN IF NOT EXISTS cost_allocation text DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS allocation_rule text,
  ADD COLUMN IF NOT EXISTS attachments_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';

-- Migrate existing data
UPDATE transactions 
SET 
  object_name = partner_name,
  object_type = 'partner',
  approval_status = 'approved',
  payment_status = COALESCE(status, 'unpaid')
WHERE object_name IS NULL;

-- Drop old columns
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'status') THEN
    ALTER TABLE transactions DROP COLUMN status;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'partner_name') THEN
    ALTER TABLE transactions DROP COLUMN partner_name;
  END IF;
END $$;

-- Add check constraints
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_approval_status') THEN
    ALTER TABLE transactions ADD CONSTRAINT check_approval_status 
      CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected', 'cancelled'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_object_type') THEN
    ALTER TABLE transactions ADD CONSTRAINT check_object_type 
      CHECK (object_type IN ('partner', 'employee'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_cost_allocation') THEN
    ALTER TABLE transactions ADD CONSTRAINT check_cost_allocation 
      CHECK (cost_allocation IN ('direct', 'indirect'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_payment_status') THEN
    ALTER TABLE transactions ADD CONSTRAINT check_payment_status 
      CHECK (payment_status IN ('paid', 'unpaid'));
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_approval_status ON transactions(approval_status);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_business_unit ON transactions(business_unit);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
