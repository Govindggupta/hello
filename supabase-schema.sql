-- Create profiles table to store user data linked to auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create organizations table to store organization details
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create org_members junction table to link multiple users to an organization
CREATE TABLE org_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(org_id, user_id)
);

-- Create projects table to store blue carbon project details
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location_text TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'verified', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create project_proofs table to store evidence for projects
CREATE TABLE project_proofs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL, -- URL to file in Supabase Storage
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_proofs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for organizations table
-- Allow organization owners to view their organization
CREATE POLICY "Owners can view own organization" ON organizations
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
    )
  );

-- Allow organization owners to update their organization
CREATE POLICY "Owners can update own organization" ON organizations
  FOR UPDATE USING (auth.uid() = owner_id);

-- Allow authenticated users to view approved organizations
CREATE POLICY "Authenticated users can view approved organizations" ON organizations
  FOR SELECT USING (status = 'approved');

-- Create RLS policies for org_members table
-- Allow organization owners to manage organization members
CREATE POLICY "Owners can manage organization members" ON org_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = org_members.org_id
      AND organizations.owner_id = auth.uid()
    )
  );

-- Allow organization members to view other members
CREATE POLICY "Members can view organization members" ON org_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_members.org_id
      AND org_members.user_id = auth.uid()
    )
  );

-- Create RLS policies for projects table
-- Allow organization owners to manage their projects
CREATE POLICY "Owners can manage organization projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = projects.org_id
      AND organizations.owner_id = auth.uid()
    )
  );

-- Allow organization members to view their organization's projects
CREATE POLICY "Members can view organization projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = projects.org_id
      AND org_members.user_id = auth.uid()
    )
  );

-- Allow authenticated users to view approved projects
CREATE POLICY "Authenticated users can view approved projects" ON projects
  FOR SELECT USING (status = 'approved');

-- Create RLS policies for project_proofs table
-- Allow organization owners to manage project proofs
CREATE POLICY "Owners can manage project proofs" ON project_proofs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN organizations ON organizations.id = projects.org_id
      WHERE projects.id = project_proofs.project_id
      AND organizations.owner_id = auth.uid()
    )
  );

-- Allow organization members to view project proofs
CREATE POLICY "Members can view project proofs" ON project_proofs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_members
      JOIN projects ON projects.org_id = org_members.org_id
      WHERE projects.id = project_proofs.project_id
      AND org_members.user_id = auth.uid()
    )
  );

-- Allow authenticated users to view proofs for approved projects
CREATE POLICY "Authenticated users can view proofs for approved projects" ON project_proofs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_proofs.project_id
      AND projects.status = 'approved'
    )
  );

-- Create function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create a profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();