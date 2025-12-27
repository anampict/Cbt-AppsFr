import ApiService from './ApiService'

export interface DashboardOverview {
    totalSekolah: number
    totalAdmin: number
    totalDomain: number
}

export interface SekolahBaru {
    hariIni: number
    mingguIni: number
    bulanIni: number
}

export interface DistribusiPaket {
    paketNama: string
    paketId: string | null
    jumlah: number
}

export interface TopProvinsi {
    provinsi: string
    provinsiKode: string | null
    jumlah: number
}

export interface AdminBreakdown {
    totalSuperadmin: number
    totalAdminSekolah: number
    total: number
}

export interface DashboardStats {
    overview: DashboardOverview
    sekolahBaru: SekolahBaru
    distribusiPaket: DistribusiPaket[]
    top5Provinsi: TopProvinsi[]
    adminBreakdown: AdminBreakdown
}

export interface DashboardStatsResponse {
    message: string
    data: DashboardStats
}

const DashboardService = {
    async getStats() {
        return ApiService.fetchDataWithAxios<DashboardStatsResponse>({
            url: '/dashboard/stats',
            method: 'get',
        })
    },
}

export default DashboardService
