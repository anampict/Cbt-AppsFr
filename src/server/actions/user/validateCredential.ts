'use server'
import type { SignInCredential } from '@/@types/auth'
import AuthService from '@/service/AuthService'

export interface ValidatedUser {
    id: string
    userName: string
    email: string
    avatar?: string
    authority?: string
    backendToken?: string
    role?: string
    sekolahId?: string
}

const validateCredential = async (values: SignInCredential): Promise<ValidatedUser | null> => {
    /**
     * Authenticate dengan backend API
     * Request ke API backend dengan credentials yang diberikan
     */
    const { email, password } = values

    try {
        console.log('[validateCredential] Attempting login for:', email)
        
        const response = await AuthService.login({ email, password })
        
        console.log('[validateCredential] Login response:', {
            success: response.success,
            hasData: !!response.data,
            hasToken: !!response.access_token,
        })

        if (response.success && response.data) {
            const user: ValidatedUser = {
                id: response.data.id,
                userName: response.data.userName,
                email: response.data.email,
                avatar: response.data.avatar,
                authority: response.data.authority,
                backendToken: response.access_token,
                role: response.data.role,
                sekolahId: response.data.sekolahId,
            }
            console.log('[validateCredential] Login successful for user:', email)
            return user
        }

        console.warn(
            '[validateCredential] Login failed - invalid response:',
            response.message
        )
        return null
    } catch (error) {
        console.error('[validateCredential] Error:', {
            message: error instanceof Error ? error.message : String(error),
            error,
        })
        return null
    }
}

export default validateCredential
