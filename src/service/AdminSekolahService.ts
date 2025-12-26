import axios from 'axios'

export interface AdminSekolahResponse {
    id: string
    name: string
    email: string
    role: string
    sekolahId: string
    sekolah?: {
        id: string
        nama: string
        npsn: string
    }
    createdAt: string
    updatedAt?: string
}

export interface CreateAdminSekolahRequest {
    name: string
    email: string
    password: string
    role: string
    sekolahId: string
}

export interface UpdateAdminSekolahRequest {
    name?: string
    email?: string
    password?: string
    role?: string
    sekolahId?: string
}

// Create axios instance untuk call Next.js API routes (same origin)
const apiAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
})

const AdminSekolahService = {
    async createAdminSekolah(data: CreateAdminSekolahRequest) {
        const response = await apiAxios.post<{ message: string; data: AdminSekolahResponse }>(
            '/admin-sekolah',
            data,
        )
        return response.data
    },

    async getListAdminSekolah(params?: Record<string, any>) {
        const response = await apiAxios.get<{ 
            data: AdminSekolahResponse[]
            total?: number
            page?: number
            pageSize?: number
        }>(
            '/admin-sekolah',
            { params },
        )
        return response.data
    },

    async getAdminSekolahDetail(id: string) {
        const response = await apiAxios.get<{ data: AdminSekolahResponse }>(
            `/admin-sekolah/${id}`,
        )
        return response.data
    },

    async updateAdminSekolah(id: string, data: UpdateAdminSekolahRequest) {
        const response = await apiAxios.put<{ message: string; data: AdminSekolahResponse }>(
            `/admin-sekolah/${id}`,
            data,
        )
        return response.data
    },

    async deleteAdminSekolah(id: string) {
        const response = await apiAxios.delete<{ message: string }>(
            `/admin-sekolah/${id}`,
        )
        return response.data
    },
}

export default AdminSekolahService
