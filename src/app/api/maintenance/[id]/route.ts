import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const backendToken = (session?.user as any)?.backendToken

        if (!backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        const response = await fetch(`${BACKEND_API_URL}/maintenance/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${backendToken}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch maintenance' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error fetching maintenance:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const backendToken = (session?.user as any)?.backendToken

        if (!backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json()

        const response = await fetch(`${BACKEND_API_URL}/maintenance/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${backendToken}`,
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to update maintenance' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error updating maintenance:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const backendToken = (session?.user as any)?.backendToken

        if (!backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        const response = await fetch(`${BACKEND_API_URL}/maintenance/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${backendToken}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to delete maintenance' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error deleting maintenance:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
