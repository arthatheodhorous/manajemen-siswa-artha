import { supabase } from "./supabase";
import { Siswa, SiswaFormData } from "@/types/siswa";
import { Kelas, KelasFormData } from "@/types/kelas";
import { Pelanggaran } from "@/types/pelanggaran";
import { INITIAL_SISWA_DATA } from "@/components/siswa/SiswaView";
import { INITIAL_KELAS_DATA } from "@/components/kelas/KelasView";

const INITIAL_PELANGGARAN_DATA: Pelanggaran[] = [
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

// ==========================================
// KELAS SERVICES
// ==========================================
export async function getKelas(): Promise<Kelas[]> {
  const { data, error } = await supabase
    .from("kelas")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching kelas:", error);
    return INITIAL_KELAS_DATA;
  }

  if (!data || data.length === 0) {
    // Seed initial data to Supabase if database is empty
    for (const item of INITIAL_KELAS_DATA) {
      await supabase.from("kelas").insert([{ nama: item.nama }]);
    }
    const { data: seeded } = await supabase.from("kelas").select("*").order("created_at", { ascending: true });
    return (seeded || []).map((row) => ({ id: row.id, nama: row.nama }));
  }

  return data.map((row) => ({
    id: row.id,
    nama: row.nama,
  }));
}

export async function addKelas(formData: KelasFormData): Promise<Kelas | null> {
  const { data, error } = await supabase
    .from("kelas")
    .insert([{ nama: formData.nama }])
    .select()
    .single();

  if (error) {
    console.error("Error adding kelas:", error);
    if (error.code === "23505") {
      alert("Gagal menambahkan kelas: Kelas dengan nama \"" + formData.nama + "\" sudah terdaftar.");
    } else {
      alert("Gagal menambahkan kelas: " + error.message);
    }
    return null;
  }

  return { id: data.id, nama: data.nama };
}

export async function updateKelas(id: string, formData: KelasFormData): Promise<boolean> {
  const { error } = await supabase
    .from("kelas")
    .update({ nama: formData.nama })
    .eq("id", id);

  if (error) {
    console.error("Error updating kelas:", error);
    if (error.code === "23505") {
      alert("Gagal memperbarui kelas: Kelas dengan nama \"" + formData.nama + "\" sudah terdaftar.");
    } else {
      alert("Gagal memperbarui kelas: " + error.message);
    }
    return false;
  }

  return true;
}

export async function deleteKelas(id: string): Promise<boolean> {
  const { data, error } = await supabase.from("kelas").delete().eq("id", id).select();

  if (error) {
    console.error("Error deleting kelas:", error);
    alert("Gagal menghapus kelas: " + error.message);
    return false;
  }

  if (!data || data.length === 0) {
    console.error("No rows deleted. Check database RLS policies or ID.");
    alert("Gagal menghapus kelas: Data tidak ditemukan atau akses dihapus ditolak (RLS).");
    return false;
  }

  return true;
}

// ==========================================
// SISWA SERVICES
// ==========================================
export async function getSiswa(): Promise<Siswa[]> {
  const { data, error } = await supabase
    .from("siswa")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching siswa:", error);
    return INITIAL_SISWA_DATA;
  }

  if (!data || data.length === 0) {
    // Seed initial data to Supabase if database is empty
    const seedPayload = INITIAL_SISWA_DATA.map((item) => ({
      nama: item.nama,
      nis: item.nis,
      kelas: item.kelas,
      jenis_kelamin: item.jenisKelamin,
      tanggal_lahir: item.tanggalLahir || null,
      alamat: item.alamat || null,
    }));

    const { error: seedErr } = await supabase.from("siswa").insert(seedPayload);
    if (seedErr) {
      console.error("Error seeding siswa data:", seedErr);
    }
    const { data: seeded } = await supabase.from("siswa").select("*").order("created_at", { ascending: false });
    if (seeded && seeded.length > 0) {
      return seeded.map((row) => ({
        id: row.id,
        nama: row.nama,
        nis: row.nis,
        kelas: row.kelas,
        jenisKelamin: row.jenis_kelamin as "L" | "P",
        tanggalLahir: row.tanggal_lahir || undefined,
        alamat: row.alamat || undefined,
      }));
    }
  }

  return data.map((row) => ({
    id: row.id,
    nama: row.nama,
    nis: row.nis,
    kelas: row.kelas,
    jenisKelamin: row.jenis_kelamin as "L" | "P",
    tanggalLahir: row.tanggal_lahir || undefined,
    alamat: row.alamat || undefined,
  }));
}

