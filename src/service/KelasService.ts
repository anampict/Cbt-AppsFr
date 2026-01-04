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
    _count?: {
        siswa: number
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

export interface KelasResponse {
    message: string
    data: Kelas
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
    
    getKelasById: async (id: string) => {
        return ApiService.fetchDataWithAxios<KelasResponse>({
            url: `/kelas/${id}`,
            method: 'get',
        })
    },
    
    createKelas: async (data: any) => {
        return ApiService.fetchDataWithAxios<KelasResponse>({
            url: '/kelas',
            method: 'post',
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    },
    
    updateKelas: async (id: string, data: any) => {
        return ApiService.fetchDataWithAxios<KelasResponse>({
            url: `/kelas/${id}`,
            method: 'put',
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    },
    
    deleteKelas: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string }>({
            url: `/kelas/${id}`,
            method: 'delete',
        })
    },
}

export default KelasService
