/**
 * API Configuration
 * Centralized API endpoint configuration for clean and maintainable code
 */

export type ApiConfig = {
    baseUrl: string
    prefix: string
    endpoints: {
        auth: {
            login: string
            logout: string
            refresh: string
        }
        sekolah: {
            create: string
            list: string
            detail: string
            update: string
            delete: string
        }
    }
}

const apiConfig: ApiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    prefix: process.env.NEXT_PUBLIC_API_PREFIX || '/api',
    endpoints: {
        auth: {
            login: process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || '/auth/login',
            logout: '/auth/logout',
            refresh: '/auth/refresh',
        },
        sekolah: {
            create: '/sekolah',
            list: '/sekolah',
            detail: '/sekolah',
            update: '/sekolah',
            delete: '/sekolah',
        },
    },
}

export default apiConfig
