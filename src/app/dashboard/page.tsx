"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SiswaView, { INITIAL_SISWA_DATA } from "@/components/siswa/SiswaView";
import KelasView, { INITIAL_KELAS_DATA } from "@/components/kelas/KelasView";
import PelanggaranView from "@/components/pelanggaran/PelanggaranView";
import { Siswa } from "@/types/siswa";
import { Kelas } from "@/types/kelas";

import { getSiswa, getKelas, getPelanggaran } from "@/lib/dataService";
import { Pelanggaran } from "@/types/pelanggaran";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin Sekolah");
  const [userEmail, setUserEmail] = useState("admin@sekolah.com");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredBirthBarIndex, setHoveredBirthBarIndex] = useState<number | null>(null);
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [hoveredTrenIndex, setHoveredTrenIndex] = useState<{ idx: number; type: "selesai" | "pelangg" } | null>(null);

  // Central Siswa State shared across Siswa tab and Pelanggaran tab
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);

  // Central Kelas State shared across Kelas tab and Siswa tab
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // Central Pelanggaran State
  const [pelanggaranList, setPelanggaranList] = useState<Pelanggaran[]>([]);

  // Load Siswa, Kelas, & Pelanggaran data from Supabase database on client mount
  useEffect(() => {
    async function loadData() {
      const [fetchedSiswa, fetchedKelas, fetchedPelanggaran] = await Promise.all([
        getSiswa(),
        getKelas(),
        getPelanggaran(),
      ]);
      setSiswaList(fetchedSiswa);
      setKelasList(fetchedKelas);
      setPelanggaranList(fetchedPelanggaran);
    }
    loadData();
  }, []);

  const handleSiswaListChange = (newList: Siswa[]) => {
    setSiswaList(newList);
  };

  const handleKelasListChange = (newList: Kelas[]) => {
    setKelasList(newList);
  };

  // Auth Check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Dynamic calculation for class distribution (Siswa per Kelas)
  const classDistribution = useMemo(() => {
    return kelasList.map((k) => {
      const siswaInKelas = siswaList.filter((s) => s.kelas === k.nama);
      const laki = siswaInKelas.filter((s) => s.jenisKelamin === "L").length;
      const perempuan = siswaInKelas.filter((s) => s.jenisKelamin === "P").length;
      return { name: k.nama, laki, perempuan, total: laki + perempuan };
    });
  }, [kelasList, siswaList]);

  // Dynamic maximum for scaling bar chart cleanly
  const maxBarValue = useMemo(() => {
    let max = 1;
    classDistribution.forEach((item: { laki: number; perempuan: number }) => {
      if (item.laki > max) max = item.laki;
      if (item.perempuan > max) max = item.perempuan;
    });
    return Math.max(max, 4);
  }, [classDistribution]);

  // Dynamic totals for gender ratio pie chart
  const totalLaki = useMemo(() => siswaList.filter((s) => s.jenisKelamin === "L").length, [siswaList]);
  const totalPerempuan = useMemo(() => siswaList.filter((s) => s.jenisKelamin === "P").length, [siswaList]);
  const totalSiswaCount = siswaList.length || 1;
  const lakiPercentage = ((totalLaki / totalSiswaCount) * 100).toFixed(1);
  const perempuanPercentage = ((totalPerempuan / totalSiswaCount) * 100).toFixed(1);

  // Data for "Jenis Pelanggaran"
  const typesOfViolations = [
    { name: "Terlambat Masuk Kelas", value: 3, color: "bg-[#ef4444]" },
    { name: "Tidak Mengerjakan Tugas", value: 2, color: "bg-[#f97316]" },
    { name: "Membolos", value: 2, color: "bg-[#f59e0b]" },
    { name: "Seragam Tidak Lengkap", value: 2, color: "bg-[#eab308]" },
    { name: "Menggunakan HP saat Pelajaran", value: 1, color: "bg-[#10b981]" },
  ];

  // Data for "Tingkat Pelanggaran"
  const violationLevels = [
    { name: "Ringan", value: 7, color: "bg-[#10b981]" },
    { name: "Sedang", value: 3, color: "bg-[#3b82f6]" },
    { name: "Berat", value: 2, color: "bg-[#ef4444]" },
  ];

  // Data for "Pelanggaran Terbanyak"
  const topViolationsByClass = [
    { className: "X RPL 1", count: 3 },
    { className: "XI RPL 1", count: 3 },
    { className: "X RPL 2", count: 2 },
    { className: "XII RPL 1", count: 2 },
    { className: "XI RPL 2", count: 1 },
    { className: "XII RPL 2", count: 1 },
  ];

  // Data for "Distribusi Tahun Kelahiran Siswa"
  const birthYearDistribution = [
    { year: "2007", count: 6, percentage: "33.3%", color: "bg-[#3b82f6]" },
    { year: "2006", count: 5, percentage: "27.8%", color: "bg-[#8b5cf6]" },
    { year: "2008", count: 5, percentage: "27.8%", color: "bg-[#f59e0b]" },
    { year: "2009", count: 2, percentage: "11.1%", color: "bg-[#10b981]" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 font-sans">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center px-6 gap-3 mt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a56db] text-white shadow-md shadow-blue-500/10 font-bold text-sm">
            MS
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-wide">
            Manajemen Siswa
          </span>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#1a56db] text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("siswa")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 cursor-pointer ${
              activeTab === "siswa"
                ? "bg-[#1a56db] text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Siswa
          </button>

          <button
            onClick={() => setActiveTab("kelas")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 cursor-pointer ${
              activeTab === "kelas"
                ? "bg-[#1a56db] text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Kelas
          </button>

          <button
            onClick={() => setActiveTab("pelanggaran")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 cursor-pointer ${
              activeTab === "pelanggaran"
                ? "bg-[#1a56db] text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
              />
            </svg>
            Pelanggaran
          </button>
        </nav>


      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-slate-800">
              SMK Negeri 2 Malang | Artha Maulia Theodhorous
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Badge with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer select-none"
              >
                <div className="h-7 w-7 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  {getInitials(userName)}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{userName}</span>
                <svg
                  className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  {/* Click outside overlay to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-800">{userName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{userEmail}</p>
                    </div>
                    <hr className="border-slate-100 my-2" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50/70 active:bg-red-100/50 transition cursor-pointer"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
          {activeTab === "siswa" && (
            <SiswaView
              siswaList={siswaList}
              onSiswaListChange={handleSiswaListChange}
              kelasList={kelasList}
            />
          )}

          {activeTab === "kelas" && (
            <KelasView
              kelasList={kelasList}
              onKelasListChange={handleKelasListChange}
            />
          )}

          {activeTab === "pelanggaran" && (
            <PelanggaranView siswaList={siswaList} />
          )}

          {activeTab === "dashboard" && (
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Dashboard Siswa</h2>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Siswa Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-medium text-slate-400">Total Siswa</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{siswaList.length}</h3>
                    <span className="text-xs text-blue-600 font-semibold mt-1 block">Siswa Terdaftar</span>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-blue-500/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>

                {/* Kelas Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-medium text-slate-400">Total Kelas</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{kelasList.length}</h3>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 block">Kelas Aktif</span>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-md shadow-emerald-500/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Rata-Rata Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-medium text-slate-400">Rata-Rata per Kelas</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">
                      {(siswaList.length / (kelasList.length || 1)).toFixed(1)}
                    </h3>
                    <span className="text-xs text-amber-600 font-semibold mt-1 block">Siswa per kelas</span>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-md shadow-amber-500/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                {/* Pelanggaran Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-medium text-slate-400">Pelanggaran</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{pelanggaranList.length}</h3>
                    <span className="text-xs text-rose-600 font-semibold mt-1 block">Total Pelanggaran</span>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-[#ef4444] text-white flex items-center justify-center shadow-md shadow-red-500/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Section 1: Siswa per Kelas & Jenis Kelamin */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Siswa per Kelas - Clean Bar Chart like reference image */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                      </svg>
                      <h4 className="text-sm font-bold text-slate-800">Siswa per Kelas</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
                      Gender Distribution
                    </span>
                  </div>

                  {/* SVG Chart Area */}
                  <div className="relative w-full" style={{ height: 280 }}>
                    <svg width="100%" height="100%" viewBox="0 0 580 260" preserveAspectRatio="none">
                      {/* Y-axis grid lines and labels */}
                      {Array.from({ length: maxBarValue + 1 }).map((_, tick) => {
                        const y = 15 + ((maxBarValue - tick) / maxBarValue) * 210;
                        return (
                          <g key={tick}>
                            <line x1="40" y1={y} x2="575" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                            <text x="34" y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="600">{tick}</text>
                          </g>
                        );
                      })}

                      {/* X-axis baseline */}
                      <line x1="40" y1="225" x2="575" y2="225" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Bars */}
                      {classDistribution.map((item: { name: string; laki: number; perempuan: number; total: number }, index: number) => {
                        const totalCols = classDistribution.length;
                        const slotWidth = 535 / totalCols;
                        const slotX = 40 + index * slotWidth;
                        const barGroupWidth = slotWidth * 0.7;
                        const barGroupX = slotX + (slotWidth - barGroupWidth) / 2;
                        const singleBarW = barGroupWidth / 2 - 2;
                        const chartH = 210;
                        const baseY = 225;

                        const lakiH = maxBarValue > 0 ? (item.laki / maxBarValue) * chartH : 0;
                        const perempuanH = maxBarValue > 0 ? (item.perempuan / maxBarValue) * chartH : 0;
                        const isHovered = hoveredBarIndex === index;

                        return (
                          <g
                            key={index}
                            onMouseEnter={() => setHoveredBarIndex(index)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Hover background */}
                            {isHovered && (
                              <rect x={barGroupX - 4} y={15} width={barGroupWidth + 8} height={210} rx="4" fill="#f8fafc" />
                            )}

                            {/* Laki bar */}
                            {item.laki > 0 && (
                              <>
                                <text
                                  x={barGroupX + singleBarW / 2}
                                  y={baseY - lakiH - 5}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fontWeight="700"
                                  fill="#3b82f6"
                                >
                                  {item.laki}
                                </text>
                                <rect
                                  x={barGroupX}
                                  y={baseY - lakiH}
                                  width={singleBarW}
                                  height={lakiH}
                                  rx="3"
                                  fill={isHovered ? "#2563eb" : "#3b82f6"}
                                />
                              </>
                            )}

                            {/* Perempuan bar */}
                            {item.perempuan > 0 && (
                              <>
                                <text
                                  x={barGroupX + singleBarW + 4 + singleBarW / 2}
                                  y={baseY - perempuanH - 5}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fontWeight="700"
                                  fill="#ec4899"
                                >
                                  {item.perempuan}
                                </text>
                                <rect
                                  x={barGroupX + singleBarW + 4}
                                  y={baseY - perempuanH}
                                  width={singleBarW}
                                  height={perempuanH}
                                  rx="3"
                                  fill={isHovered ? "#db2777" : "#ec4899"}
                                />
                              </>
                            )}

                            {/* X-axis label */}
                            <text
                              x={slotX + slotWidth / 2}
                              y="244"
                              textAnchor="middle"
                              fontSize="10"
                              fill="#64748b"
                              fontWeight="600"
                            >
                              {item.name}
                            </text>

                            {/* Tooltip */}
                            {isHovered && (
                              <g>
                                <rect
                                  x={Math.min(barGroupX - 8, 450)}
                                  y={baseY - Math.max(lakiH, perempuanH) - 72}
                                  width="120"
                                  height="68"
                                  rx="8"
                                  fill="white"
                                  stroke="#e2e8f0"
                                  strokeWidth="1"
                                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))"
                                />
                                <rect
                                  x={Math.min(barGroupX - 8, 450)}
                                  y={baseY - Math.max(lakiH, perempuanH) - 72}
                                  width="4"
                                  height="68"
                                  rx="2"
                                  fill="#3b82f6"
                                />
                                <text x={Math.min(barGroupX - 8, 450) + 12} y={baseY - Math.max(lakiH, perempuanH) - 54} fontSize="11" fontWeight="700" fill="#1e293b">{item.name}</text>
                                <text x={Math.min(barGroupX - 8, 450) + 12} y={baseY - Math.max(lakiH, perempuanH) - 36} fontSize="10" fill="#3b82f6" fontWeight="600">Laki-Laki : {item.laki}</text>
                                <text x={Math.min(barGroupX - 8, 450) + 12} y={baseY - Math.max(lakiH, perempuanH) - 18} fontSize="10" fill="#ec4899" fontWeight="600">Perempuan : {item.perempuan}</text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center justify-center gap-6 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 bg-[#3b82f6] rounded-[3px]"></div>
                      <span className="text-xs font-semibold text-slate-500">Laki-Laki</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 bg-[#ec4899] rounded-[3px]"></div>
                      <span className="text-xs font-semibold text-slate-500">Perempuan</span>
                    </div>
                  </div>
                </div>

                {/* Jenis Kelamin - Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between items-center text-center overflow-hidden">
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-sm font-bold text-slate-800">Jenis Kelamin</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
                      Total Ratio
                    </span>
                  </div>

                  {/* SVG Donut Pie Chart with hover tooltip */}
                  {(() => {
                    const cx = 110, cy = 110, r = 72, innerR = 46;
                    const total = totalLaki + totalPerempuan;
                    const segments = [
                      { label: "Laki-Laki", count: totalLaki, pct: lakiPercentage, color: "#3b82f6", hoverColor: "#2563eb" },
                      { label: "Perempuan", count: totalPerempuan, pct: perempuanPercentage, color: "#ec4899", hoverColor: "#db2777" },
                    ];
                    let startAngle = -90;

                    const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
                      const toRad = (d: number) => (d * Math.PI) / 180;
                      const x1 = cx + r * Math.cos(toRad(startDeg));
                      const y1 = cy + r * Math.sin(toRad(startDeg));
                      const x2 = cx + r * Math.cos(toRad(endDeg));
                      const y2 = cy + r * Math.sin(toRad(endDeg));
                      const largeArc = endDeg - startDeg > 180 ? 1 : 0;
                      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
                    };

                    const describeDonutSlice = (cx: number, cy: number, r: number, ir: number, startDeg: number, endDeg: number) => {
                      const toRad = (d: number) => (d * Math.PI) / 180;
                      const x1 = cx + r * Math.cos(toRad(startDeg));
                      const y1 = cy + r * Math.sin(toRad(startDeg));
                      const x2 = cx + r * Math.cos(toRad(endDeg));
                      const y2 = cy + r * Math.sin(toRad(endDeg));
                      const ix1 = cx + ir * Math.cos(toRad(endDeg));
                      const iy1 = cy + ir * Math.sin(toRad(endDeg));
                      const ix2 = cx + ir * Math.cos(toRad(startDeg));
                      const iy2 = cy + ir * Math.sin(toRad(startDeg));
                      const largeArc = endDeg - startDeg > 180 ? 1 : 0;
                      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
                    };

                    return (
                      <div className="relative w-full flex flex-col items-center">
                        <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
                          {segments.map((seg, i) => {
                            const sweep = total > 0 ? (seg.count / total) * 360 : 0;
                            const endAngle = startAngle + sweep;
                            const midAngle = startAngle + sweep / 2;
                            const toRad = (d: number) => (d * Math.PI) / 180;
                            // Label line & text position
                            const labelR = r + 22;
                            const lx = cx + labelR * Math.cos(toRad(midAngle));
                            const ly = cy + labelR * Math.sin(toRad(midAngle));
                            // Line start on arc edge
                            const lineStart = { x: cx + (r + 4) * Math.cos(toRad(midAngle)), y: cy + (r + 4) * Math.sin(toRad(midAngle)) };

                            const isHov = hoveredPieIndex === i;
                            const slicePath = describeDonutSlice(cx, cy, isHov ? r + 6 : r, isHov ? innerR - 4 : innerR, startAngle, endAngle);
                            const slice = { startAngle, endAngle };
                            startAngle = endAngle;

                            // Tooltip position
                            const tx = cx + (r + 30) * Math.cos(toRad(midAngle)) - 55;
                            const ty = cy + (r + 30) * Math.sin(toRad(midAngle)) - 30;

                            return (
                              <g
                                key={i}
                                onMouseEnter={() => setHoveredPieIndex(i)}
                                onMouseLeave={() => setHoveredPieIndex(null)}
                                style={{ cursor: "pointer", transition: "all 0.2s" }}
                              >
                                <path
                                  d={slicePath}
                                  fill={isHov ? seg.hoverColor : seg.color}
                                  stroke="white"
                                  strokeWidth="2"
                                  style={{ transition: "all 0.18s ease" }}
                                />

                                {/* Label line */}
                                {sweep > 15 && (
                                  <>
                                    <line
                                      x1={lineStart.x} y1={lineStart.y}
                                      x2={lx} y2={ly}
                                      stroke={seg.color} strokeWidth="1.5"
                                    />
                                    <text
                                      x={lx + (lx > cx ? 4 : -4)}
                                      y={ly + 4}
                                      textAnchor={lx > cx ? "start" : "end"}
                                      fontSize="11"
                                      fontWeight="700"
                                      fill={seg.color}
                                    >
                                      {seg.pct}%
                                    </text>
                                  </>
                                )}

                                {/* Tooltip */}
                                {isHov && (
                                  <g>
                                    <rect
                                      x={Math.min(Math.max(tx, 0), 100)}
                                      y={Math.min(Math.max(ty, 0), 160)}
                                      width="120"
                                      height="66"
                                      rx="8"
                                      fill="white"
                                      stroke="#e2e8f0"
                                      strokeWidth="1"
                                      filter="drop-shadow(0 4px 14px rgba(0,0,0,0.14))"
                                    />
                                    <rect
                                      x={Math.min(Math.max(tx, 0), 100)}
                                      y={Math.min(Math.max(ty, 0), 160)}
                                      width="4"
                                      height="66"
                                      rx="2"
                                      fill={seg.color}
                                    />
                                    <text x={Math.min(Math.max(tx, 0), 100) + 12} y={Math.min(Math.max(ty, 0), 160) + 18} fontSize="11" fontWeight="700" fill="#1e293b">{seg.label}</text>
                                    <text x={Math.min(Math.max(tx, 0), 100) + 12} y={Math.min(Math.max(ty, 0), 160) + 36} fontSize="11" fill={seg.color} fontWeight="600">Jumlah : {seg.count} siswa</text>
                                    <text x={Math.min(Math.max(tx, 0), 100) + 12} y={Math.min(Math.max(ty, 0), 160) + 54} fontSize="11" fill="#64748b" fontWeight="500">Porsi : {seg.pct}%</text>
                                  </g>
                                )}
                              </g>
                            );
                          })}

                          {/* Center label */}
                          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e293b">{total}</text>
                          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">Total Siswa</text>
                        </svg>

                        {/* Pie Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 w-full border-t border-slate-50 pt-4">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="h-3 w-3 shrink-0 bg-[#3b82f6] rounded-[3px]"></div>
                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Laki-Laki ({totalLaki})</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="h-3 w-3 shrink-0 bg-[#ec4899] rounded-[3px]"></div>
                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Perempuan ({totalPerempuan})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Section 2: Tren Pelanggaran & Jenis Pelanggaran */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Tren Pelanggaran Siswa - Area Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3 flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <h4 className="text-sm font-bold text-slate-800">Tren Pelanggaran Siswa</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
                      6 Bulan Terakhir
                    </span>
                  </div>

                  {/* SVG Area Chart - Interactive */}
                  {(() => {
                    const months = ["Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
                    const dataSelesai  = [2, 2, 2, 2, 1, 0];
                    const dataPelangg  = [0, 0, 0, 0, 1, 2];

                    const W = 500, H = 190;
                    const padL = 30, padR = 10, padT = 18, padB = 24;
                    const chartW = W - padL - padR;
                    const chartH = H - padT - padB;
                    const maxVal = 2;

                    const toX = (i: number) => padL + (i / (months.length - 1)) * chartW;
                    const toY = (v: number) => padT + chartH - (v / maxVal) * chartH;

                    const lineStr = (data: number[]) =>
                      data.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

                    const areaStr = (data: number[], color: string) => {
                      const line = lineStr(data);
                      return `${line} L ${toX(data.length - 1)} ${toY(0)} L ${toX(0)} ${toY(0)} Z`;
                    };

                    return (
                      <div className="relative w-full" style={{ height: 240 }}>
                        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
                          <defs>
                            <linearGradient id="grad-green2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="grad-red2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Grid lines */}
                          {[0, 0.5, 1, 1.5, 2].map((v, i) => (
                            <g key={i}>
                              <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
                              <text x={padL - 6} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#cbd5e1" fontWeight="700">{v}</text>
                            </g>
                          ))}

                          {/* X axis */}
                          <line x1={padL} y1={toY(0)} x2={W - padR} y2={toY(0)} stroke="#e2e8f0" strokeWidth="1" />

                          {/* Area fills */}
                          <path d={areaStr(dataSelesai, "#10b981")} fill="url(#grad-green2)" />
                          <path d={areaStr(dataPelangg, "#ef4444")} fill="url(#grad-red2)" />

                          {/* Lines */}
                          <path d={lineStr(dataSelesai)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
                          <path d={lineStr(dataPelangg)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" />

                          {/* X axis month labels */}
                          {months.map((m, i) => (
                            <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">{m}</text>
                          ))}

                          {/* Interactive points */}
                          {months.map((m, i) => (
                            <g key={i}>
                              {/* Green point */}
                              <circle
                                cx={toX(i)} cy={toY(dataSelesai[i])} r="5"
                                fill="#10b981" stroke="white" strokeWidth="2"
                                style={{ cursor: "crosshair" }}
                                onMouseEnter={() => setHoveredTrenIndex({ idx: i, type: "selesai" })}
                                onMouseLeave={() => setHoveredTrenIndex(null)}
                              />
                              {/* Red point */}
                              <circle
                                cx={toX(i)} cy={toY(dataPelangg[i])} r="5"
                                fill="#ef4444" stroke="white" strokeWidth="2"
                                style={{ cursor: "crosshair" }}
                                onMouseEnter={() => setHoveredTrenIndex({ idx: i, type: "pelangg" })}
                                onMouseLeave={() => setHoveredTrenIndex(null)}
                              />

                              {/* Tooltip for green point */}
                              {hoveredTrenIndex?.idx === i && hoveredTrenIndex?.type === "selesai" && (
                                <g>
                                  <rect
                                    x={Math.min(toX(i) - 60, W - 140)}
                                    y={toY(dataSelesai[i]) - 72}
                                    width="130" height="64"
                                    rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"
                                    filter="drop-shadow(0 4px 14px rgba(0,0,0,0.13))"
                                  />
                                  <rect x={Math.min(toX(i) - 60, W - 140)} y={toY(dataSelesai[i]) - 72} width="4" height="64" rx="2" fill="#10b981" />
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataSelesai[i]) - 54} fontSize="10" fontWeight="700" fill="#1e293b">Bulan {m} 2026</text>
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataSelesai[i]) - 36} fontSize="10" fill="#10b981" fontWeight="600">Diselesaikan : {dataSelesai[i]}</text>
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataSelesai[i]) - 18} fontSize="10" fill="#64748b" fontWeight="500">Pelanggaran  : {dataPelangg[i]}</text>
                                </g>
                              )}

                              {/* Tooltip for red point */}
                              {hoveredTrenIndex?.idx === i && hoveredTrenIndex?.type === "pelangg" && (
                                <g>
                                  <rect
                                    x={Math.min(toX(i) - 60, W - 140)}
                                    y={toY(dataPelangg[i]) - 72}
                                    width="130" height="64"
                                    rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"
                                    filter="drop-shadow(0 4px 14px rgba(0,0,0,0.13))"
                                  />
                                  <rect x={Math.min(toX(i) - 60, W - 140)} y={toY(dataPelangg[i]) - 72} width="4" height="64" rx="2" fill="#ef4444" />
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataPelangg[i]) - 54} fontSize="10" fontWeight="700" fill="#1e293b">Bulan {m} 2026</text>
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataPelangg[i]) - 36} fontSize="10" fill="#ef4444" fontWeight="600">Pelanggaran  : {dataPelangg[i]}</text>
                                  <text x={Math.min(toX(i) - 60, W - 140) + 12} y={toY(dataPelangg[i]) - 18} fontSize="10" fill="#64748b" fontWeight="500">Diselesaikan : {dataSelesai[i]}</text>
                                </g>
                              )}
                            </g>
                          ))}
                        </svg>
                      </div>
                    );
                  })()}

                  {/* Chart Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-[#10b981]"></span>
                      <span className="text-xs font-semibold text-slate-500">Diselesaikan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-[#ef4444]"></span>
                      <span className="text-xs font-semibold text-slate-500">Pelanggaran</span>
                    </div>
                  </div>
                </div>

                {/* Jenis Pelanggaran - List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h4 className="text-sm font-bold text-slate-800">Jenis Pelanggaran</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
                      Top 5
                    </span>
                  </div>

                  {/* List */}
                  <div className="flex-1 flex flex-col gap-3 justify-center py-2">
                    {typesOfViolations.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.color}`}></div>
                          <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Total */}
                  <div className="border-t border-slate-50 pt-4 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Total Pelanggaran</span>
                    <span>12</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Tingkat Pelanggaran, Pelanggaran Terbanyak, & Distribusi Kelahiran */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Tingkat Pelanggaran - List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h4 className="text-sm font-bold text-slate-800">Tingkat Pelanggaran</h4>
                  </div>

                  <div className="flex-1 flex flex-col gap-4.5 justify-center py-2">
                    {violationLevels.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.color}`}></div>
                          <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-0.5 rounded-md">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pelanggaran Terbanyak - Rombel Rank */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-3 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-sm font-bold text-slate-800">Pelanggaran Terbanyak</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 flex-1 py-1">
                    {topViolationsByClass.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                        <div className="flex items-center gap-3.5">
                          <span className="h-5.5 w-5.5 rounded-full bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{item.className}</span>
                        </div>
                        <span className="h-6 w-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md shadow-red-500/10">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: Distribusi Tahun Kelahiran Siswa */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-sm font-bold text-slate-800">Distribusi Tahun Kelahiran Siswa</h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
                    {birthYearDistribution.length} Tahun Kelahiran
                  </span>
                </div>

                {/* SVG Bar Chart */}
                <div className="w-full relative" style={{ height: 360 }}>
                  <svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="none">
                    {(() => {
                      const maxCount = Math.max(...birthYearDistribution.map((d: { count: number }) => d.count), 1);
                      const ySteps = 4;
                      const stepVal = Math.ceil(maxCount / ySteps);
                      const topVal = stepVal * ySteps;
                      const chartH = 240;
                      const baseY = 280;
                      const chartX = 40;
                      const chartW = 750;
                      const totalBars = birthYearDistribution.length;
                      const slotW = chartW / totalBars;
                      const barW = Math.min(slotW * 0.5, 90);

                      return (
                        <>
                          {/* Y-axis grid lines + labels */}
                          {Array.from({ length: ySteps + 1 }).map((_, i) => {
                            const val = stepVal * (ySteps - i);
                            const y = baseY - (val / topVal) * chartH;
                            return (
                              <g key={i}>
                                <line x1={chartX} y1={y} x2={chartX + chartW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                <text x={chartX - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="600">{val}</text>
                              </g>
                            );
                          })}

                          {/* X-axis baseline */}
                          <line x1={chartX} y1={baseY} x2={chartX + chartW} y2={baseY} stroke="#e2e8f0" strokeWidth="1.5" />

                          {/* Bars */}
                          {birthYearDistribution.map((item: { year: string; count: number; percentage: string; color: string }, index: number) => {
                            const barH = (item.count / topVal) * chartH;
                            const slotX = chartX + index * slotW;
                            const barX = slotX + (slotW - barW) / 2;
                            const isHoveredBirth = hoveredBirthBarIndex === index;

                            return (
                              <g
                                key={index}
                                onMouseEnter={() => setHoveredBirthBarIndex(index)}
                                onMouseLeave={() => setHoveredBirthBarIndex(null)}
                                style={{ cursor: 'pointer' }}
                              >
                                {/* Hover overlay */}
                                {isHoveredBirth && (
                                  <rect
                                    x={barX - 8}
                                    y={20}
                                    width={barW + 16}
                                    height={baseY - 20}
                                    rx="4"
                                    fill="#eff6ff"
                                    opacity="0.6"
                                  />
                                )}

                                {/* Value label on top */}
                                <text
                                  x={slotX + slotW / 2}
                                  y={baseY - barH - 7}
                                  textAnchor="middle"
                                  fontSize="12"
                                  fontWeight="700"
                                  fill={isHoveredBirth ? "#1d4ed8" : "#3b82f6"}
                                >
                                  {item.count}
                                </text>
                                <rect
                                  x={barX}
                                  y={baseY - barH}
                                  width={barW}
                                  height={barH}
                                  rx="4"
                                  fill={isHoveredBirth ? "#2563eb" : "#3b82f6"}
                                />
                                {/* X label */}
                                <text
                                  x={slotX + slotW / 2}
                                  y={baseY + 20}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fill={isHoveredBirth ? "#1e40af" : "#64748b"}
                                  fontWeight="700"
                                >
                                  {item.year}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* HTML Tooltip Overlay (Prevents text stretching / gepeng) */}
                  {(() => {
                    if (hoveredBirthBarIndex === null) return null;
                    const item = birthYearDistribution[hoveredBirthBarIndex];
                    if (!item) return null;

                    const totalBars = birthYearDistribution.length;
                    const chartX = 40;
                    const chartW = 750;
                    const slotW = chartW / totalBars;
                    const slotCenterX = chartX + (hoveredBirthBarIndex + 0.5) * slotW;
                    const leftPct = (slotCenterX / 800) * 100;

                    const maxCount = Math.max(...birthYearDistribution.map((d: { count: number }) => d.count), 1);
                    const ySteps = 4;
                    const stepVal = Math.ceil(maxCount / ySteps);
                    const topVal = stepVal * ySteps;
                    const chartH = 240;
                    const baseY = 280;
                    const barH = (item.count / topVal) * chartH;
                    const topY = baseY - barH - 18;
                    const topPct = (topY / 320) * 100;

                    return (
                      <div
                        style={{
                          position: "absolute",
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          transform: "translate(-50%, -100%)",
                          pointerEvents: "none",
                          zIndex: 30,
                        }}
                        className="w-40 bg-white border border-slate-200/80 rounded-xl p-3 shadow-lg flex flex-col gap-1 transition-all duration-100 ease-out"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-xl" />
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">
                          Tahun {item.year}
                        </p>
                        <p className="text-[11px] text-blue-600 font-semibold leading-tight">
                          Jumlah: {item.count} siswa
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">
                          Persentase: {item.percentage}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Detail Distribusi - inline legend like reference image */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-500 mb-3">Detail Distribusi</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {birthYearDistribution.map((item: { year: string; count: number; percentage: string; color: string }, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.color}`}></div>
                        <span className="text-xs font-bold text-slate-700 w-10">{item.year}</span>
                        <span className="text-xs font-bold text-slate-800">{item.count}</span>
                        <span className="text-xs text-slate-400 font-semibold">{item.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
