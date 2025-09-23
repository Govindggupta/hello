-- Profiles policies - users can only see and manage their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Organization memberships policies - users can only see memberships for organizations they belong to
CREATE POLICY "memberships_select_own_orgs" ON public.organization_memberships
  FOR SELECT USING (
    user_id = auth.uid() OR 
    organization_id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "memberships_insert_admin_manager" ON public.organization_memberships
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "memberships_update_admin_manager" ON public.organization_memberships
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "memberships_delete_admin_manager" ON public.organization_memberships
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Organizations policies - users can only see organizations they belong to
CREATE POLICY "organizations_select_member" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "organizations_insert_admin" ON public.organizations
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT DISTINCT o.tenant_id FROM public.organizations o
      JOIN public.organization_memberships om ON o.id = om.organization_id
      WHERE om.user_id = auth.uid() AND om.role = 'admin'
    )
  );

CREATE POLICY "organizations_update_admin" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "organizations_delete_admin" ON public.organizations
  FOR DELETE USING (
    id IN (
      SELECT organization_id FROM public.organization_memberships 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Tenants policies - users can only see tenants for organizations they belong to
CREATE POLICY "tenants_select_member" ON public.tenants
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT o.tenant_id FROM public.organizations o
      JOIN public.organization_memberships om ON o.id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );
