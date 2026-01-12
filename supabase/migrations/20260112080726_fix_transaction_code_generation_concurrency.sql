/*
  # Fix Transaction Code Generation - Concurrency Safety

  1. Changes
    - Fix FOR UPDATE usage with aggregate functions error
    - Use advisory lock for atomic transaction code generation
    - Extract and increment running number properly
  
  2. Approach
    - Use pg_advisory_xact_lock for exclusive lock during code generation
    - Query existing codes and parse running numbers
    - Find max running number and increment
    - Ensures thread-safe operation
*/

-- Drop and recreate the function with proper concurrency handling
DROP FUNCTION IF EXISTS generate_transaction_code(text, date);

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
  v_lock_key bigint;
  v_max_number integer;
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
  
  -- Create a unique lock key based on prefix + month + year
  -- This ensures only one transaction can generate a code for this combination at a time
  v_lock_key := ('x' || md5(v_prefix || v_month || v_year))::bit(32)::bigint;
  
  -- Acquire advisory lock (automatically released at transaction end)
  PERFORM pg_advisory_xact_lock(v_lock_key);
  
  -- Find the maximum running number for this pattern
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(transaction_code FROM LENGTH(v_prefix || v_month || v_year || '_') + 1) 
      AS integer
    )
  ), 0) INTO v_max_number
  FROM transactions
  WHERE transaction_code LIKE v_pattern
    AND transaction_code ~ ('^' || v_prefix || v_month || v_year || '_[0-9]+$');
  
  -- Increment for new transaction
  v_max_number := v_max_number + 1;
  
  -- Format running number with padding (minimum 2 digits)
  v_running_number := LPAD(v_max_number::text, 2, '0');
  
  -- Build final transaction code
  v_transaction_code := v_prefix || v_month || v_year || '_' || v_running_number;
  
  -- Return the generated code
  RETURN v_transaction_code;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION generate_transaction_code(text, date) IS 
'Generates unique transaction code in format [Type][MM][YY]_[RunningNumber]. 
Uses advisory lock for concurrency safety.
Type: T=Income, C=Expense, V=Loan
Example: T0126_01 for first income transaction in January 2026';
