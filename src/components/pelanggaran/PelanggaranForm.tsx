"use client";

import React, { useState, useEffect, useRef } from "react";
import { PelanggaranFormData, TingkatPelanggaran, StatusPelanggaran } from "@/types/pelanggaran";
import { Siswa } from "@/types/siswa";

// Fallback Siswa data if none provided
const FALLBACK_SISWA_DATA: Siswa[] = [
  { id: "1", nama: "Ahmad Rizki Pratama", nis: "2024001", kelas: "X RPL 1", jenisKelamin: "L", tanggalLahir: "2008-05-15" },
  { id: "2", nama: "Siti Nurhaliza", nis: "2024002", kelas: "X RPL 1", jenisKelamin: "P", tanggalLahir: "2008-08-21" },
  { id: "3", nama: "Budi Santoso", nis: "2024003", kelas: "X RPL 1", jenisKelamin: "L", tanggalLahir: "2009-01-10" },
  { id: "4", nama: "Dewi Lestari", nis: "2024004", kelas: "X RPL 2", jenisKelamin: "P", tanggalLahir: "2008-11-02" },
  { id: "5", nama: "Eko Prasetyo", nis: "2024005", kelas: "X RPL 2", jenisKelamin: "L", tanggalLahir: "2008-03-30" },
  { id: "6", nama: "Fitri Handayani", nis: "2024006", kelas: "X RPL 2", jenisKelamin: "P", tanggalLahir: "2009-02-14" },
  { id: "7", nama: "Galih Saputra", nis: "2023001", kelas: "XI RPL 1", jenisKelamin: "L", tanggalLahir: "2007-07-19" },
  { id: "8", nama: "Hana Salsabila", nis: "2023002", kelas: "XI RPL 1", jenisKelamin: "P", tanggalLahir: "2007-09-25" },
  { id: "9", nama: "Irfan Maulana", nis: "2023003", kelas: "XI RPL 1", jenisKelamin: "L", tanggalLahir: "2007-12-05" },
  { id: "10", nama: "Jihan Aulia", nis: "2023004", kelas: "XI RPL 2", jenisKelamin: "P", tanggalLahir: "2007-04-18" },
  { id: "11", nama: "Kiki Amalia", nis: "2023005", kelas: "XI RPL 2", jenisKelamin: "P", tanggalLahir: "2007-06-12" },
  { id: "12", nama: "Lukman Hakim", nis: "2023006", kelas: "XI RPL 2", jenisKelamin: "L", tanggalLahir: "2007-10-30" },
  { id: "13", nama: "Muhammad Fajar", nis: "2022001", kelas: "XII RPL 1", jenisKelamin: "L", tanggalLahir: "2006-02-14" },
  { id: "14", nama: "Nabila Putri", nis: "2022002", kelas: "XII RPL 1", jenisKelamin: "P", tanggalLahir: "2006-05-20" },
  { id: "15", nama: "Oktavia Ramadhani", nis: "2022003", kelas: "XII RPL 1", jenisKelamin: "P", tanggalLahir: "2006-10-08" },
  { id: "16", nama: "Panji Setiawan", nis: "2022004", kelas: "XII RPL 2", jenisKelamin: "L", tanggalLahir: "2006-01-25" },
  { id: "17", nama: "Qori Ananda", nis: "2022005", kelas: "XII RPL 2", jenisKelamin: "P", tanggalLahir: "2006-08-14" },
  { id: "18", nama: "Rian Ardianto", nis: "2022006", kelas: "XII RPL 2", jenisKelamin: "L", tanggalLahir: "2006-11-19" },
];

// Generate time options in 30-minute intervals
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

const TINGKAT_OPTIONS: TingkatPelanggaran[] = ["Ringan", "Sedang", "Berat"];
const JENIS_SUGGESTIONS = [
  "Terlambat Masuk Kelas",
  "Tidak Mengerjakan Tugas",
  "Membolos",
  "Seragam Tidak Lengkap",
  "Menggunakan HP saat Pelajaran",
  "Merokok",
  "Berkelahi",
  "Merusak Fasilitas Sekolah",
];

const POIN_BY_TINGKAT: Record<TingkatPelanggaran, number> = {
  Ringan: 5,
  Sedang: 15,
  Berat: 50,
};

interface PelanggaranFormProps {
  formData: PelanggaranFormData;
  onChange: (data: Partial<PelanggaranFormData>) => void;
  errorMsg: string;
  siswaList?: Siswa[];
  showStatus?: boolean;
}

