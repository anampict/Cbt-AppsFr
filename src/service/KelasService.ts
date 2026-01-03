import ApiService from './ApiService'

export interface Kelas {
    id: string
    namaKelas: string
    tingkat: number
    jurusan: string | null
    sekolahId: string
    createdAt: string
    updatedAt: string
    sekolah: {
        id: string
        nama: string
        npsn: string
    }
}

export interface KelasListResponse {
    message: string
    data: Kelas[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

const KelasService = {
    getKelasList: async (params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        return ApiService.fetchDataWithAxios<KelasListResponse>({
            url: '/kelas',
            method: 'get',
            params,
        })
    },
}

export default KelasService
