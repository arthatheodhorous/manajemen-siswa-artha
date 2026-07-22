"use client";

import React, { useState } from "react";
import { KelasFormData } from "@/types/kelas";

interface TambahKelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KelasFormData) => void;
}

export default function TambahKelasModal({
  isOpen,
  onClose,
  onSave,
}: TambahKelasModalProps) {
  const [nama, setNama] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama kelas wajib diisi!");
      return;
    }

    onSave({ nama: nama.trim() });
    setNama("");
    setErrorMsg("");
  };

  const handleClose = () => {
    setNama("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tambah Kelas</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan masukkan data kelas baru.
            </p>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Nama Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Kelas
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Masukkan nama kelas"
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1a56db] hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
