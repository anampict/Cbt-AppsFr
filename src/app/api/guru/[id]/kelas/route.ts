import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

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
        const body = await request.json()

        const response = await axios.put(
            `${BACKEND_URL}/guru/${id}/kelas`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[GuruAPI] PUT Kelas Error:', error.response?.data || error.message)
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to update guru kelas' },
            { status: error.response?.status || 500 },
        )
    }
}
