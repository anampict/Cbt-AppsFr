import ApiService from './ApiService'

export interface Guru {
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
    kelas: any[]
    fotoUrl?: string
}

export interface GuruListResponse {
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

export interface GuruPayload {
    nip: string
    nama: string
    email: string
    telepon: string
    alamat: string
    sekolahId: string
}

const GuruService = {
    getGuruList: async (params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        return ApiService.fetchDataWithAxios<GuruListResponse>({
            url: '/guru',
            method: 'get',
            params,
        })
    },

    getGuruById: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Guru }>({
            url: `/guru/${id}`,
            method: 'get',
        })
    },

    createGuru: async (data: GuruPayload | FormData) => {
        // Check if data is FormData (for file upload)
        const isFormData = data instanceof FormData
        
        return ApiService.fetchDataWithAxios<{ message: string; data: Guru }, any>({
            url: '/guru',
            method: 'post',
            data,
            ...(isFormData && {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        })
    },

    updateGuru: async (id: string, data: Partial<GuruPayload> | FormData) => {
        const isFormData = data instanceof FormData
        
        return ApiService.fetchDataWithAxios<{ message: string; data: Guru }, any>({
            url: `/guru/${id}`,
            method: 'put',
            data,
            ...(isFormData && {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        })
    },

    updateGuruMapel: async (id: string, mapelIds: string[]) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Guru }>({
            url: `/guru/${id}/mapel`,
            method: 'put',
            data: { mapelIds },
        })
    },

    updateGuruKelas: async (id: string, kelasIds: string[]) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Guru }>({
            url: `/guru/${id}/kelas`,
            method: 'put',
            data: { kelasIds },
        })
    },

    deleteGuru: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string }>({
            url: `/guru/${id}`,
            method: 'delete',
        })
    },
}

export default GuruService
