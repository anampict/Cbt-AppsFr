/**
 * API Route: POST /api/auth/login
 * Handles user authentication
 *
 * Request body:
 * {
 *   email: string
 *   password: string
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   data: {
 *     id: string
 *     userName: string
 *     email: string
 *     avatar: string
 *     authority: string
 *   }
 *   access_token: string
 *   refresh_token: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import type { LoginResponse } from '@/service/AuthService'

// Mock user data - Replace with database query
const MOCK_USERS = [
    {
        id: '1',
        userName: 'Super Admin',
        email: 'superadmin@cbt.com',
        password: 'superadmin123', // In production, use bcrypt
        avatar: '/img/avatars/thumb-1.jpg',
        authority: 'SUPERADMIN',
    },
    {
        id: '2',
        userName: 'Admin User',
        email: 'admin@cbt.com',
        password: 'admin123',
        avatar: '/img/avatars/thumb-2.jpg',
        authority: 'ADMIN',
    },
    {
        id: '3',
        userName: 'Regular User',
        email: 'user@cbt.com',
        password: 'user123',
        avatar: '/img/avatars/thumb-3.jpg',
        authority: 'USER',
    },
]

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        console.log('[API /auth/login] Received request:', { email })

        // Validation
        if (!email || !password) {
            console.warn('[API /auth/login] Missing credentials')
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email dan password harus diisi',
                },
                { status: 400 }
            )
        }

        // Find user
        const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        )

        if (!user) {
            console.warn('[API /auth/login] User not found:', { email })
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email atau password salah',
                },
                { status: 401 }
            )
        }

        // Generate mock tokens (in production, use JWT)
        const accessToken = Buffer.from(
            `${user.id}-${Date.now()}`
        ).toString('base64')
        const refreshToken = Buffer.from(
            `${user.id}-${Date.now()}-refresh`
        ).toString('base64')

        const response: LoginResponse = {
            success: true,
            message: 'Login berhasil',
            data: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                avatar: user.avatar,
                authority: user.authority,
            },
            access_token: accessToken,
            refresh_token: refreshToken,
        }

        console.log('[API /auth/login] Login successful:', {
            userId: user.id,
            email: user.email,
            responseKeys: Object.keys(response),
        })

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.error('[API /auth/login] Error:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan pada server',
            },
            { status: 500 }
        )
    }
}
