export type Guru = {
    id: string
    nip: string
    nama: string
    email: string
    telepon: string
    alamat: string
    sekolahId: string
    createdAt: string
    updatedAt: string
    sekolah: {
        id: string
        nama: string
        npsn: string
    }
    mapel: any[]
    fotoUrl?: string
}

export type GuruListResponse = {
    message: string
    data: Guru[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}
