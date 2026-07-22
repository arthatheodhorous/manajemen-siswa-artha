"use client";

import React from "react";

interface KelasFilterHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onOpenTambahModal: () => void;
}

export default function KelasFilterHeader({
  searchQuery,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onOpenTambahModal,
}: KelasFilterHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari..."
          className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* Actions Right */}
      <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
        {/* Rows per page */}
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none appearance-none cursor-pointer pr-7 shadow-2xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Button Tambah Kelas */}
        <button
          onClick={onOpenTambahModal}
          className="flex items-center gap-1.5 rounded-xl bg-[#1a56db] hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
        >
          <span>Tambah Kelas</span>
        </button>
      </div>
    </div>
  );
}
