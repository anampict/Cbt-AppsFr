import ApiService from './ApiService'

export interface Siswa {
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

export interface SiswaListResponse {
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

export interface SiswaByKelasResponse {
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
    kelasInfo: {
        id: string
        namaKelas: string
        tingkat: number
        jurusan: string
        sekolah: {
            id: string
            nama: string
            npsn: string
        }
    }
}

export interface SiswaPayload {
    nisn: string
    nis: string
    nama: string
    email: string
    password?: string
    telepon: string
    alamat: string
    tanggalLahir: string
    jenisKelamin: string
    kelasId: string
}

const SiswaService = {
    getSiswaList: async (params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        return ApiService.fetchDataWithAxios<SiswaListResponse>({
            url: '/siswa',
            method: 'get',
            params,
        })
    },

    getSiswaById: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string; data: Siswa }>({
            url: `/siswa/${id}`,
            method: 'get',
        })
    },

    getSiswaByKelas: async (kelasId: string, params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        return ApiService.fetchDataWithAxios<SiswaByKelasResponse>({
            url: `/siswa/by-kelas/${kelasId}`,
            method: 'get',
            params,
        })
    },

    createSiswa: async (data: SiswaPayload | FormData) => {
        const isFormData = data instanceof FormData
        
        return ApiService.fetchDataWithAxios<{ message: string; data: Siswa }, any>({
            url: '/siswa',
            method: 'post',
            data,
            ...(isFormData && {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        })
    },

    updateSiswa: async (id: string, data: Partial<SiswaPayload> | FormData) => {
        const isFormData = data instanceof FormData
        
        return ApiService.fetchDataWithAxios<{ message: string; data: Siswa }, any>({
            url: `/siswa/${id}`,
            method: 'put',
            data,
            ...(isFormData && {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        })
    },

    deleteSiswa: async (id: string) => {
        return ApiService.fetchDataWithAxios<{ message: string }>({
            url: `/siswa/${id}`,
            method: 'delete',
        })
    },
}

export default SiswaService
