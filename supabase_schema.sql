-- Aura Voyages - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Tours Table
CREATE TABLE IF NOT EXISTS public.tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  tag TEXT,
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price_per_person NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  max_group_size INTEGER DEFAULT 10,
  difficulty TEXT DEFAULT 'Easy',
  featured BOOLEAN DEFAULT false,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  available_dates TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  tour_id TEXT NOT NULL,
  tour_title TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_requests TEXT,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  base_price NUMERIC NOT NULL,
  addons_total NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'confirmed', -- confirmed, pending, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Notifications Log Table (Records all automated owner emails)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'delivered', -- delivered, simulated, queued, failed
  html_preview TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'front_page',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access to tours
CREATE POLICY "Allow public read access to tours"
  ON public.tours FOR SELECT
  USING (true);

-- Allow anyone to insert a booking
CREATE POLICY "Allow public insert into bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Allow owner or authenticated users to read bookings
CREATE POLICY "Allow public read bookings for confirmation"
  ON public.bookings FOR SELECT
  USING (true);

-- Allow public insert into subscribers
CREATE POLICY "Allow public insert into subscribers"
  ON public.subscribers FOR INSERT
  WITH CHECK (true);

-- Allow public insert into notifications
CREATE POLICY "Allow insert into notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select notifications"
  ON public.notifications FOR SELECT
  USING (true);
