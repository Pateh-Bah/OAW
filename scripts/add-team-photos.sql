-- Add sample team members with profile photos for testing
-- Execute this in your Supabase SQL Editor

-- Update existing employees with sample profile photos
UPDATE employees 
SET profile_photo_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
WHERE full_name = 'Mohamed Kamara';

UPDATE employees 
SET profile_photo_url = 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face'
WHERE full_name = 'Fatima Sesay';

UPDATE employees 
SET profile_photo_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
WHERE full_name = 'Ibrahim Conteh';

UPDATE employees 
SET profile_photo_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
WHERE full_name = 'Aminata Bangura';

UPDATE employees 
SET profile_photo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
WHERE full_name = 'Sallieu Mansaray';

-- Add a few more team members to make the team look complete
INSERT INTO employees (id, full_name, designation, department, badge_number, contact_info, profile_photo_url) VALUES
  (uuid_generate_v4(), 'Adama Koroma', 'Design Specialist', 'Design', 'OAW006', '{"phone": "+232-77-666-777", "emergency_contact": "+232-76-666-777"}', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'),
  (uuid_generate_v4(), 'Abdul Rahman', 'Workshop Supervisor', 'Production', 'OAW007', '{"phone": "+232-77-777-888", "emergency_contact": "+232-76-777-888"}', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face'),
  (uuid_generate_v4(), 'Hawa Turay', 'Finance Officer', 'Administration', 'OAW008', '{"phone": "+232-77-888-999", "emergency_contact": "+232-76-888-999"}', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face')
ON CONFLICT DO NOTHING;
