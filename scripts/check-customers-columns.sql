-- Step 1: Run this first to see what columns exist in your customers table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: See sample data
SELECT * FROM customers LIMIT 2;
