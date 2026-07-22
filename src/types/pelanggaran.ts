export type TingkatPelanggaran = "Ringan" | "Sedang" | "Berat";
export type StatusPelanggaran = "Aktif" | "Selesai";

export interface Pelanggaran {
  id: string;
  siswa_id?: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  jenisPelanggaran: string;
  tingkat: TingkatPelanggaran;
  poin: number;
  tanggal: string;
  waktu: string;
  lokasi?: string;
  deskripsi?: string;
  foto?: string;
  status: StatusPelanggaran;
}

export interface PelanggaranFormData {
  namaSiswa: string;
  nis: string;
  kelas: string;
  jenisPelanggaran: string;
  tingkat: TingkatPelanggaran | "";
  poin: number;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  foto: string;
  status?: StatusPelanggaran;
}
