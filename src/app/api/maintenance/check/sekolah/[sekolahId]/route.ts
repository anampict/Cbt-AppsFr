import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sekolahId: string }> }
) {
    try {
        const { sekolahId } = await params

        const response = await fetch(
            `${BACKEND_API_URL}/maintenance/check/sekolah/${sekolahId}`,
            {
                method: 'GET',
            }
        )

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to check maintenance' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Error checking maintenance:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
