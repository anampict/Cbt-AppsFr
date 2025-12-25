import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

type RouteParams = {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        
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

        const response = await axios.get(
            `${BACKEND_URL}/sekolah/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SekolahAPI] GET Detail Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        
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

        const response = await axios.put(
            `${BACKEND_URL}/sekolah/${id}`,
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
        console.error('[SekolahAPI] PUT Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to update sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        
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

        const response = await axios.delete(
            `${BACKEND_URL}/sekolah/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SekolahAPI] DELETE Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to delete sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}
