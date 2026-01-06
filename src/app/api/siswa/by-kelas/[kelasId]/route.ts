import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ kelasId: string }> }
) {
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

        const { kelasId } = await params
        const { searchParams } = new URL(request.url)
        
        // Get query parameters
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '10'
        const search = searchParams.get('search') || ''

        console.log('[SiswaAPI] GET /siswa/by-kelas/:kelasId with bearer token', {
            kelasId,
            page,
            limit,
            search
        })

        // Build query string
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(search && { search }),
        })

        const response = await axios.get(
            `${BACKEND_URL}/siswa/by-kelas/${kelasId}?${queryParams.toString()}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SiswaAPI] GET Error:', error.response?.data)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to get siswa by kelas' },
            { status: error.response?.status || 500 },
        )
    }
}