export default function PelanggaranForm({ formData, onChange, errorMsg, siswaList, showStatus }: PelanggaranFormProps) {
  const [siswaSearch, setSiswaSearch] = useState(formData.namaSiswa || "");
  const [showSiswaDropdown, setShowSiswaDropdown] = useState(false);
  const [showJenisSuggestions, setShowJenisSuggestions] = useState(false);
  const [photoTab, setPhotoTab] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSiswaData = siswaList && siswaList.length > 0 ? siswaList : FALLBACK_SISWA_DATA;

  // Sync internal search input if formData.namaSiswa is updated externally (e.g. edit mode or reset)
  useEffect(() => {
    setSiswaSearch(formData.namaSiswa || "");
  }, [formData.namaSiswa]);

  const filteredSiswa = activeSiswaData.filter(
    (s) =>
      s.nama.toLowerCase().includes(siswaSearch.toLowerCase()) ||
      s.nis.includes(siswaSearch)
  );

  const filteredJenis = JENIS_SUGGESTIONS.filter((j) =>
    j.toLowerCase().includes((formData.jenisPelanggaran || "").toLowerCase())
  );

  const handleSelectSiswa = (siswa: Siswa) => {
    setSiswaSearch(siswa.nama);
    onChange({ namaSiswa: siswa.nama, nis: siswa.nis, kelas: siswa.kelas });
    setShowSiswaDropdown(false);
  };

  const handleSelectJenis = (jenis: string) => {
    onChange({ jenisPelanggaran: jenis });
    setShowJenisSuggestions(false);
  };

  const handleTingkatChange = (tingkat: TingkatPelanggaran) => {
    onChange({ tingkat, poin: POIN_BY_TINGKAT[tingkat] });
  };

  // Sync tab with initial foto format
  useEffect(() => {
    if (formData.foto) {
      if (formData.foto.startsWith("data:image")) {
        setPhotoTab("upload");
      } else if (formData.foto.startsWith("http")) {
        setPhotoTab("url");
      }
    }
  }, [formData.foto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress and resize image client-side to keep base64 payload small (~30-60KB) for Supabase
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          onChange({ foto: compressedDataUrl });
        } else {
          onChange({ foto: src });
        }
      };
      img.onerror = () => {
        onChange({ foto: src });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Siswa Search Autocomplete */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Siswa <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={siswaSearch}
            onChange={(e) => {
              const val = e.target.value;
              setSiswaSearch(val);
              // Check if typed value matches a known student exactly
              const matched = activeSiswaData.find((s) => s.nama.toLowerCase() === val.toLowerCase());
              if (matched) {
                onChange({ namaSiswa: matched.nama, nis: matched.nis, kelas: matched.kelas });
              } else {
                onChange({ namaSiswa: val });
              }
              setShowSiswaDropdown(true);
            }}
            onFocus={() => setShowSiswaDropdown(true)}
            onBlur={() => setTimeout(() => setShowSiswaDropdown(false), 200)}
            placeholder="Ketik nama atau NIS siswa..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
          />
          {showSiswaDropdown && filteredSiswa.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl divide-y divide-slate-50">
              {filteredSiswa.map((s) => (
                <div
                  key={s.id || s.nis}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents input blur before click registers!
                    handleSelectSiswa(s);
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-blue-50/70 transition cursor-pointer group"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-blue-600">{s.nama}</span>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span>NIS: {s.nis}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">{s.kelas}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Jenis Pelanggaran & Tingkat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Jenis Pelanggaran */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jenis Pelanggaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.jenisPelanggaran}
            onChange={(e) => {
              onChange({ jenisPelanggaran: e.target.value });
              setShowJenisSuggestions(true);
            }}
            onFocus={() => setShowJenisSuggestions(true)}
            onBlur={() => setTimeout(() => setShowJenisSuggestions(false), 200)}
            placeholder="Contoh: Terlambat, Tidak mengerjakan..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
          />
          {showJenisSuggestions && filteredJenis.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl divide-y divide-slate-50">
              {filteredJenis.map((j) => (
                <div
                  key={j}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectJenis(j);
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition cursor-pointer"
                >
                  {j}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tingkat */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tingkat <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.tingkat}
              onChange={(e) => handleTingkatChange(e.target.value as TingkatPelanggaran)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition appearance-none bg-white cursor-pointer pr-8 shadow-2xs"
            >
              <option value="" disabled>Pilih tingkat</option>
              {TINGKAT_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Poin & Tanggal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Poin</label>
          <input
            type="number"
            min={0}
            value={formData.poin}
            onChange={(e) => onChange({ poin: Number(e.target.value) })}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal</label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => onChange({ tanggal: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Waktu Dropdown & Lokasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Waktu</label>
          <div className="relative">
            <select
              value={formData.waktu}
              onChange={(e) => onChange({ waktu: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition appearance-none bg-white cursor-pointer pr-8 shadow-2xs"
            >
              <option value="">Pilih waktu</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi</label>
          <input
            type="text"
            value={formData.lokasi}
            onChange={(e) => onChange({ lokasi: e.target.value })}
            placeholder="Contoh: Ruang kelas, Kantin"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {/* Status Pelanggaran (Jika showStatus true / Edit mode) */}
      {showStatus && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Status Pelanggaran <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status || "Aktif"}
              onChange={(e) => onChange({ status: e.target.value as StatusPelanggaran })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition appearance-none bg-white cursor-pointer pr-8 shadow-2xs"
            >
              <option value="Aktif">Aktif (Belum Ditindaklanjuti)</option>
              <option value="Selesai">Selesai (Sudah Ditindaklanjuti)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Deskripsi */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi</label>
        <textarea
          value={formData.deskripsi}
          onChange={(e) => onChange({ deskripsi: e.target.value })}
          rows={2}
          placeholder="Deskripsi detail pelanggaran"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition resize-none shadow-2xs"
        />
      </div>

      {/* Foto Bukti (Responsive Tabs & Upload/URL) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">Foto Bukti</label>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setPhotoTab("url")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                photoTab === "url" ? "bg-white text-blue-600 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              URL Link
            </button>
            <button
              type="button"
              onClick={() => setPhotoTab("upload")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                photoTab === "upload" ? "bg-white text-blue-600 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        {photoTab === "url" ? (
          <input
            type="text"
            value={formData.foto}
            onChange={(e) => onChange({ foto: e.target.value })}
            placeholder="Tempel URL Link Gambar (contoh: https://images.unsplash.com/...)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition shadow-2xs"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition"
          >
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-xs text-slate-600 font-medium">Klik untuk upload file gambar</p>
            <p className="text-[10px] text-slate-400">PNG, JPG, GIF, WEBP (max 5MB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Live Photo Preview */}
        {formData.foto && (
          <div className="relative mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={formData.foto}
                alt="Foto bukti"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 truncate">Preview Foto Bukti</p>
                <p className="text-[10px] text-slate-400 truncate">{formData.foto.substring(0, 40)}...</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ foto: "" })}
              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white transition cursor-pointer"
              title="Hapus foto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
