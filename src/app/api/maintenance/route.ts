import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const backendToken = (session?.user as any)?.backendToken

        if (!backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        const response = await fetch(`${BACKEND_API_URL}/maintenance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${backendToken}`,
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to create maintenance' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error creating maintenance:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const backendToken = (session?.user as any)?.backendToken

        if (!backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const queryString = searchParams.toString()
        const url = queryString
            ? `${BACKEND_API_URL}/maintenance?${queryString}`
            : `${BACKEND_API_URL}/maintenance`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${backendToken}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch maintenance list' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error fetching maintenance list:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
