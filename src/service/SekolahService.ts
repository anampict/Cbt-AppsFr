import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export interface SekolahResponse {
    id: string
    npsn: string
    nama: string
    alamat: string
    kota: string
    provinsi: string
    telepon: string
    email: string
    createdAt: string
    updatedAt: string
    logoUrl: string
}

export interface CreateSekolahRequest {
    npsn: string
    nama: string
    kelurahanKode: string
    alamatLengkap: string
    wilayahLabel?: string
    telepon: string
    email: string
    paketId?: string
    logo?: File
}

// Create axios instance untuk call Next.js API routes (same origin)
const apiAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
})

const SekolahService = {
    async createSekolah(data: CreateSekolahRequest) {
        const formData = new FormData()
        formData.append('npsn', data.npsn)
        formData.append('nama', data.nama)
        formData.append('kelurahanKode', data.kelurahanKode)
        formData.append('alamatLengkap', data.alamatLengkap)
        // wilayahLabel hanya untuk keperluan frontend, tidak dikirim ke backend
        formData.append('telepon', data.telepon)
        formData.append('email', data.email)
        if (data.paketId) {
            formData.append('paketId', data.paketId)
        }
        if (data.logo) {
            formData.append('logo', data.logo)
        }

        const response = await apiAxios.post<{ message: string; data: SekolahResponse }>(
            '/sekolah',
            formData,
        )
        return response.data
    },

    async getListSekolah(params?: Record<string, any>) {
        const response = await apiAxios.get<{ data: SekolahResponse[] }>(
            '/sekolah',
            { params },
        )
        return response.data
    },

    async getSekolahDetail(id: string) {
        const response = await apiAxios.get<{ data: SekolahResponse }>(
            `/sekolah/${id}`,
        )
        return response.data
    },

    async updateSekolah(id: string, data: Partial<CreateSekolahRequest>) {
        const formData = new FormData()
        if (data.npsn) formData.append('npsn', data.npsn)
        if (data.nama) formData.append('nama', data.nama)
        if (data.kelurahanKode) formData.append('kelurahanKode', data.kelurahanKode)
        if (data.alamatLengkap) formData.append('alamatLengkap', data.alamatLengkap)
        // wilayahLabel hanya untuk keperluan frontend, tidak dikirim ke backend
        if (data.telepon) formData.append('telepon', data.telepon)
        if (data.email) formData.append('email', data.email)
        if (data.paketId) {
            formData.append('paketId', data.paketId)
        }
        if (data.logo) {
            formData.append('logo', data.logo)
        }

        const response = await apiAxios.put<{ message: string; data: SekolahResponse }>(
            `/sekolah/${id}`,
            formData,
        )
        return response.data
    },

    async deleteSekolah(id: string) {
        const response = await apiAxios.delete<{ message: string }>(
            `/sekolah/${id}`,
        )
        return response.data
    },
}

export default SekolahService
