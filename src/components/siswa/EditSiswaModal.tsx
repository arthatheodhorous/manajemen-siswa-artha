"use client";

import React, { useState, useEffect } from "react";
import { Siswa, SiswaFormData } from "@/types/siswa";

interface EditSiswaModalProps {
  isOpen: boolean;
  siswa: Siswa | null;
  onClose: () => void;
  onSave: (id: string | number, data: SiswaFormData) => void;
  kelasOptions?: string[];
}

const DEFAULT_KELAS_OPTIONS = [
  "X RPL 1",
  "X RPL 2",
  "XI RPL 1",
  "XI RPL 2",
  "XII RPL 1",
  "XII RPL 2",
];

export default function EditSiswaModal({
  isOpen,
  siswa,
  onClose,
  onSave,
  kelasOptions,
}: EditSiswaModalProps) {
  const activeKelasOptions = kelasOptions && kelasOptions.length > 0 ? kelasOptions : DEFAULT_KELAS_OPTIONS;

  const [formData, setFormData] = useState<SiswaFormData>({
    nama: "",
    nis: "",
    tanggalLahir: "",
    alamat: "",
    kelas: "",
    jenisKelamin: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (siswa) {
      setFormData({
        nama: siswa.nama || "",
        nis: siswa.nis || "",
        tanggalLahir: siswa.tanggalLahir || "",
        alamat: siswa.alamat || "",
        kelas: siswa.kelas || "",
        jenisKelamin: siswa.jenisKelamin || "",
      });
    }
  }, [siswa]);

  if (!isOpen || !siswa) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      setErrorMsg("Nama lengkap wajib diisi!");
      return;
    }
    if (!formData.nis.trim()) {
      setErrorMsg("NIS wajib diisi!");
      return;
    }
    if (!formData.tanggalLahir) {
      setErrorMsg("Tanggal lahir wajib diisi!");
      return;
    }

    onSave(siswa.id, formData);
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Edit Siswa</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah data informasi siswa.
            </p>
          </div>
          <button
            onClick={onClose}
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
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Nama */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition"
              />
            </div>

            {/* NIS */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIS
              </label>
              <input
                type="text"
                name="nis"
                value={formData.nis}
                onChange={handleChange}
                placeholder="Masukkan NIS"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition"
              />
            </div>

            {/* Kelas Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas
              </label>
              <div className="relative">
                <select
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition appearance-none bg-white cursor-pointer pr-9"
                >
                  <option value="" disabled className="text-slate-400">
                    Pilih Kelas
                  </option>
                  {activeKelasOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Jenis Kelamin Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Kelamin
              </label>
              <div className="relative">
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition appearance-none bg-white cursor-pointer pr-9"
                >
                  <option value="" disabled className="text-slate-400">
                    Pilih Jenis Kelamin
                  </option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 p-6 border-t border-slate-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1a56db] hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
