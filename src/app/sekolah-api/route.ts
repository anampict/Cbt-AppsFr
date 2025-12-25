import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

        const formData = await request.formData()

        const response = await axios.post(
            `${BACKEND_URL}/sekolah`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('API route error:', error)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to create sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

        const searchParams = request.nextUrl.searchParams
        const params = Object.fromEntries(searchParams)

        const response = await axios.get(
            `${BACKEND_URL}/sekolah`,
            {
                params,
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('API route error:', error)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}
