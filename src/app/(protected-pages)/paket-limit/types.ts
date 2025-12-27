import type { KeyedMutator } from 'swr'

export type Paket = {
    id: string
    namaPaket: string
    deskripsi?: string
    harga: number
    maxDomain: number
    maxAdminSekolah: number
    maxSiswa: number
    maxGuru: number
    maxSoal: number
    maxUjian: number
    maxStorage: number
    customDomain: boolean
    sslEnabled: boolean
    whiteLabel: boolean
    apiAccess: boolean
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export type Pakets = Paket[]

export type GetPaketsResponse = {
    list: Pakets
    total: number
}

export type MutatePaketsResponse = KeyedMutator<GetPaketsResponse>