export async function addSiswa(formData: SiswaFormData): Promise<Siswa | null> {
  // Find matching kelas_id
  const { data: kelasData } = await supabase
    .from("kelas")
    .select("id")
    .eq("nama", formData.kelas)
    .maybeSingle();

  const payload = {
    nama: formData.nama,
    nis: formData.nis,
    kelas: formData.kelas,
    kelas_id: kelasData?.id || null,
    jenis_kelamin: formData.jenisKelamin,
    tanggal_lahir: formData.tanggalLahir || null,
    alamat: formData.alamat || null,
  };

  const { data, error } = await supabase.from("siswa").insert([payload]).select().single();

  if (error) {
    console.error("Error adding siswa:", error);
    alert("Gagal menambahkan siswa: " + error.message);
    return null;
  }

  return {
    id: data.id,
    nama: data.nama,
    nis: data.nis,
    kelas: data.kelas,
    jenisKelamin: data.jenis_kelamin as "L" | "P",
    tanggalLahir: data.tanggal_lahir || undefined,
    alamat: data.alamat || undefined,
  };
}

export async function updateSiswa(id: string, formData: SiswaFormData): Promise<boolean> {
  const { data: kelasData } = await supabase
    .from("kelas")
    .select("id")
    .eq("nama", formData.kelas)
    .maybeSingle();

  const payload = {
    nama: formData.nama,
    nis: formData.nis,
    kelas: formData.kelas,
    kelas_id: kelasData?.id || null,
    jenis_kelamin: formData.jenisKelamin,
    tanggal_lahir: formData.tanggalLahir || null,
    alamat: formData.alamat || null,
  };

  const { error } = await supabase.from("siswa").update(payload).eq("id", id);

  if (error) {
    console.error("Error updating siswa:", error);
    alert("Gagal memperbarui siswa: " + error.message);
    return false;
  }

  return true;
}

export async function deleteSiswa(id: string): Promise<boolean> {
  const { data, error } = await supabase.from("siswa").delete().eq("id", id).select();

  if (error) {
    console.error("Error deleting siswa:", error);
    alert("Gagal menghapus siswa: " + error.message);
    return false;
  }

  if (!data || data.length === 0) {
    console.error("No rows deleted. Check database RLS policies or ID.");
    alert("Gagal menghapus siswa: Data tidak ditemukan atau akses dihapus ditolak (RLS).");
    return false;
  }

  return true;
}

// ==========================================
// PELANGGARAN SERVICES
// ==========================================
export async function getPelanggaran(): Promise<Pelanggaran[]> {
  const { data, error } = await supabase
    .from("pelanggaran")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pelanggaran:", error);
    return INITIAL_PELANGGARAN_DATA;
  }

  if (!data || data.length === 0) {
    // Seed initial pelanggaran data if empty
    const seedPayload = INITIAL_PELANGGARAN_DATA.map((item) => ({
      nama_siswa: item.namaSiswa,
      nis: item.nis,
      kelas: item.kelas,
      jenis_pelanggaran: item.jenisPelanggaran,
      tingkat: item.tingkat,
      poin: item.poin,
      tanggal: item.tanggal,
      waktu: item.waktu,
      lokasi: item.lokasi || null,
      deskripsi: item.deskripsi || null,
      foto: item.foto || null,
      status: item.status,
    }));

    await supabase.from("pelanggaran").insert(seedPayload);
    const { data: seeded } = await supabase.from("pelanggaran").select("*").order("created_at", { ascending: false });
    if (seeded && seeded.length > 0) {
      return seeded.map((row) => ({
        id: row.id,
        siswa_id: row.siswa_id || undefined,
        namaSiswa: row.nama_siswa,
        nis: row.nis,
        kelas: row.kelas,
        jenisPelanggaran: row.jenis_pelanggaran,
        tingkat: row.tingkat,
        poin: row.poin,
        tanggal: row.tanggal,
        waktu: row.waktu,
        lokasi: row.lokasi || undefined,
        deskripsi: row.deskripsi || undefined,
        foto: row.foto || undefined,
        status: row.status,
      }));
    }
  }

  return data.map((row) => ({
    id: row.id,
    siswa_id: row.siswa_id || undefined,
    namaSiswa: row.nama_siswa,
    nis: row.nis,
    kelas: row.kelas,
    jenisPelanggaran: row.jenis_pelanggaran,
    tingkat: row.tingkat,
    poin: row.poin,
    tanggal: row.tanggal,
    waktu: row.waktu,
    lokasi: row.lokasi || undefined,
    deskripsi: row.deskripsi || undefined,
    foto: row.foto || undefined,
    status: row.status,
  }));
}

