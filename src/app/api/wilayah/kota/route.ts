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
        const provinsiKode = searchParams.get('provinsiKode') || ''
        const search = searchParams.get('search') || ''
        const limit = searchParams.get('limit') || '10'

        if (!provinsiKode) {
            return NextResponse.json(
                { message: 'Provinsi kode is required' },
                { status: 400 },
            )
        }

        console.log('[WilayahAPI] GET /wilayah/kota', { provinsiKode, search, limit })

        const response = await axios.get(
            `${BACKEND_URL}/wilayah/kota`,
            {
                params: {
                    provinsiKode,
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
        console.error('[WilayahAPI] GET Kota Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch kota' },
            { status: error.response?.status || 500 },
        )
    }
}
