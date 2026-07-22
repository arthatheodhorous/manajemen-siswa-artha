"use client";

import React, { useState } from "react";

interface PelanggaranFilterHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onOpenTambahModal: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  // Filter props
  filterTanggalMulai: string;
  filterTanggalSelesai: string;
  filterStatus: string;
  filterTingkat: string;
  filterJenis: string;
  onFilterTanggalMulaiChange: (v: string) => void;
  onFilterTanggalSelesaiChange: (v: string) => void;
  onFilterStatusChange: (v: string) => void;
  onFilterTingkatChange: (v: string) => void;
  onFilterJenisChange: (v: string) => void;
  onResetFilters: () => void;
  totalData: number;
  filteredCount: number;
  jenisOptions: string[];
}

export default function PelanggaranFilterHeader({
  searchQuery,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onOpenTambahModal,
  onExportExcel,
  onExportPdf,
  filterTanggalMulai,
  filterTanggalSelesai,
  filterStatus,
  filterTingkat,
  filterJenis,
  onFilterTanggalMulaiChange,
  onFilterTanggalSelesaiChange,
  onFilterStatusChange,
  onFilterTingkatChange,
  onFilterJenisChange,
  onResetFilters,
  totalData,
  filteredCount,
  jenisOptions,
}: PelanggaranFilterHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilter =
    filterTanggalMulai || filterTanggalSelesai || filterStatus || filterTingkat || filterJenis;

  const activeCount = [
    filterTanggalMulai,
    filterTanggalSelesai,
    filterStatus,
    filterTingkat,
    filterJenis,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: Export buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onExportExcel}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold transition cursor-pointer shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button
          onClick={onExportPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold transition cursor-pointer shadow-sm shadow-rose-500/20 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Row 2: Search + Filter toggle + Reset + items per page + Tambah */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search + Filter button + Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px] sm:w-56">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-xs"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-xs select-none ${
              isFilterOpen || hasActiveFilter
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
            {/* Badge showing active filter count */}
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Reset button */}
          {hasActiveFilter && (
            <button
              onClick={() => { onResetFilters(); setIsFilterOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* Right: rows per page + tambah */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none appearance-none cursor-pointer pr-7 shadow-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={onOpenTambahModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#1a56db] hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            + Tambah Pelanggaran
          </button>
        </div>
      </div>

      {/* Row 3: Data count */}
      <p className="text-xs font-semibold text-slate-500">
        {filteredCount} dari {totalData} data
        {hasActiveFilter && (
          <span className="ml-2 inline-flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 text-[10px] font-bold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {activeCount} filter aktif
          </span>
        )}
      </p>

      {/* Collapsible Filter Panel */}
      {isFilterOpen && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Panel Filter
            </p>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {/* Tanggal Mulai */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filterTanggalMulai}
                onChange={(e) => onFilterTanggalMulaiChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-xs cursor-pointer"
              />
            </div>

            {/* Tanggal Selesai */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={filterTanggalSelesai}
                onChange={(e) => onFilterTanggalSelesaiChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-xs cursor-pointer"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => onFilterStatusChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none appearance-none transition shadow-xs cursor-pointer"
                >
                  <option value="">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tingkat */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                Tingkat Pelanggaran
              </label>
              <div className="relative">
                <select
                  value={filterTingkat}
                  onChange={(e) => onFilterTingkatChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none appearance-none transition shadow-xs cursor-pointer"
                >
                  <option value="">Semua Tingkat</option>
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Berat">Berat</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Jenis Pelanggaran */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                Jenis Pelanggaran
              </label>
              <div className="relative">
                <select
                  value={filterJenis}
                  onChange={(e) => onFilterJenisChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none appearance-none transition shadow-xs cursor-pointer"
                >
                  <option value="">Semua Jenis</option>
                  {jenisOptions.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action: Apply / Reset inside panel */}
          {hasActiveFilter && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => { onResetFilters(); setIsFilterOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
