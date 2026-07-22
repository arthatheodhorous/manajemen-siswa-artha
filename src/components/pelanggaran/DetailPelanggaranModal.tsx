"use client";

import React from "react";
import { Pelanggaran } from "@/types/pelanggaran";

const TINGKAT_CONFIG = {
  Ringan: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  Sedang: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  Berat: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
};

const STATUS_CONFIG = {
  Aktif: { bg: "bg-red-100", text: "text-red-700" },
  Selesai: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

interface DetailPelanggaranModalProps {
  isOpen: boolean;
  pelanggaran: Pelanggaran | null;
  onClose: () => void;
}

export default function DetailPelanggaranModal({
  isOpen,
  pelanggaran,
  onClose,
}: DetailPelanggaranModalProps) {
  if (!isOpen || !pelanggaran) return null;

  const tingkatCfg = TINGKAT_CONFIG[pelanggaran.tingkat];
  const statusCfg = STATUS_CONFIG[pelanggaran.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Detail Pelanggaran</h3>
            <p className="text-xs text-slate-500 mt-0.5">Informasi lengkap data pelanggaran siswa.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Siswa</p>
              <p className="text-sm font-semibold text-slate-800">{pelanggaran.namaSiswa}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">NIS</p>
              <p className="text-sm font-semibold text-slate-700">{pelanggaran.nis}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kelas</p>
              <p className="text-sm font-semibold text-blue-600">{pelanggaran.kelas}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal</p>
              <p className="text-sm font-semibold text-slate-700">{pelanggaran.tanggal}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Waktu</p>
              <p className="text-sm font-semibold text-slate-700">{pelanggaran.waktu || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi</p>
              <p className="text-sm font-semibold text-slate-700">{pelanggaran.lokasi || "-"}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jenis Pelanggaran</p>
            <p className="text-sm font-semibold text-slate-800">{pelanggaran.jenisPelanggaran}</p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tingkat</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${tingkatCfg.bg} ${tingkatCfg.text} ${tingkatCfg.border}`}>
                {pelanggaran.tingkat}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Poin</p>
              <p className="text-sm font-bold text-slate-800">{pelanggaran.poin}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                {pelanggaran.status}
              </span>
            </div>
          </div>

          {pelanggaran.deskripsi && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deskripsi</p>
              <p className="text-xs text-slate-600 leading-relaxed">{pelanggaran.deskripsi}</p>
            </div>
          )}

          {pelanggaran.foto && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Foto Bukti</p>
              <img
                src={pelanggaran.foto}
                alt="Foto bukti"
                className="w-full max-h-48 object-cover rounded-xl border border-slate-100"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
