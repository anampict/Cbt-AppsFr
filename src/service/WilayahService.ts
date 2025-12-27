import AxiosBase from './axios/AxiosBase'

export interface Provinsi {
    kode: string
    nama: string
    level: number
}

export interface Kota {
    kode: string
    nama: string
    level: number
}

export interface Kecamatan {
    kode: string
    nama: string
    level: number
}

export interface WilayahResponse<T> {
    message: string
    data: T[]
}

const WilayahService = {
    async getProvinsi(search?: string, limit: number = 10) {
        const params: Record<string, string | number> = { limit }
        if (search) {
            params.search = search
        }
        return AxiosBase.get<WilayahResponse<Provinsi>>('/wilayah/provinsi', {
            params,
        })
    },

    async getKota(provinsiKode: string, search?: string, limit: number = 10) {
        const params: Record<string, string | number> = {
            provinsiKode,
            limit,
        }
        if (search) {
            params.search = search
        }
        return AxiosBase.get<WilayahResponse<Kota>>('/wilayah/kota', {
            params,
        })
    },

    async getKecamatan(kotaKode: string, search?: string, limit: number = 10) {
        const params: Record<string, string | number> = {
            kotaKode,
            limit,
        }
        if (search) {
            params.search = search
        }
        return AxiosBase.get<WilayahResponse<Kecamatan>>('/wilayah/kecamatan', {
            params,
        })
    },
}

export default WilayahService
