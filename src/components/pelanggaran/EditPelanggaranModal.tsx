"use client";

import React, { useState, useEffect } from "react";
import { Pelanggaran, PelanggaranFormData } from "@/types/pelanggaran";
import { Siswa } from "@/types/siswa";
import PelanggaranForm from "./PelanggaranForm";

interface EditPelanggaranModalProps {
  isOpen: boolean;
  pelanggaran: Pelanggaran | null;
  onClose: () => void;
  onSave: (id: string, data: PelanggaranFormData) => void;
  siswaList?: Siswa[];
}

export default function EditPelanggaranModal({
  isOpen,
  pelanggaran,
  onClose,
  onSave,
  siswaList,
}: EditPelanggaranModalProps) {
  const [formData, setFormData] = useState<PelanggaranFormData>({
    namaSiswa: "",
    nis: "",
    kelas: "",
    jenisPelanggaran: "",
    tingkat: "",
    poin: 0,
    tanggal: "",
    waktu: "",
    lokasi: "",
    deskripsi: "",
    foto: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (pelanggaran) {
      setFormData({
        namaSiswa: pelanggaran.namaSiswa,
        nis: pelanggaran.nis,
        kelas: pelanggaran.kelas,
        jenisPelanggaran: pelanggaran.jenisPelanggaran,
        tingkat: pelanggaran.tingkat,
        poin: pelanggaran.poin,
        tanggal: pelanggaran.tanggal,
        waktu: pelanggaran.waktu || "",
        lokasi: pelanggaran.lokasi || "",
        deskripsi: pelanggaran.deskripsi || "",
        foto: pelanggaran.foto || "",
        status: pelanggaran.status || "Aktif",
      });
    }
  }, [pelanggaran]);

  if (!isOpen || !pelanggaran) return null;

  const handleChange = (data: Partial<PelanggaranFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaSiswa.trim()) { setErrorMsg("Siswa wajib dipilih!"); return; }
    if (!formData.jenisPelanggaran.trim()) { setErrorMsg("Jenis Pelanggaran wajib diisi!"); return; }
    if (!formData.tingkat) { setErrorMsg("Tingkat wajib dipilih!"); return; }
    if (!formData.tanggal) { setErrorMsg("Tanggal wajib diisi!"); return; }

    onSave(pelanggaran.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Edit Pelanggaran</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ubah informasi data pelanggaran.</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 pt-3">
            <PelanggaranForm
              formData={formData}
              onChange={handleChange}
              errorMsg={errorMsg}
              siswaList={siswaList}
              showStatus={true}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 p-6 pt-4 border-t border-slate-100 flex-shrink-0">
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
