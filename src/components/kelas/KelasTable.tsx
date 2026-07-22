"use client";

import React from "react";
import { Kelas } from "@/types/kelas";

interface KelasTableProps {
  data: Kelas[];
  totalDataCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (kelas: Kelas) => void;
  onDelete: (id: string) => void;
}

export default function KelasTable({
  data,
  totalDataCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: KelasTableProps) {
  const totalPages = Math.ceil(totalDataCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCount = Math.min(itemsPerPage, data.length);

  return (
    <div className="w-full overflow-hidden">
      {/* Responsive Table Container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-3.5 px-4 text-center text-[11px] font-bold text-slate-400 tracking-wider uppercase w-20">
                NO
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                NAMA
              </th>
              <th className="py-3.5 px-4 text-center text-[11px] font-bold text-slate-400 tracking-wider uppercase w-40">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-slate-400 font-medium"
                >
                  Data kelas tidak ditemukan.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const globalIndex = startIndex + index + 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition duration-150 group"
                  >
                    {/* NO in blue color as per Image 1 */}
                    <td className="py-3.5 px-4 text-center font-bold text-blue-500">
                      {globalIndex}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.nama}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button (Yellow) */}
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 rounded-lg bg-[#eab308] hover:bg-yellow-600 text-white font-semibold text-[11px] transition shadow-2xs cursor-pointer active:scale-95"
                        >
                          Edit
                        </button>
                        {/* Hapus Button (Red) */}
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-3 py-1 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white font-semibold text-[11px] transition shadow-2xs cursor-pointer active:scale-95"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-slate-100 text-xs">
        <div className="text-slate-500 font-medium">
          Menampilkan {displayedCount} dari {totalDataCount} data
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <span>&lt; Sebelumnya</span>
          </button>

          {/* Page indicator */}
          <div className="flex items-center gap-1 px-2">
            <span className="font-semibold text-slate-800">
              {currentPage}
            </span>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-500">{totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <span>Berikutnya &gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
