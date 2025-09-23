-- Insert sample tenant
INSERT INTO public.tenants (id, name, slug) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Acme Corporation', 'acme-corp')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample organizations
INSERT INTO public.organizations (id, tenant_id, name, slug) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Engineering', 'engineering'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Marketing', 'marketing'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Sales', 'sales')
ON CONFLICT (tenant_id, slug) DO NOTHING;
