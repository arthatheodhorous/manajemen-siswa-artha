-- ========================================================
-- SCHEMA DATABASE & RLS POLICIES UNTUK MANAJEMEN SISWA
-- ========================================================
-- Jalankan query berikut di Supabase SQL Editor:
-- Dashboard Supabase -> SQL Editor -> New Query

-- Enable UUID extension jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. TABEL: kelas
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. TABEL: siswa
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(150) NOT NULL,
    nis VARCHAR(30) NOT NULL UNIQUE,
    kelas VARCHAR(50) NOT NULL,
    kelas_id UUID REFERENCES public.kelas(id) ON DELETE SET NULL,
    jenis_kelamin VARCHAR(1) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    tanggal_lahir DATE,
    alamat TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. TABEL: pelanggaran
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pelanggaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES public.siswa(id) ON DELETE CASCADE,
    nama_siswa VARCHAR(150) NOT NULL,
    nis VARCHAR(30) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    jenis_pelanggaran VARCHAR(150) NOT NULL,
    tingkat VARCHAR(10) NOT NULL CHECK (tingkat IN ('Ringan', 'Sedang', 'Berat')),
    poin INTEGER NOT NULL DEFAULT 0,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    waktu TIME NOT NULL DEFAULT CURRENT_TIME,
    lokasi TEXT,
    deskripsi TEXT,
    foto TEXT,
    status VARCHAR(10) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Selesai')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. TABEL: users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) & CRUD POLICIES
-- ========================================================

-- Aktifkan RLS pada semua tabel
ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pelanggaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- POLICIES UNTUK TABEL: kelas
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Enable full access for anon and authenticated users on kelas" ON public.kelas;
CREATE POLICY "Enable full access for anon and authenticated users on kelas"
ON public.kelas
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- --------------------------------------------------------
-- POLICIES UNTUK TABEL: siswa
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Enable full access for anon and authenticated users on siswa" ON public.siswa;
CREATE POLICY "Enable full access for anon and authenticated users on siswa"
ON public.siswa
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- --------------------------------------------------------
-- POLICIES UNTUK TABEL: pelanggaran
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Enable full access for anon and authenticated users on pelanggaran" ON public.pelanggaran;
CREATE POLICY "Enable full access for anon and authenticated users on pelanggaran"
ON public.pelanggaran
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- --------------------------------------------------------
-- POLICIES UNTUK TABEL: users
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Enable full access for anon and authenticated users on users" ON public.users;
CREATE POLICY "Enable full access for anon and authenticated users on users"
ON public.users
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- --------------------------------------------------------
-- DATA SEED AWAL
-- --------------------------------------------------------
INSERT INTO public.kelas (nama) VALUES 
('X RPL 1'),
('X RPL 2'),
('XI RPL 1'),
('XI RPL 2'),
('XII RPL 1'),
('XII RPL 2')
ON CONFLICT (nama) DO NOTHING;

INSERT INTO public.users (name, email, password, role) VALUES 
('Admin Sekolah', 'admin@sekolah.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;
