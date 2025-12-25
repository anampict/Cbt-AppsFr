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
        const session = await auth()
        
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

        const response = await axios.get(
            `${BACKEND_URL}/sekolah/${params.id}`,
            {
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth()
        
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

        const formData = await request.formData()

        const response = await axios.put(
            `${BACKEND_URL}/sekolah/${params.id}`,
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
            { message: error.response?.data?.message || 'Failed to update sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth()
        
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            )
        }

        const response = await axios.delete(
            `${BACKEND_URL}/sekolah/${params.id}`,
            {
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('API route error:', error)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to delete sekolah' },
            { status: error.response?.status || 500 },
        )
    }
}
