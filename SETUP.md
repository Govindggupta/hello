# Multi-Tenant Application Setup

This is a complete multi-tenant application with role-based access control, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication System**: Login/Signup with Supabase Auth
- **Multi-Tenant Architecture**: Organizations with tenant isolation
- **Role-Based Access Control**: Admin, Manager, Employee roles
- **Organization Management**: Create, join, and manage organizations
- **User Profile Management**: View and manage user profiles
- **Protected Routes**: Middleware-based authentication and authorization
- **Modern UI**: Built with Radix UI and Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: For development redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

### 3. Supabase Database Setup

You'll need to set up the following tables in your Supabase database:

#### Tables Required:

1. **tenants** - Top-level tenant organizations
2. **organizations** - Organizations within tenants
3. **profiles** - User profiles
4. **organization_memberships** - User-organization relationships with roles

#### SQL Schema:

```sql
-- Create tenants table
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_memberships table
CREATE TABLE organization_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security requirements)
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add more policies as needed for your use case
```

### 4. Run the Application

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Application Structure

- `/` - Home page with login/signup options
- `/auth/login` - User login
- `/auth/sign-up` - User registration
- `/dashboard` - Main dashboard (protected)
- `/profile` - User profile page (protected)
- `/organizations/[id]` - Organization details (protected)
- `/unauthorized` - Access denied page

## Role System

- **Admin**: Full access to organization management, can manage all users
- **Manager**: Can manage organization members, limited admin access
- **Employee**: Basic access to organization resources

## Development

The application uses:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components
- Supabase for authentication and database
- React Hook Form for form handling

## Notes

- Make sure to configure your Supabase project with the correct RLS policies
- The application assumes a specific database schema - adjust as needed
- Environment variables are required for the application to function
- The middleware handles authentication and redirects automatically
