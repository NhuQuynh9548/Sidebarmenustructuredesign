/*
  # Add function to get payment methods with transaction count

  1. Changes
    - Create RPC function get_payment_methods_with_count()
    - Returns payment methods with transaction_count field
    - Counts transactions based on payment_method name matching

  2. Purpose
    - Used by Master Data > Payment Methods page
    - Shows how many transactions use each payment method
    - Prevents deletion of payment methods in use
*/

-- Create function to get payment methods with transaction count
CREATE OR REPLACE FUNCTION get_payment_methods_with_count()
RETURNS TABLE (
  id uuid,
  code text,
  name text,
  description text,
  account_info jsonb,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  transaction_count bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    pm.id,
    pm.code,
    pm.name,
    pm.description,
    pm.account_info,
    pm.status,
    pm.created_at,
    pm.updated_at,
    COUNT(t.id) as transaction_count
  FROM payment_methods pm
  LEFT JOIN transactions t ON t.payment_method = pm.name
  GROUP BY pm.id, pm.code, pm.name, pm.description, pm.account_info, pm.status, pm.created_at, pm.updated_at
  ORDER BY pm.created_at DESC;
$$;

-- Add comment
COMMENT ON FUNCTION get_payment_methods_with_count() IS 
'Returns all payment methods with count of transactions using each method. 
Used by Master Data > Payment Methods page to show usage and prevent deletion of methods in use.';
