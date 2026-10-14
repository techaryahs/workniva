-- WorkNiva Administrator Provisioning Migration
-- Run this script in the Supabase Dashboard SQL Editor if manual provisioning is preferred.

-- 1. Ensure the profile for admin.workniva@gmail.com is assigned the 'admin' role
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin.workniva@gmail.com';

-- 2. If the user was just created in auth.users and has no profile yet, insert a profile
INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'WorkNiva Administrator'),
  email,
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin.workniva@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', updated_at = NOW();

-- 3. Confirm the admin status
SELECT id, email, full_name, role, updated_at 
FROM public.profiles 
WHERE email = 'admin.workniva@gmail.com';
