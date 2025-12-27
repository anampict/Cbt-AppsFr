import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized - Not logged in' },
                { status: 401 },
            )
        }

        const backendToken = (session.user as any)?.backendToken
        if (!backendToken) {
            return NextResponse.json(
                { message: 'Unauthorized - No backend token' },
                { status: 401 },
            )
        }

        // Get search params
        const searchParams = request.nextUrl.searchParams
        const kotaKode = searchParams.get('kotaKode') || ''
        const search = searchParams.get('search') || ''
        const limit = searchParams.get('limit') || '10'

        if (!kotaKode) {
            return NextResponse.json(
                { message: 'Kota kode is required' },
                { status: 400 },
            )
        }

        console.log('[WilayahAPI] GET /wilayah/kecamatan', { kotaKode, search, limit })

        const response = await axios.get(
            `${BACKEND_URL}/wilayah/kecamatan`,
            {
                params: {
                    kotaKode,
                    search,
                    limit,
                },
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[WilayahAPI] GET Kecamatan Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch kecamatan' },
            { status: error.response?.status || 500 },
        )
    }
}
