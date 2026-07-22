"use client";

import React, { useState } from "react";
import { Pelanggaran } from "@/types/pelanggaran";

interface PelanggaranTableProps {
  data: Pelanggaran[];
  totalDataCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onDetail: (pelanggaran: Pelanggaran) => void;
  onEdit: (pelanggaran: Pelanggaran) => void;
  onDelete: (id: string) => void;
}

const TINGKAT_CONFIG = {
  Ringan: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  Sedang: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Berat: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
};

const STATUS_CONFIG = {
  Aktif: { bg: "bg-red-100", text: "text-red-700" },
  Selesai: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

function ActionDropdown({
  pelanggaran,
  onDetail,
  onEdit,
  onDelete,
}: {
  pelanggaran: Pelanggaran;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer active:scale-95"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-40 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/80 py-1 w-32 animate-in fade-in zoom-in-95 duration-100">
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              onDetail();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detail
          </div>
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              onEdit();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </div>
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              onDelete();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </div>
        </div>
      )}
    </div>
  );
}

export default function PelanggaranTable({
  data,
  totalDataCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: PelanggaranTableProps) {
  const totalPages = Math.ceil(totalDataCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCount = Math.min(itemsPerPage, data.length);

  return (
    <div className="w-full overflow-hidden">
      {/* Responsive Table Container */}
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-3 px-3 text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase w-10">No</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Nama Siswa</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">NIS</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Kelas</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Jenis Pelanggaran</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">Tingkat</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">Poin</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Tanggal</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">Foto</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">Status</th>
              <th className="py-3 px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                  Data pelanggaran tidak ditemukan.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const globalIndex = startIndex + index + 1;
                const tingkatCfg = TINGKAT_CONFIG[item.tingkat];
                const statusCfg = STATUS_CONFIG[item.status];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition duration-150 group">
                    <td className="py-3 px-3 text-center font-bold text-blue-500">{globalIndex}</td>
                    <td
                      onClick={() => onDetail(item)}
                      className="py-3 px-3 font-semibold text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {item.namaSiswa}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{item.nis}</td>
                    <td className="py-3 px-3 font-semibold text-blue-500 whitespace-nowrap">{item.kelas}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{item.jenisPelanggaran}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tingkatCfg.bg} ${tingkatCfg.text} ${tingkatCfg.border}`}>
                        {item.tingkat}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{item.poin}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">{item.tanggal}</td>
                    <td className="py-3 px-3 text-center">
                      {item.foto ? (
                        <button
                          type="button"
                          onClick={() => onDetail(item)}
                          title="Lihat Foto Bukti"
                          className="p-1 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition cursor-pointer"
                        >
                          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <ActionDropdown
                        pelanggaran={item}
                        onDetail={() => onDetail(item)}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item.id)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-4 border-t border-slate-100 text-xs">
        <div className="text-slate-500 font-medium">
          Menampilkan {displayedCount} dari {totalDataCount} data
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            &lt; Sebelumnya
          </button>
          <div className="flex items-center gap-1 px-2">
            <span className="font-semibold text-slate-800">{currentPage}</span>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-500">{totalPages}</span>
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Berikutnya &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
