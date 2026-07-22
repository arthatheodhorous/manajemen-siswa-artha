"use client";

import React, { useState, useMemo } from "react";
import { Siswa, SiswaFormData } from "@/types/siswa";
import { Kelas } from "@/types/kelas";
import SiswaFilterHeader from "./SiswaFilterHeader";
import SiswaTable from "./SiswaTable";
import TambahSiswaModal from "./TambahSiswaModal";
import EditSiswaModal from "./EditSiswaModal";

import { addSiswa, updateSiswa, deleteSiswa } from "@/lib/dataService";

export const INITIAL_SISWA_DATA: Siswa[] = [
  { id: "1", nama: "Ahmad Rizki Pratama", nis: "2024001", kelas: "X RPL 1", jenisKelamin: "L", tanggalLahir: "2008-05-15", alamat: "Malang" },
  { id: "2", nama: "Siti Nurhaliza", nis: "2024002", kelas: "X RPL 1", jenisKelamin: "P", tanggalLahir: "2008-08-21", alamat: "Malang" },
  { id: "3", nama: "Budi Santoso", nis: "2024003", kelas: "X RPL 1", jenisKelamin: "L", tanggalLahir: "2009-01-10", alamat: "Malang" },
  { id: "4", nama: "Dewi Lestari", nis: "2024004", kelas: "X RPL 2", jenisKelamin: "P", tanggalLahir: "2008-11-02", alamat: "Malang" },
  { id: "5", nama: "Eko Prasetyo", nis: "2024005", kelas: "X RPL 2", jenisKelamin: "L", tanggalLahir: "2008-03-30", alamat: "Malang" },
  { id: "6", nama: "Fitri Handayani", nis: "2024006", kelas: "X RPL 2", jenisKelamin: "P", tanggalLahir: "2009-02-14", alamat: "Malang" },
  { id: "7", nama: "Galih Saputra", nis: "2023001", kelas: "XI RPL 1", jenisKelamin: "L", tanggalLahir: "2007-07-19", alamat: "Malang" },
  { id: "8", nama: "Hana Salsabila", nis: "2023002", kelas: "XI RPL 1", jenisKelamin: "P", tanggalLahir: "2007-09-25", alamat: "Malang" },
  { id: "9", nama: "Irfan Maulana", nis: "2023003", kelas: "XI RPL 1", jenisKelamin: "L", tanggalLahir: "2007-12-05", alamat: "Malang" },
  { id: "10", nama: "Jihan Aulia", nis: "2023004", kelas: "XI RPL 2", jenisKelamin: "P", tanggalLahir: "2007-04-18", alamat: "Malang" },
  { id: "11", nama: "Kiki Amalia", nis: "2023005", kelas: "XI RPL 2", jenisKelamin: "P", tanggalLahir: "2007-06-12", alamat: "Malang" },
  { id: "12", nama: "Lukman Hakim", nis: "2023006", kelas: "XI RPL 2", jenisKelamin: "L", tanggalLahir: "2007-10-30", alamat: "Malang" },
  { id: "13", nama: "Muhammad Fajar", nis: "2022001", kelas: "XII RPL 1", jenisKelamin: "L", tanggalLahir: "2006-02-14", alamat: "Malang" },
  { id: "14", nama: "Nabila Putri", nis: "2022002", kelas: "XII RPL 1", jenisKelamin: "P", tanggalLahir: "2006-05-20", alamat: "Malang" },
  { id: "15", nama: "Oktavia Ramadhani", nis: "2022003", kelas: "XII RPL 1", jenisKelamin: "P", tanggalLahir: "2006-10-08", alamat: "Malang" },
  { id: "16", nama: "Panji Setiawan", nis: "2022004", kelas: "XII RPL 2", jenisKelamin: "L", tanggalLahir: "2006-01-25", alamat: "Malang" },
  { id: "17", nama: "Qori Ananda", nis: "2022005", kelas: "XII RPL 2", jenisKelamin: "P", tanggalLahir: "2006-08-14", alamat: "Malang" },
  { id: "18", nama: "Rian Ardianto", nis: "2022006", kelas: "XII RPL 2", jenisKelamin: "L", tanggalLahir: "2006-11-19", alamat: "Malang" },
];

interface SiswaViewProps {
  siswaList?: Siswa[];
  onSiswaListChange?: (newList: Siswa[]) => void;
  kelasList?: Kelas[];
}

export default function SiswaView({ siswaList: propsSiswaList, onSiswaListChange, kelasList }: SiswaViewProps) {
  const [localSiswaList, setLocalSiswaList] = useState<Siswa[]>(INITIAL_SISWA_DATA);

  const activeSiswaList = propsSiswaList ?? localSiswaList;
  const kelasOptions = kelasList && kelasList.length > 0 ? kelasList.map((k) => k.nama) : undefined;

  const updateSiswaList = (updater: (prev: Siswa[]) => Siswa[]) => {
    const newList = updater(activeSiswaList);
    if (onSiswaListChange) {
      onSiswaListChange(newList);
    } else {
      setLocalSiswaList(newList);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSiswaForEdit, setSelectedSiswaForEdit] = useState<Siswa | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return activeSiswaList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKelas =
        selectedKelas === "Semua Kelas" || item.kelas === selectedKelas;

      return matchSearch && matchKelas;
    });
  }, [activeSiswaList, searchQuery, selectedKelas]);

  // Paginated dataset
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleAddSiswa = async (formData: SiswaFormData) => {
    const created = await addSiswa(formData);
    if (created) {
      updateSiswaList((prev) => [created, ...prev]);
      setIsTambahModalOpen(false);
      setCurrentPage(1);
    }
  };

  const handleEditClick = (siswa: Siswa) => {
    setSelectedSiswaForEdit(siswa);
    setIsEditModalOpen(true);
  };

  const handleSaveEditSiswa = async (id: string | number, formData: SiswaFormData) => {
    const success = await updateSiswa(String(id), formData);
    if (success) {
      updateSiswaList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                nama: formData.nama,
                nis: formData.nis,
                kelas: formData.kelas,
                jenisKelamin: formData.jenisKelamin as "L" | "P",
                tanggalLahir: formData.tanggalLahir,
                alamat: formData.alamat,
              }
            : item
        )
      );
    }
  };

  const handleDeleteSiswa = async (id: string | number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      const success = await deleteSiswa(String(id));
      if (success) {
        updateSiswaList((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Siswa</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {/* Header toolbar */}
        <SiswaFilterHeader
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          selectedKelas={selectedKelas}
          onKelasChange={(kelas) => {
            setSelectedKelas(kelas);
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(num) => {
            setItemsPerPage(num);
            setCurrentPage(1);
          }}
          onOpenTambahModal={() => setIsTambahModalOpen(true)}
          kelasOptions={kelasOptions}
        />

        {/* Table & Pagination */}
        <SiswaTable
          data={paginatedData}
          totalDataCount={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onEdit={handleEditClick}
          onDelete={handleDeleteSiswa}
        />
      </div>

      {/* Modals */}
      <TambahSiswaModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSave={handleAddSiswa}
        kelasOptions={kelasOptions}
      />

      <EditSiswaModal
        isOpen={isEditModalOpen}
        siswa={selectedSiswaForEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSiswaForEdit(null);
        }}
        onSave={handleSaveEditSiswa}
        kelasOptions={kelasOptions}
      />
    </div>
  );
}
