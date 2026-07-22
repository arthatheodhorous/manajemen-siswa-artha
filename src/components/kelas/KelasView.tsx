"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Kelas, KelasFormData } from "@/types/kelas";
import KelasFilterHeader from "./KelasFilterHeader";
import KelasTable from "./KelasTable";
import TambahKelasModal from "./TambahKelasModal";
import EditKelasModal from "./EditKelasModal";

import { addKelas, updateKelas, deleteKelas } from "@/lib/dataService";

export const INITIAL_KELAS_DATA: Kelas[] = [
  { id: "1", nama: "X RPL 1" },
  { id: "2", nama: "X RPL 2" },
  { id: "3", nama: "XI RPL 1" },
  { id: "4", nama: "XI RPL 2" },
  { id: "5", nama: "XII RPL 1" },
  { id: "6", nama: "XII RPL 2" },
];

interface KelasViewProps {
  kelasList?: Kelas[];
  onKelasListChange?: (newList: Kelas[]) => void;
}

export default function KelasView({ kelasList: propsKelasList, onKelasListChange }: KelasViewProps) {
  const [localKelasList, setLocalKelasList] = useState<Kelas[]>(INITIAL_KELAS_DATA);

  const activeKelasList = propsKelasList ?? localKelasList;

  // Load from localStorage on mount if unmanaged
  useEffect(() => {
    if (!propsKelasList) {
      const saved = localStorage.getItem("kelas_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setLocalKelasList(parsed);
        } catch (e) {
          console.error("Failed loading saved kelas data", e);
        }
      }
    }
  }, [propsKelasList]);

  const updateKelasList = (updater: (prev: Kelas[]) => Kelas[]) => {
    const next = updater(activeKelasList);
    if (onKelasListChange) {
      onKelasListChange(next);
    } else {
      setLocalKelasList(next);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKelasForEdit, setSelectedKelasForEdit] = useState<Kelas | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return activeKelasList.filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeKelasList, searchQuery]);

  // Paginated dataset
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleAddKelas = async (formData: KelasFormData) => {
    const isDuplicate = activeKelasList.some(
      (k) => k.nama.toLowerCase().trim() === formData.nama.toLowerCase().trim()
    );
    if (isDuplicate) {
      alert(`Gagal menambahkan kelas: Kelas dengan nama "${formData.nama}" sudah terdaftar.`);
      return;
    }

    const created = await addKelas(formData);
    if (created) {
      updateKelasList((prev) => [...prev, created]);
      setIsTambahModalOpen(false);
    }
  };

  const handleEditClick = (kelas: Kelas) => {
    setSelectedKelasForEdit(kelas);
    setIsEditModalOpen(true);
  };

  const handleSaveEditKelas = async (id: string, formData: KelasFormData) => {
    const isDuplicate = activeKelasList.some(
      (k) => k.id !== id && k.nama.toLowerCase().trim() === formData.nama.toLowerCase().trim()
    );
    if (isDuplicate) {
      alert(`Gagal memperbarui kelas: Kelas dengan nama "${formData.nama}" sudah terdaftar.`);
      return;
    }

    const success = await updateKelas(id, formData);
    if (success) {
      updateKelasList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, nama: formData.nama } : item
        )
      );
    }
  };

  const handleDeleteKelas = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data kelas ini?")) {
      const success = await deleteKelas(id);
      if (success) {
        updateKelasList((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header matching Image 1 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Data Kelas</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {/* Header toolbar */}
        <KelasFilterHeader
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(num) => {
            setItemsPerPage(num);
            setCurrentPage(1);
          }}
          onOpenTambahModal={() => setIsTambahModalOpen(true)}
        />

        {/* Table & Pagination */}
        <KelasTable
          data={paginatedData}
          totalDataCount={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onEdit={handleEditClick}
          onDelete={handleDeleteKelas}
        />
      </div>

      {/* Modals */}
      <TambahKelasModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSave={handleAddKelas}
      />

      <EditKelasModal
        isOpen={isEditModalOpen}
        kelas={selectedKelasForEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedKelasForEdit(null);
        }}
        onSave={handleSaveEditKelas}
      />
    </div>
  );
}
