import axios from 'axios'

export interface MaintenanceResponse {
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

export interface CreateMaintenanceRequest {
    sekolahId: string
    tanggalMulai: string
    keterangan: string
}

export interface UpdateMaintenanceRequest {
    status: 'DONE'
    tanggalSelesai: string
    keterangan?: string
}

// Create axios instance untuk call Next.js API routes (same origin)
const apiAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
})

const MaintenanceService = {
    async createMaintenance(data: CreateMaintenanceRequest) {
        const response = await apiAxios.post<{ message: string; data: MaintenanceResponse }>(
            '/maintenance',
            data,
        )
        return response.data
    },

    async getListMaintenance(params?: Record<string, any>) {
        const response = await apiAxios.get<{ data: MaintenanceResponse[] }>(
            '/maintenance',
            { params },
        )
        return response.data
    },

    async getMaintenanceDetail(id: string) {
        const response = await apiAxios.get<{ data: MaintenanceResponse }>(
            `/maintenance/${id}`,
        )
        return response.data
    },

    async updateMaintenance(id: string, data: UpdateMaintenanceRequest) {
        const response = await apiAxios.put<{ message: string; data: MaintenanceResponse }>(
            `/maintenance/${id}`,
            data,
        )
        return response.data
    },

    async deleteMaintenance(id: string) {
        const response = await apiAxios.delete<{ message: string }>(
            `/maintenance/${id}`,
        )
        return response.data
    },

    async checkMaintenance(sekolahId: string) {
        const response = await apiAxios.get<{ data: MaintenanceResponse | null }>(
            `/maintenance/check/sekolah/${sekolahId}`,
        )
        return response.data
    },
}

export default MaintenanceService
