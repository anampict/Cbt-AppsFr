import axios from 'axios'
import { auth } from '@/auth'
import type { Guru } from '@/app/(protected-pages)/guru/types'

interface GuruListResponse {
    message: string
    data: Guru[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export const getGuruList = async (_queryParams: {
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
            gurus: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }

    try {
        const response = await axios.get<GuruListResponse>(
            'http://localhost:3000/guru',
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

        // Map backend response
        const mappedData = data.map((guru) => ({
            id: guru.id,
            nip: guru.nip,
            nama: guru.nama,
            email: guru.email,
            telepon: guru.telepon,
            alamat: guru.alamat,
            sekolahId: guru.sekolahId,
            createdAt: guru.createdAt,
            updatedAt: guru.updatedAt,
            sekolah: guru.sekolah,
            mapel: guru.mapel,
            kelas: guru.kelas,
            fotoUrl: guru.fotoUrl 
                ? guru.fotoUrl.startsWith('http')
                    ? guru.fotoUrl
                    : `http://localhost:3000${guru.fotoUrl}`
                : undefined,
        }))

        return {
            gurus: mappedData,
            total: meta.total,
            pageIndex: meta.page,
            pageSize: meta.limit,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
        }
    } catch (error: any) {
        console.error('[GetGuruList] Error:', error.response?.data || error.message)
        return {
            gurus: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
}
