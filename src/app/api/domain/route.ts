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

        const searchParams = request.nextUrl.searchParams
        const queryString = searchParams.toString()
        const url = queryString ? `?${queryString}` : ''

        console.log('[DomainAPI] GET /domain with bearer token')

        const response = await axios.get(
            `${BACKEND_URL}/domain${url}`,
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
            { message: error.response?.data?.message || 'Failed to fetch domains' },
            { status: error.response?.status || 500 },
        )
    }
}

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

        const body = await request.json()

        console.log('[DomainAPI] POST /domain with data:', body)

        const response = await axios.post(
            `${BACKEND_URL}/domain`,
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
        console.error('[DomainAPI] POST Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to create domain' },
            { status: error.response?.status || 500 },
        )
    }
}
