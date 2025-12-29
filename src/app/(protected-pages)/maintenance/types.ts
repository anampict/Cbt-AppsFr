export type Maintenance = {
    id: string
    sekolahId: string
    tanggalMulai: string
    tanggalSelesai: string | null
    status: 'PENDING' | 'DONE'
    keterangan: string
    createdAt: string
    updatedAt: string
    sekolah?: {
        id: string
        npsn: string
        nama: string
    }
}

export type GetMaintenanceListResponse = {
    data: Maintenance[]
    total: number
}
