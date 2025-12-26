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

        console.log(`[DomainAPI] GET /domain/${id} with bearer token`)

        const response = await axios.get(
            `${BACKEND_URL}/domain/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[DomainAPI] GET Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch domain' },
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
        const body = await request.json()

        console.log(`[DomainAPI] PUT /domain/${id} with data:`, body)

        const response = await axios.put(
            `${BACKEND_URL}/domain/${id}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${backendToken}`,
                },
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[DomainAPI] PUT Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to update domain' },
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

        console.log(`[DomainAPI] DELETE /domain/${id} with bearer token`)

        const response = await axios.delete(
            `${BACKEND_URL}/domain/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[DomainAPI] DELETE Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to delete domain' },
            { status: error.response?.status || 500 },
        )
    }
}
