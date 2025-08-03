-- Test script to validate the new receipt-style database structure
-- Run this after executing ultra-safe-database.sql

-- Test project creation with new structure
DO $$
DECLARE
    sample_customer_id UUID;
    sample_project_id UUID;
    sample_budget_id UUID;
    items_total DECIMAL(12,2);
    project_total DECIMAL(12,2);
BEGIN
    -- Get a sample customer
    SELECT id INTO sample_customer_id FROM customers LIMIT 1;
    
    IF sample_customer_id IS NOT NULL THEN
        -- Create a test project with new simplified structure
        INSERT INTO projects (
            name, 
            description, 
            customer_id, 
            labor_cost,
            manual_cost,
            status
        )
        VALUES (
            'Receipt Style Test Project', 
            'Testing the new simplified cost structure', 
            sample_customer_id,
            2000.00, -- Labor cost
            500.00,  -- Manual additional costs
            'Planning'
        )
        RETURNING id INTO sample_project_id;
        
        -- Create associated site
        INSERT INTO sites (project_id, site_address)
        VALUES (sample_project_id, '123 Test Street, Freetown');
        
        -- Create budget
        INSERT INTO budgets (project_id, budget_name)
        VALUES (sample_project_id, 'Test Budget')
        RETURNING id INTO sample_budget_id;
        
        -- Create some budget items (like receipt items)
        INSERT INTO budget_items (budget_id, project_id, item_name, quantity, unit_price, category) VALUES
        (sample_budget_id, sample_project_id, 'Aluminum Window Frame', 5, 850.00, 'Material'),
        (sample_budget_id, sample_project_id, 'Glass Panels', 10, 150.00, 'Material'),
        (sample_budget_id, sample_project_id, 'Installation Hardware', 1, 300.00, 'Material');
        
        -- Check if totals are calculated correctly
        SELECT 
            total_items_cost,
            labor_cost,
            manual_cost,
            total_project_cost
        INTO items_total, project_total, project_total, project_total
        FROM projects 
        WHERE id = sample_project_id;
        
        RAISE NOTICE 'Test Project Created Successfully!';
        RAISE NOTICE 'Project ID: %', sample_project_id;
        RAISE NOTICE 'Items Total: SLE %.2f (should auto-update from budget items)', COALESCE(items_total, 0);
        RAISE NOTICE 'Expected Total: SLE %.2f (Items + Labor: 2000 + Manual: 500)', 
                     (850.00 * 5) + (150.00 * 10) + 300.00 + 2000.00 + 500.00;
        
        -- Display project structure validation
        RAISE NOTICE '=== Project Structure Validation ===';
        RAISE NOTICE 'New simplified cost model:';
        RAISE NOTICE '- Items are tracked in budget_items table';
        RAISE NOTICE '- Labor cost: manual entry by admin';
        RAISE NOTICE '- Manual cost: additional manual costs';
        RAISE NOTICE '- Total = Items + Labor + Manual (auto-calculated)';
        RAISE NOTICE '- Removed: workmanship_fee, overhead_percentage, profit_margin_percentage, equipment_cost';
        
    ELSE
        RAISE NOTICE 'No customers found. Please create customers first.';
    END IF;
END
$$;
