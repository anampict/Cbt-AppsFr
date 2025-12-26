'use server'

import DomainService from '@/service/DomainService'

const getDomains = async () => {
    try {
        const response = await DomainService.getListDomain()
        
        return {
            list: response.data || [],
            total: response.data?.length || 0,
        }
    } catch (error) {
        console.error('Error fetching domains:', error)
        return {
            list: [],
            total: 0,
        }
    }
}

export default getDomains
