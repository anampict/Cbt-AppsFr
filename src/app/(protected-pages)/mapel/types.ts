export type Mapel = {
    id: string
    kodeMapel: string
    namaMapel: string
    deskripsi: string | null
    sekolahId: string
    createdAt: string
    updatedAt: string
    sekolah: {
        id: string
        nama: string
        npsn: string
    }
    guru: any[]
}

export type MapelListResponse = {
    message: string
    data: Mapel[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}