export async function addPelanggaran(item: Omit<Pelanggaran, "id">): Promise<Pelanggaran | null> {
  // Find matching siswa_id
  const { data: siswaData } = await supabase
    .from("siswa")
    .select("id")
    .eq("nis", item.nis)
    .maybeSingle();

  const payload = {
    siswa_id: siswaData?.id || null,
    nama_siswa: item.namaSiswa,
    nis: item.nis,
    kelas: item.kelas,
    jenis_pelanggaran: item.jenisPelanggaran,
    tingkat: item.tingkat,
    poin: item.poin,
    tanggal: item.tanggal,
    waktu: item.waktu,
    lokasi: item.lokasi || null,
    deskripsi: item.deskripsi || null,
    foto: item.foto || null,
    status: item.status || "Aktif",
  };

  const { data, error } = await supabase.from("pelanggaran").insert([payload]).select().single();

  if (error) {
    console.error("Error adding pelanggaran:", error);
    alert("Gagal menambahkan pelanggaran: " + error.message);
    return null;
  }

  return {
    id: data.id,
    siswa_id: data.siswa_id || undefined,
    namaSiswa: data.nama_siswa,
    nis: data.nis,
    kelas: data.kelas,
    jenisPelanggaran: data.jenis_pelanggaran,
    tingkat: data.tingkat,
    poin: data.poin,
    tanggal: data.tanggal,
    waktu: data.waktu,
    lokasi: data.lokasi || undefined,
    deskripsi: data.deskripsi || undefined,
    foto: data.foto || undefined,
    status: data.status,
  };
}

export async function updatePelanggaran(id: string, item: Partial<Pelanggaran>): Promise<boolean> {
  const payload: Record<string, any> = {};
  if (item.namaSiswa !== undefined) payload.nama_siswa = item.namaSiswa;
  if (item.nis !== undefined) payload.nis = item.nis;
  if (item.kelas !== undefined) payload.kelas = item.kelas;
  if (item.jenisPelanggaran !== undefined) payload.jenis_pelanggaran = item.jenisPelanggaran;
  if (item.tingkat !== undefined) payload.tingkat = item.tingkat;
  if (item.poin !== undefined) payload.poin = item.poin;
  if (item.tanggal !== undefined) payload.tanggal = item.tanggal;
  if (item.waktu !== undefined) payload.waktu = item.waktu;
  if (item.lokasi !== undefined) payload.lokasi = item.lokasi;
  if (item.deskripsi !== undefined) payload.deskripsi = item.deskripsi;
  if (item.foto !== undefined) payload.foto = item.foto;
  if (item.status !== undefined) payload.status = item.status;

  const { error } = await supabase.from("pelanggaran").update(payload).eq("id", id);

  if (error) {
    console.error("Error updating pelanggaran:", error);
    alert("Gagal memperbarui pelanggaran: " + error.message);
    return false;
  }

  return true;
}

export async function deletePelanggaran(id: string): Promise<boolean> {
  const { data, error } = await supabase.from("pelanggaran").delete().eq("id", id).select();

  if (error) {
    console.error("Error deleting pelanggaran:", error);
    alert("Gagal menghapus pelanggaran: " + error.message);
    return false;
  }

  if (!data || data.length === 0) {
    console.error("No rows deleted. Check database RLS policies or ID.");
    alert("Gagal menghapus pelanggaran: Data tidak ditemukan atau akses dihapus ditolak (RLS).");
    return false;
  }

  return true;
}
