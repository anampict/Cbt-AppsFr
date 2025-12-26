'use server'

import { auth } from '@/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export const getDomain = async (params: { id: string }) => {
    try {
        const session = await auth()
        
        if (!session?.user) {
            console.error('No session found')
            return null
        }

        const backendToken = (session.user as any)?.backendToken
        if (!backendToken) {
            console.error('No backend token found')
            return null
        }

        const response = await fetch(`${BACKEND_URL}/domain/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${backendToken}`,
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            console.error('Failed to fetch domain:', response.status)
            return null
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching domain:', error)
        return null
    }
}
