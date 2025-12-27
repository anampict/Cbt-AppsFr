import axios from 'axios'

export interface PaketResponse {
    id: string
    namaPaket: string
    deskripsi?: string
    harga: number
    maxDomain: number
    maxAdminSekolah: number
    maxSiswa: number
    maxGuru: number
    maxSoal: number
    maxUjian: number
    maxStorage: number
    customDomain: boolean
    sslEnabled: boolean
    whiteLabel: boolean
    apiAccess: boolean
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface CreatePaketRequest {
    namaPaket: string
    deskripsi?: string
    harga: number
    maxDomain: number
    maxAdminSekolah: number
    maxSiswa: number
    maxGuru: number
    maxSoal: number
    maxUjian: number
    maxStorage: number
    customDomain: boolean
    sslEnabled: boolean
    whiteLabel: boolean
    apiAccess: boolean
    isActive: boolean
}

// Create axios instance untuk call Next.js API routes (same origin)
const apiAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
})

const PaketService = {
    async getListPaket(params?: Record<string, any>) {
        const response = await apiAxios.get<{ data: PaketResponse[] }>(
            '/paket',
            { params },
        )
        return response.data
    },

    async getPaketDetail(id: string) {
        const response = await apiAxios.get<{ data: PaketResponse }>(
            `/paket/${id}`,
        )
        return response.data
    },

    async createPaket(data: CreatePaketRequest) {
        const response = await apiAxios.post<{ message: string; data: PaketResponse }>(
            '/paket',
            data,
        )
        return response.data
    },

    async updatePaket(id: string, data: Partial<CreatePaketRequest>) {
        const response = await apiAxios.put<{ message: string; data: PaketResponse }>(
            `/paket/${id}`,
            data,
        )
        return response.data
    },

    async deletePaket(id: string) {
        const response = await apiAxios.delete<{ message: string }>(
            `/paket/${id}`,
        )
        return response.data
    },
}

export default PaketService
