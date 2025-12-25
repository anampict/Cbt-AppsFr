import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
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

        const formData = await request.formData()

        console.log('[SekolahAPI] POST /sekolah with bearer token')

        const response = await axios.post(
            `${BACKEND_URL}/sekolah`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SekolahAPI] POST Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to create sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}

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

        const searchParams = request.nextUrl.searchParams
        const params = Object.fromEntries(searchParams)

        const response = await axios.get(
            `${BACKEND_URL}/sekolah`,
            {
                params,
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SekolahAPI] GET Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}
