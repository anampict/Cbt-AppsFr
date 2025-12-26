import axios from 'axios'

export interface DomainResponse {
    id: string
    domain: string
    customDomain: string
    sslEnabled: boolean
    isActive: boolean
    expiredAt: string
    createdAt: string
    updatedAt: string
    sekolahId: string
    sekolah: {
        id: string
        npsn: string
        nama: string
    }
}

export interface CreateDomainRequest {
    domain: string
    customDomain: string
    sslEnabled: boolean
    isActive: boolean
    expiredAt: string
    sekolahId: string
}

export interface UpdateDomainRequest {
    domain?: string
    customDomain?: string
    sslEnabled?: boolean
    isActive?: boolean
    expiredAt?: string
    sekolahId?: string
}

// Create axios instance untuk call Next.js API routes (same origin)
const apiAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
})

const DomainService = {
    async createDomain(data: CreateDomainRequest) {
        const response = await apiAxios.post<DomainResponse>(
            '/domain',
            data,
        )
        return response.data
    },

    async getListDomain(params?: Record<string, any>) {
        const response = await apiAxios.get<{ data: DomainResponse[] }>(
            '/domain',
            { params },
        )
        return response.data
    },

    async getDomainDetail(id: string) {
        const response = await apiAxios.get<DomainResponse>(
            `/domain/${id}`,
        )
        return response.data
    },

    async updateDomain(id: string, data: UpdateDomainRequest) {
        const response = await apiAxios.put<DomainResponse>(
            `/domain/${id}`,
            data,
        )
        return response.data
    },

    async deleteDomain(id: string) {
        const response = await apiAxios.delete<{ message: string }>(
            `/domain/${id}`,
        )
        return response.data
    },
}

export default DomainService
