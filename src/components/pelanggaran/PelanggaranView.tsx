"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pelanggaran, PelanggaranFormData } from "@/types/pelanggaran";
import { Siswa } from "@/types/siswa";
import PelanggaranFilterHeader from "./PelanggaranFilterHeader";
import PelanggaranTable from "./PelanggaranTable";
import TambahPelanggaranModal from "./TambahPelanggaranModal";
import EditPelanggaranModal from "./EditPelanggaranModal";
import DetailPelanggaranModal from "./DetailPelanggaranModal";
import { getPelanggaran, addPelanggaran, updatePelanggaran, deletePelanggaran } from "@/lib/dataService";

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

const INITIAL_DATA: Pelanggaran[] = [
  { id: "1", namaSiswa: "Budi Santoso", nis: "2024003", kelas: "X RPL 1", jenisPelanggaran: "Tidak Mengerjakan Tugas", tingkat: "Ringan", poin: 5, tanggal: "2026-07-08", waktu: "07:30", lokasi: "Kelas X RPL 1", deskripsi: "Tidak mengumpulkan tugas Matematika.", foto: "", status: "Aktif" },
  { id: "2", namaSiswa: "Ahmad Rizki Pratama", nis: "2024001", kelas: "X RPL 1", jenisPelanggaran: "Terlambat Masuk Kelas", tingkat: "Ringan", poin: 10, tanggal: "2026-07-05", waktu: "08:00", lokasi: "Gerbang sekolah", deskripsi: "Terlambat 15 menit.", foto: "", status: "Aktif" },
  { id: "3", namaSiswa: "Galih Saputra", nis: "2023001", kelas: "XI RPL 1", jenisPelanggaran: "Membolos", tingkat: "Sedang", poin: 25, tanggal: "2026-06-18", waktu: "09:00", lokasi: "Luar sekolah", deskripsi: "Tidak hadir tanpa keterangan.", foto: "", status: "Aktif" },
  { id: "4", namaSiswa: "Eko Prasetyo", nis: "2024005", kelas: "X RPL 2", jenisPelanggaran: "Seragam Tidak Lengkap", tingkat: "Ringan", poin: 5, tanggal: "2026-06-12", waktu: "07:00", lokasi: "Kelas X RPL 2", deskripsi: "Tidak memakai dasi.", foto: "", status: "Selesai" },
  { id: "5", namaSiswa: "Kiki Amalia", nis: "2023005", kelas: "XI RPL 2", jenisPelanggaran: "Menggunakan HP saat Pelajaran", tingkat: "Sedang", poin: 15, tanggal: "2026-05-15", waktu: "10:00", lokasi: "Kelas XI RPL 2", deskripsi: "Menggunakan HP untuk bermain game.", foto: "", status: "Selesai" },
  { id: "6", namaSiswa: "Irfan Maulana", nis: "2023003", kelas: "XI RPL 1", jenisPelanggaran: "Terlambat Masuk Kelas", tingkat: "Ringan", poin: 10, tanggal: "2026-05-03", waktu: "08:00", lokasi: "Gerbang sekolah", deskripsi: "Terlambat 30 menit.", foto: "", status: "Selesai" },
  { id: "7", namaSiswa: "Siti Nurhaliza", nis: "2024002", kelas: "X RPL 1", jenisPelanggaran: "Terlambat Masuk Kelas", tingkat: "Ringan", poin: 10, tanggal: "2026-04-21", waktu: "07:30", lokasi: "Gerbang sekolah", deskripsi: "Terlambat 20 menit.", foto: "", status: "Selesai" },
  { id: "8", namaSiswa: "Muhammad Fajar", nis: "2022001", kelas: "XII RPL 1", jenisPelanggaran: "Merokok", tingkat: "Berat", poin: 50, tanggal: "2026-04-07", waktu: "12:00", lokasi: "Kantin sekolah", deskripsi: "Ketahuan merokok di area kantin.", foto: "", status: "Selesai" },
  { id: "9", namaSiswa: "Panji Setiawan", nis: "2022004", kelas: "XII RPL 2", jenisPelanggaran: "Tidak Mengerjakan Tugas", tingkat: "Ringan", poin: 5, tanggal: "2026-03-25", waktu: "09:00", lokasi: "Kelas XII RPL 2", deskripsi: "Tidak mengumpulkan tugas PKK.", foto: "", status: "Selesai" },
  { id: "10", namaSiswa: "Oscar Firmansyah", nis: "2022003", kelas: "XII RPL 1", jenisPelanggaran: "Berkelahi", tingkat: "Berat", poin: 75, tanggal: "2026-03-10", waktu: "14:00", lokasi: "Lapangan sekolah", deskripsi: "Terlibat perkelahian dengan siswa lain.", foto: "", status: "Selesai" },
  { id: "11", namaSiswa: "Dewi Lestari", nis: "2024004", kelas: "X RPL 2", jenisPelanggaran: "Seragam Tidak Lengkap", tingkat: "Ringan", poin: 5, tanggal: "2026-03-05", waktu: "07:00", lokasi: "Kelas X RPL 2", deskripsi: "Tidak memakai topi upacara.", foto: "", status: "Selesai" },
  { id: "12", namaSiswa: "Lukman Hakim", nis: "2023006", kelas: "XI RPL 2", jenisPelanggaran: "Membolos", tingkat: "Sedang", poin: 25, tanggal: "2026-02-20", waktu: "08:00", lokasi: "Luar sekolah", deskripsi: "Tidak hadir tanpa izin.", foto: "", status: "Selesai" },
];

