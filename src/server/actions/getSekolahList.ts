import axios from 'axios'
import { auth } from '@/auth'

interface SekolahItem {
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
    logoUrl?: string
    _count?: {
        siswas?: number
        mataPelajarans?: number
    }
}

interface SekolahListResponse {
    message: string
    data: SekolahItem[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export const getSekolahList = async (_queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    const queryParams = _queryParams

    const {
        pageIndex = '1',
        pageSize = '10',
        query = '',
    } = queryParams

    const session = await auth()
    const backendToken = (session?.user as any)?.backendToken

    if (!backendToken) {
        return {
            customers: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }

    try {
        const response = await axios.get<SekolahListResponse>(
            'http://localhost:3000/sekolah',
            {
                params: {
                    page: pageIndex,
                    limit: pageSize,
                    search: query || undefined,
                },
                headers: {
                    Authorization: `Bearer ${backendToken}`,
                },
            },
        )

        const { data, meta } = response.data

        // Map backend response to match CustomerListResponse format
        const mappedData = data.map((sekolah) => ({
            id: sekolah.id,
            npsn: sekolah.npsn,
            nama: sekolah.nama,
            alamat: sekolah.alamat,
            kota: sekolah.kota,
            provinsi: sekolah.provinsi,
            telepon: sekolah.telepon,
            email: sekolah.email,
            createdAt: sekolah.createdAt,
            updatedAt: sekolah.updatedAt,
            logoUrl: sekolah.logoUrl 
                ? sekolah.logoUrl.startsWith('http')
                    ? sekolah.logoUrl
                    : `http://localhost:3000${sekolah.logoUrl}`
                : undefined,
            _count: sekolah._count,
        }))

        return {
            customers: mappedData,
            total: meta.total,
            pageIndex: meta.page,
            pageSize: meta.limit,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
        }
    } catch (error: any) {
        console.error('[GetSekolahList] Error:', error.response?.data || error.message)
        return {
            customers: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
}
