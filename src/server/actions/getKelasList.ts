import axios from 'axios'
import { auth } from '@/auth'
import type { Kelas } from '@/app/(protected-pages)/kelas/types'

interface KelasListResponse {
    message: string
    data: Kelas[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export const getKelasList = async (_queryParams: {
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
            kelas: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }

    try {
        const response = await axios.get<KelasListResponse>(
            'http://localhost:3000/kelas',
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

        return {
            kelas: data,
            total: meta.total,
            pageIndex: meta.page,
            pageSize: meta.limit,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
        }
    } catch (error: any) {
        console.error('[GetKelasList] Error:', error.response?.data || error.message)
        return {
            kelas: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
}
