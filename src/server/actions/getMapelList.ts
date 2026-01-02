import axios from 'axios'
import { auth } from '@/auth'
import type { Mapel } from '@/app/(protected-pages)/mapel/types'

interface MapelListResponse {
    message: string
    data: Mapel[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export const getMapelList = async (_queryParams: {
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
            mapels: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }

    try {
        const response = await axios.get<MapelListResponse>(
            'http://localhost:3000/mapel',
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
        const mappedData = data.map((mapel) => ({
            id: mapel.id,
            kodeMapel: mapel.kodeMapel,
            namaMapel: mapel.namaMapel,
            deskripsi: mapel.deskripsi,
            sekolahId: mapel.sekolahId,
            createdAt: mapel.createdAt,
            updatedAt: mapel.updatedAt,
            sekolah: mapel.sekolah,
            guru: mapel.guru,
        }))

        return {
            mapels: mappedData,
            total: meta.total,
            pageIndex: meta.page,
            pageSize: meta.limit,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
        }
    } catch (error: any) {
        console.error('[GetMapelList] Error:', error.response?.data || error.message)
        return {
            mapels: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
}
