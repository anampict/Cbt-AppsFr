import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    npsn: string
    nama: string
    email: string
    telepon: string
    logo?: File | string
}

export type AddressFields = {
    provinsi: string
    alamat: string
    kota: string
    paketId?: string
}

export type ProfileImageFields = {
    logo?: File | string
}

export type TagsFields = {
    tags?: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type CustomerFormSchema = OverviewFields &
    AddressFields &
    ProfileImageFields &
    TagsFields &
    AccountField

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
