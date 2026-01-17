-- Supabase SQL Schema for The Cut Collective

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'barber', 'owner')),
  shop_id UUID REFERENCES public.shops(id), -- Null if client
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id),
  barber_id UUID REFERENCES public.profiles(id),
  client_id UUID REFERENCES public.profiles(id),
  service_id UUID REFERENCES public.services(id),
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Shops
DROP POLICY IF EXISTS "Shops are viewable by everyone." ON public.shops;
CREATE POLICY "Shops are viewable by everyone." ON public.shops
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can update their shop." ON public.shops;
CREATE POLICY "Owners can update their shop." ON public.shops
  FOR UPDATE USING (
    auth.uid() = owner_id
  );

-- Appointments
DROP POLICY IF EXISTS "Staff can view shop appointments" ON public.appointments;
CREATE POLICY "Staff can view shop appointments" ON public.appointments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE shop_id = public.appointments.shop_id
    )
  );

DROP POLICY IF EXISTS "Clients can view their appointments" ON public.appointments;
CREATE POLICY "Clients can view their appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = client_id);

-- Services
DROP POLICY IF EXISTS "Services are viewable by everyone." ON public.services;
CREATE POLICY "Services are viewable by everyone." ON public.services
  FOR SELECT USING (true);
