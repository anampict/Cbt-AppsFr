import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params

        const response = await axios.get(
            `${BACKEND_URL}/siswa/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SiswaAPI] GET Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch siswa' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params
        const contentType = request.headers.get('content-type') || ''
        
        let data: any
        let headers: any = {
            'Authorization': `Bearer ${backendToken}`,
        }

        // Check if request has multipart/form-data (foto upload)
        if (contentType.includes('multipart/form-data')) {
            data = await request.formData()
            headers['Content-Type'] = 'multipart/form-data'
        } else {
            // Regular JSON update
            data = await request.json()
            headers['Content-Type'] = 'application/json'
        }

        const response = await axios.put(
            `${BACKEND_URL}/siswa/${id}`,
            data,
            {
                headers,
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SiswaAPI] PUT Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to update siswa' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params

        const response = await axios.delete(
            `${BACKEND_URL}/siswa/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[SiswaAPI] DELETE Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to delete siswa' },
            { status: error.response?.status || 500 },
        )
    }
}
