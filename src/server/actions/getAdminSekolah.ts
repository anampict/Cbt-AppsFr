import { auth } from '@/auth'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export interface AdminSekolahData {
    id: string
    name: string
    email: string
    role: string
    sekolahId: string
    sekolah?: {
        id: string
        nama: string
        npsn: string
    }
    createdAt: string
    updatedAt?: string
}

const getAdminSekolah = async (_queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    const queryParams = _queryParams
    const { id } = queryParams

    try {
        const session = await auth()
        
        if (!session?.user) {
            console.error('[getAdminSekolah] No session found')
            return null
        }

        const backendToken = (session.user as any)?.backendToken
        if (!backendToken) {
            console.error('[getAdminSekolah] No backend token')
            return null
        }

        const response = await axios.get(
            `${BACKEND_URL}/admin-sekolah/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${backendToken}`,
                },
                withCredentials: true,
            }
        )

        return response.data.data as AdminSekolahData
    } catch (error: any) {
        console.error('[getAdminSekolah] Error:', error.response?.data || error.message)
        return null
    }
}

export default getAdminSekolah