interface PelanggaranViewProps {
  siswaList?: Siswa[];
}

export default function PelanggaranView({ siswaList }: PelanggaranViewProps) {
  const [pelanggaranList, setPelanggaranList] = useState<Pelanggaran[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Load from Supabase on mount
  useEffect(() => {
    async function loadData() {
      const fetched = await getPelanggaran();
      setPelanggaranList(fetched);
    }
    loadData();
  }, []);

  const updatePelanggaranList = (updater: (prev: Pelanggaran[]) => Pelanggaran[]) => {
    setPelanggaranList((prev) => updater(prev));
  };

  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pelanggaran | null>(null);

  const [filterTanggalMulai, setFilterTanggalMulai] = useState("");
  const [filterTanggalSelesai, setFilterTanggalSelesai] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  const activeSiswaData = siswaList && siswaList.length > 0 ? siswaList : FALLBACK_SISWA_DATA;

  // Collect unique jenis pelanggaran from data
  const jenisOptions = useMemo(() => {
    const set = new Set(pelanggaranList.map((p) => p.jenisPelanggaran));
    return Array.from(set).sort();
  }, [pelanggaranList]);

  const handleResetFilters = () => {
    setFilterTanggalMulai("");
    setFilterTanggalSelesai("");
    setFilterStatus("");
    setFilterTingkat("");
    setFilterJenis("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return pelanggaranList.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          item.namaSiswa.toLowerCase().includes(q) ||
          item.nis.includes(q) ||
          item.kelas.toLowerCase().includes(q) ||
          item.jenisPelanggaran.toLowerCase().includes(q) ||
          item.tingkat.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }
      // Tanggal Mulai
      if (filterTanggalMulai && item.tanggal < filterTanggalMulai) return false;
      // Tanggal Selesai
      if (filterTanggalSelesai && item.tanggal > filterTanggalSelesai) return false;
      // Status
      if (filterStatus && item.status !== filterStatus) return false;
      // Tingkat
      if (filterTingkat && item.tingkat !== filterTingkat) return false;
      // Jenis
      if (filterJenis && item.jenisPelanggaran !== filterJenis) return false;
      return true;
    });
  }, [pelanggaranList, searchQuery, filterTanggalMulai, filterTanggalSelesai, filterStatus, filterTingkat, filterJenis]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const resolveSiswaInfo = (namaSiswa: string, nis?: string, kelas?: string) => {
    const matched = activeSiswaData.find((s) => s.nama.toLowerCase() === namaSiswa.trim().toLowerCase());
    return {
      nis: nis || matched?.nis || `2024${Math.floor(100 + Math.random() * 900)}`,
      kelas: kelas || matched?.kelas || "X RPL 1",
    };
  };

  const handleAdd = async (formData: PelanggaranFormData) => {
    const { nis, kelas } = resolveSiswaInfo(formData.namaSiswa, formData.nis, formData.kelas);
    const itemData: Omit<Pelanggaran, "id"> = {
      namaSiswa: formData.namaSiswa,
      nis,
      kelas,
      jenisPelanggaran: formData.jenisPelanggaran,
      tingkat: (formData.tingkat || "Ringan") as Pelanggaran["tingkat"],
      poin: formData.poin || (formData.tingkat === "Berat" ? 50 : formData.tingkat === "Sedang" ? 15 : 5),
      tanggal: formData.tanggal || new Date().toISOString().split("T")[0],
      waktu: formData.waktu || "08:00",
      lokasi: formData.lokasi || "Ruang Kelas",
      deskripsi: formData.deskripsi || "-",
      foto: formData.foto || "",
      status: "Aktif",
    };

    const created = await addPelanggaran(itemData);
    if (created) {
      updatePelanggaranList((prev) => [created, ...prev]);
      setIsTambahOpen(false);
      setCurrentPage(1);
    }
  };

  const handleEdit = async (id: string, formData: PelanggaranFormData) => {
    const { nis, kelas } = resolveSiswaInfo(formData.namaSiswa, formData.nis, formData.kelas);
    const updatePayload: Partial<Pelanggaran> = {
      namaSiswa: formData.namaSiswa,
      nis,
      kelas,
      jenisPelanggaran: formData.jenisPelanggaran,
      tingkat: (formData.tingkat || "Ringan") as Pelanggaran["tingkat"],
      poin: formData.poin,
      tanggal: formData.tanggal,
      waktu: formData.waktu,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      foto: formData.foto,
      status: formData.status || "Aktif",
    };

    const success = await updatePelanggaran(id, updatePayload);
    if (success) {
      updatePelanggaranList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatePayload,
              }
            : item
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pelanggaran ini?")) {
      const success = await deletePelanggaran(id);
      if (success) {
        updatePelanggaranList((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  // Export Excel Functionality (.csv readable directly by Excel / Google Sheets)
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data pelanggaran untuk diexport!");
      return;
    }

    const headers = ["No", "Nama Siswa", "NIS", "Kelas", "Jenis Pelanggaran", "Tingkat", "Poin", "Tanggal", "Waktu", "Lokasi", "Status"];
    const rows = filteredData.map((item, idx) => [
      idx + 1,
      `"${(item.namaSiswa || "").replace(/"/g, '""')}"`,
      `"${item.nis || ""}"`,
      `"${item.kelas || ""}"`,
      `"${(item.jenisPelanggaran || "").replace(/"/g, '""')}"`,
      `"${item.tingkat || ""}"`,
      item.poin || 0,
      `"${item.tanggal || ""}"`,
      `"${item.waktu || "-"}"`,
      `"${(item.lokasi || "-").replace(/"/g, '""')}"`,
      `"${item.status || ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Pelanggaran_SMKN100_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF Functionality (Opens styled printable view with window.print())
  const handleExportPdf = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data pelanggaran untuk diexport!");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Gagal membuka jendela cetak. Harap izinkan pop-up di browser Anda.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const tableRows = filteredData
      .map(
        (item, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; color: #2563eb;">${idx + 1}</td>
          <td><strong>${item.namaSiswa}</strong></td>
          <td>${item.nis}</td>
          <td style="color: #2563eb; font-weight: 600;">${item.kelas}</td>
          <td>${item.jenisPelanggaran}</td>
          <td style="text-align: center;">${item.tingkat}</td>
          <td style="text-align: center; font-weight: bold;">${item.poin}</td>
          <td>${item.tanggal}</td>
          <td style="text-align: center; font-weight: 600; color: ${item.status === 'Aktif' ? '#dc2626' : '#16a34a'};">${item.status}</td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Data Pelanggaran Siswa - SMK Negeri 100 Malang</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #1a56db; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 22px; color: #1a56db; font-weight: 800; letter-spacing: 0.5px; }
          .header h2 { margin: 4px 0 0; font-size: 13px; color: #64748b; font-weight: 600; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 11px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 7px 10px; }
          th { background-color: #f1f5f9; color: #334155; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; }
          .signature { text-align: center; width: 220px; }
          .signature-space { height: 50px; }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SMK NEGERI 100 MALANG</h1>
          <h2>LAPORAN DATA PELANGGARAN SISWA</h2>
        </div>

        <div class="meta">
          <div>Tanggal Cetak: <strong>${todayStr}</strong></div>
          <div>Total Records: <strong>${filteredData.length} Pelanggaran</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">NO</th>
              <th>NAMA SISWA</th>
              <th>NIS</th>
              <th>KELAS</th>
              <th>JENIS PELANGGARAN</th>
              <th style="text-align: center;">TINGKAT</th>
              <th style="text-align: center;">POIN</th>
              <th>TANGGAL</th>
              <th style="text-align: center;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <div></div>
          <div class="signature">
            <p>Malang, ${todayStr}</p>
            <p>Kepala Tim Ketertiban,</p>
            <div class="signature-space"></div>
            <p><strong>( ________________________ )</strong></p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-slate-800">Data Pelanggaran</h2>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <PelanggaranFilterHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          onOpenTambahModal={() => setIsTambahOpen(true)}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          filterTanggalMulai={filterTanggalMulai}
          filterTanggalSelesai={filterTanggalSelesai}
          filterStatus={filterStatus}
          filterTingkat={filterTingkat}
          filterJenis={filterJenis}
          onFilterTanggalMulaiChange={(v) => { setFilterTanggalMulai(v); setCurrentPage(1); }}
          onFilterTanggalSelesaiChange={(v) => { setFilterTanggalSelesai(v); setCurrentPage(1); }}
          onFilterStatusChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}
          onFilterTingkatChange={(v) => { setFilterTingkat(v); setCurrentPage(1); }}
          onFilterJenisChange={(v) => { setFilterJenis(v); setCurrentPage(1); }}
          onResetFilters={handleResetFilters}
          totalData={pelanggaranList.length}
          filteredCount={filteredData.length}
          jenisOptions={jenisOptions}
        />

        <PelanggaranTable
          data={paginatedData}
          totalDataCount={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onDetail={(item) => { setSelectedItem(item); setIsDetailOpen(true); }}
          onEdit={(item) => { setSelectedItem(item); setIsEditOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <TambahPelanggaranModal
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        onSave={handleAdd}
        siswaList={activeSiswaData}
      />

      <EditPelanggaranModal
        isOpen={isEditOpen}
        pelanggaran={selectedItem}
        onClose={() => { setIsEditOpen(false); setSelectedItem(null); }}
        onSave={handleEdit}
        siswaList={activeSiswaData}
      />

      <DetailPelanggaranModal
        isOpen={isDetailOpen}
        pelanggaran={selectedItem}
        onClose={() => { setIsDetailOpen(false); setSelectedItem(null); }}
      />
    </div>
  );
}
