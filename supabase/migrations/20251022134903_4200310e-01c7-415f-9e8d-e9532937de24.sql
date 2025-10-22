-- Create admin user
-- Note: You'll need to set the password in Supabase Dashboard after creation
-- Go to Authentication > Users and click on the user to set password

-- Insert admin role for the first user that will be created
-- This is a helper function to automatically assign admin role to new users
-- You can modify this later or create users manually

-- Create a function to help create admin users
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create the user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');

  RETURN 'Admin user created with ID: ' || new_user_id::TEXT;
END;
$$;

-- Create default admin user
-- Email: admin@carrentbaku.az
-- Password: admin123456
SELECT create_admin_user('admin@carrentbaku.az', 'admin123456');