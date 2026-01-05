import axios from 'axios'
import { auth } from '@/auth'
import type { Siswa } from '@/app/(protected-pages)/siswa/types'

interface SiswaListResponse {
    message: string
    data: Siswa[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

export const getSiswaList = async (_queryParams: {
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
            siswas: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }

    try {
        const response = await axios.get<SiswaListResponse>(
            'http://localhost:3000/siswa',
            {
                params: {
                    page: pageIndex,
                    limit: pageSize,
                    search: query,
                },
                headers: {
                    Authorization: `Bearer ${backendToken}`,
                },
            },
        )

        const { data, meta } = response.data

        return {
            siswas: data,
            total: meta.total,
            pageIndex: meta.page,
            pageSize: meta.limit,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
        }
    } catch (error) {
        console.error('Error fetching siswa list:', error)
        return {
            siswas: [],
            total: 0,
            pageIndex: parseInt(pageIndex as string),
            pageSize: parseInt(pageSize as string),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
        }
    }
}
