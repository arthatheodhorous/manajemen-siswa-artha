export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  alamat?: string;
}

export interface SiswaFormData {
  nama: string;
  nis: string;
  tanggalLahir: string;
  alamat: string;
  kelas: string;
  jenisKelamin: "L" | "P" | "";
}
