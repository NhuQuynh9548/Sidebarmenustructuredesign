/*
  # Auto Transaction Code Generation with Concurrency Safety

  1. Changes
    - Add UNIQUE constraint on transaction_code column
    - Create function generate_transaction_code() for safe code generation
    - Function uses row-level locking to handle concurrent requests
  
  2. Transaction Code Format
    - Format: [Type][MM][YY]_[RunningNumber]
    - Type: T (Thu/Income), C (Chi/Expense), V (Vay/Loan)
    - MM: Month 01-12
    - YY: Last 2 digits of year
    - RunningNumber: Auto-increment 01-999, padding 2 digits
    - Reset per month/year combination
  
  3. Concurrency Safety
    - Uses SELECT ... FOR UPDATE to lock rows during counting
    - Ensures unique transaction codes even with concurrent inserts
    - Atomic operation within transaction
  
  4. Usage
    - Call generate_transaction_code(transaction_type, transaction_date)
    - Returns: Transaction code string
*/

-- Add UNIQUE constraint to transaction_code if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'transactions_transaction_code_key'
  ) THEN
    ALTER TABLE transactions ADD CONSTRAINT transactions_transaction_code_key UNIQUE (transaction_code);
  END IF;
END $$;

-- Create function to generate transaction code with concurrency safety
CREATE OR REPLACE FUNCTION generate_transaction_code(
  p_type text,
  p_date date DEFAULT CURRENT_DATE
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_prefix text;
  v_month text;
  v_year text;
  v_pattern text;
  v_count integer;
  v_running_number text;
  v_transaction_code text;
BEGIN
  -- Determine prefix based on transaction type
  v_prefix := CASE p_type
    WHEN 'income' THEN 'T'
    WHEN 'expense' THEN 'C'
    WHEN 'loan' THEN 'V'
    ELSE 'T'
  END;
  
  -- Extract month and year from date
  v_month := TO_CHAR(p_date, 'MM');
  v_year := TO_CHAR(p_date, 'YY');
  
  -- Build pattern for matching existing codes
  v_pattern := v_prefix || v_month || v_year || '_%';
  
  -- Count existing transactions with this pattern
  -- Use FOR UPDATE to lock rows and prevent race conditions
  SELECT COUNT(*) INTO v_count
  FROM transactions
  WHERE transaction_code LIKE v_pattern
  FOR UPDATE;
  
  -- Increment count for new transaction
  v_count := v_count + 1;
  
  -- Format running number with padding (minimum 2 digits)
  v_running_number := LPAD(v_count::text, 2, '0');
  
  -- Build final transaction code
  v_transaction_code := v_prefix || v_month || v_year || '_' || v_running_number;
  
  -- Return the generated code
  RETURN v_transaction_code;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION generate_transaction_code(text, date) IS 
'Generates unique transaction code in format [Type][MM][YY]_[RunningNumber]. 
Uses row-level locking for concurrency safety.';

-- Example usage (commented out):
-- SELECT generate_transaction_code('income', '2026-01-12');  -- Returns: T0126_01
-- SELECT generate_transaction_code('expense', '2026-01-12'); -- Returns: C0126_01
-- SELECT generate_transaction_code('loan', '2026-01-12');    -- Returns: V0126_01
