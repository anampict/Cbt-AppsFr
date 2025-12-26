export type Domain = {
    id: string
    domain: string
    customDomain: string
    sslEnabled: boolean
    isActive: boolean
    expiredAt: string
    createdAt: string
    updatedAt: string
    sekolahId: string
    sekolah: {
        id: string
        npsn: string
        nama: string
    }
}

export type GetDomainsListResponse = {
    list: Domain[]
    total: number
}

export type DomainFormData = {
    domain: string
    customDomain: string
    sslEnabled: boolean
    isActive: boolean
    expiredAt: string
    sekolahId: string
}

export type Filter = {
    status: string
    sekolah: string[]
}

// Legacy types - untuk backward compatibility
type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
    orderHistory: OrderHistory[]
    paymentMethod: PaymentMethod[]
    subscription: Subscription[]
    totalSpending: number
}
