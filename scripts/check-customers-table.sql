-- Check what columns exist in your customers table
-- Run this first to see the exact column names

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Sample customers data to see what's there
SELECT * FROM customers LIMIT 3;
