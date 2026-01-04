import ApiService from './ApiService'

export interface Mapel {
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

export interface MapelListResponse {
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

export interface MapelPayload {
    kodeMapel: string
    namaMapel: string
    deskripsi?: string | null
    sekolahId?: string // Optional - backend will set this based on user session
}

const MapelService = {
    getMapelList: async (params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        return ApiService.fetchDataWithAxios<MapelListResponse>({
            url: '/mapel',
            method: 'get',
            params,
        })
    },

    getMapelById: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Mapel }>({
            url: `/mapel/${id}`,
            method: 'get',
        })
    },

    createMapel: async (data: MapelPayload) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Mapel }>({
            url: '/mapel',
            method: 'post',
            data: data as unknown as Record<string, unknown>,
        })
    },

    updateMapel: async (id: string, data: Partial<MapelPayload>) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Mapel }>({
            url: `/mapel/${id}`,
            method: 'put',
            data: data as unknown as Record<string, unknown>,
        })
    },

    deleteMapel: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string }>({
            url: `/mapel/${id}`,
            method: 'delete',
        })
    },
}

export default MapelService
