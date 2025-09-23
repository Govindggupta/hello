# Database Setup Guide

This guide will help you set up the complete database schema for the Multi-Tenant Application.

## 🗄️ **Database Setup Steps**

### **Step 1: Run the SQL Scripts in Order**

Go to your Supabase project dashboard → **SQL Editor** and run these scripts **in this exact order**:

#### **1. Create Tables and Basic Structure**
```sql
-- Run: scripts/001_create_tenants_and_organizations.sql
```
This creates:
- `tenants` table
- `organizations` table  
- `profiles` table
- `organization_memberships` table
- User role enum
- Indexes for performance

#### **2. Set Up Row Level Security (RLS)**
```sql
-- Run: scripts/002_create_rls_policies.sql
```
This creates security policies for:
- Users can only see their own profiles
- Users can only see organizations they belong to
- Only admins/managers can manage memberships
- Only admins can create/update/delete organizations

#### **3. Create User Profile Trigger**
```sql
-- Run: scripts/003_create_profile_trigger.sql
```
This creates:
- Function to automatically create user profiles on signup
- Trigger that runs when new users register

#### **4. Add Sample Data (Optional)**
```sql
-- Run: scripts/004_seed_sample_data.sql
```
This adds:
- Sample tenant: "Acme Corporation"
- Sample organizations: Engineering, Marketing, Sales

### **Step 2: Verify Setup**

After running all scripts, you should see these tables in your Supabase dashboard:

1. **tenants** - Top-level tenant organizations
2. **organizations** - Organizations within tenants
3. **profiles** - User profiles (linked to auth.users)
4. **organization_memberships** - User-organization relationships with roles

### **Step 3: Test the Application**

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Go to `http://localhost:3000`

3. Try signing up with a new account

4. Check that a profile is automatically created in the `profiles` table

## 🔐 **Security Features**

The database includes comprehensive Row Level Security (RLS) policies:

- **User Isolation**: Users can only see their own data
- **Organization Access**: Users can only access organizations they belong to
- **Role-Based Permissions**: 
  - **Admins**: Can manage organizations and all members
  - **Managers**: Can manage organization members
  - **Employees**: Can only view organization data

## 📊 **Database Schema Overview**

```
tenants (1) ──→ (many) organizations (1) ──→ (many) organization_memberships (many) ──→ (1) profiles
```

- **Tenants**: Top-level organizations (e.g., "Acme Corporation")
- **Organizations**: Departments within tenants (e.g., "Engineering", "Marketing")
- **Profiles**: User information linked to Supabase auth
- **Organization Memberships**: Many-to-many relationship with roles

## ⚠️ **Important Notes**

- **Run scripts in order**: Each script depends on the previous ones
- **RLS is enabled**: All tables have Row Level Security enabled
- **Automatic profile creation**: New users automatically get profiles created
- **Sample data is optional**: You can skip the seed script if you want to start fresh

## 🚀 **Next Steps**

After database setup:
1. Create your `.env.local` file with Supabase credentials
2. Start the development server
3. Test user registration and login
4. Create your first organization and invite users!
