export interface Kelas {
  id: string;
  namaKelas: string;
  tingkat: number;
  jurusan: string;
  sekolahId: string;
  createdAt: string;
  updatedAt: string;
  sekolah: {
    id: string;
    nama: string;
    npsn: string;
  };
  _count: {
    siswa: number;
  };
}

export interface KelasFormData {
  namaKelas: string;
  tingkat: number;
  jurusan: string;
}
