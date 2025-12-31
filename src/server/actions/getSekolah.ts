import axios from 'axios'
import { auth } from '@/auth'

interface SekolahDetail {
    id: string
    npsn: string
    nama: string
    alamat: string
    alamatLengkap?: string
    kelurahanKode?: string
    kecamatanKode?: string
    kotaKode?: string
    provinsiKode?: string
    kota: string
    provinsi: string
    kecamatan?: string
    kelurahan?: string
    wilayahLabel?: string
    paketId?: string
    paket?: {
        id: string
        namaPaket: string
    }
    telepon: string
    email: string
    createdAt: string
    updatedAt: string
    logoUrl?: string
    _count?: {
        siswas?: number
        mataPelajarans?: number
    }
}

export const getSekolah = async (_queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    const queryParams = _queryParams
    const { id } = queryParams

    const session = await auth()
    const backendToken = (session?.user as any)?.backendToken

    if (!backendToken) {
        return {}
    }

    try {
        const response = await axios.get<{ 
            message: string
            data: SekolahDetail 
        }>(
            `http://localhost:3000/sekolah/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${backendToken}`,
                },
            },
        )

        const sekolah = response.data.data

        // Convert relative path to full URL
        if (sekolah.logoUrl && !sekolah.logoUrl.startsWith('http')) {
            sekolah.logoUrl = `http://localhost:3000${sekolah.logoUrl}`
        }

        return sekolah
    } catch (error: any) {
        console.error('[GetSekolah] Error:', error.response?.data || error.message)
        return {}
    }
}
