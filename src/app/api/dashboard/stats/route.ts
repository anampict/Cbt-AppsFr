import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function GET() {
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

        console.log('[DashboardAPI] GET /dashboard/stats')

        const response = await axios.get(
            `${BACKEND_URL}/dashboard/stats`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            },
        )

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('[DashboardAPI] GET Stats Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to fetch dashboard stats' },
            { status: error.response?.status || 500 },
        )
    }
}
