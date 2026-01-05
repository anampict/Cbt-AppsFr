export type Siswa = {
    id: string
    nisn: string
    nis: string
    nama: string
    email: string
    telepon: string
    alamat: string
    tanggalLahir: string
    jenisKelamin: string
    sekolahId: string
    kelasId: string
    createdAt: string
    updatedAt: string
    sekolah: {
        id: string
        nama: string
        npsn: string
    }
    kelas: {
        id: string
        namaKelas: string
        tingkat: number
        jurusan: string
        sekolahId: string
        createdAt: string
        updatedAt: string
    }
    fotoUrl?: string
}

export type SiswaListResponse = {
    message: string
    data: Siswa[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}
