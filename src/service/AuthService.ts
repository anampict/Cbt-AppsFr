import apiConfig from '@/configs/api.config'

/**
 * Response dari API backend
 * Format yang di-return oleh API sebenarnya
 */
export interface BackendLoginResponse {
    access_token?: string
    refresh_token?: string
    user?: {
        id: string
        name: string
        email: string
        role: string
        sekolahId?: string
        avatar?: string
    }
    success?: boolean
    message?: string
    data?: {
        id: string
        userName: string
        email: string
        avatar?: string
        authority?: string
        role?: string
        sekolahId?: string
    }
}

export interface LoginResponse {
    success: boolean
    message?: string
    data?: {
        id: string
        userName: string
        email: string
        avatar?: string
        authority?: string
        role?: string
        sekolahId?: string
    }
    access_token?: string
    refresh_token?: string
}

export interface LoginRequest {
    email: string
    password: string
}

const AuthService = {
    /**
     * Login dengan credentials (server-side)
     * @param credentials - Email dan password user
     * @returns Promise dengan user data dan tokens
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const endpoint = `${apiConfig.baseUrl}${apiConfig.endpoints.auth.login}`

            console.log('[AuthService.login] Calling endpoint:', endpoint)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            })

            console.log('[AuthService.login] Response status:', response.status)

            if (!response.ok) {
                const error = await response.json()
                console.error('[AuthService.login] API Error:', error)
                throw new Error(error.message || `HTTP ${response.status}`)
            }

            const backendResponse: BackendLoginResponse = await response.json()
            console.log('[AuthService.login] Raw response data:', JSON.stringify(backendResponse, null, 2))

            // Transform backend response to standard LoginResponse format
            let loginResponse: LoginResponse = {
                success: false,
                message: 'Invalid response format',
            }

            // Handle both formats: new format (success + data) and backend format (user + access_token)
            if (backendResponse.success && backendResponse.data) {
                // New format
                loginResponse = {
                    success: true,
                    message: backendResponse.message,
                    data: backendResponse.data,
                    access_token: backendResponse.access_token,
                    refresh_token: backendResponse.refresh_token,
                }
            } else if (backendResponse.user && backendResponse.access_token) {
                // Backend format - transform to standard format
                loginResponse = {
                    success: true,
                    message: 'Login berhasil',
                    data: {
                        id: backendResponse.user.id,
                        userName: backendResponse.user.name,
                        email: backendResponse.user.email,
                        avatar: backendResponse.user.avatar,
                        authority: backendResponse.user.role,
                        role: backendResponse.user.role,
                        sekolahId: backendResponse.user.sekolahId,
                    },
                    access_token: backendResponse.access_token,
                    refresh_token: backendResponse.refresh_token,
                }
            }

            console.log('[AuthService.login] Transformed response:', {
                success: loginResponse.success,
                hasData: !!loginResponse.data,
                userEmail: loginResponse.data?.email,
            })

            return loginResponse
        } catch (error) {
            console.error('[AuthService.login] Error:', {
                message: error instanceof Error ? error.message : String(error),
                error,
            })
            throw error
        }
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            const endpoint = `${apiConfig.baseUrl}${apiConfig.endpoints.auth.logout}`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Logout failed')
            }
        } catch (error) {
            console.error('[AuthService] Logout error:', error)
            throw error
        }
    },

    /**
     * Refresh authentication token
     */
    async refreshToken(): Promise<LoginResponse> {
        try {
            const endpoint = `${apiConfig.baseUrl}${apiConfig.endpoints.auth.refresh}`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Token refresh failed')
            }

            const data: LoginResponse = await response.json()
            return data
        } catch (error) {
            console.error('[AuthService] Refresh token error:', error)
            throw error
        }
    },
}

export default AuthService
