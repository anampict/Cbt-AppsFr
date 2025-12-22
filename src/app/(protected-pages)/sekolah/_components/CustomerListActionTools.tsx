'use client'

import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useCustomerListStore } from '../_store/customerListStore'
import dynamic from 'next/dynamic'
import { IoIosAddCircleOutline } from "react-icons/io";

const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), {
    ssr: false,
})

const CustomerListActionTools = () => {
    const router = useRouter()

    const customerList = useCustomerListStore((state) => state.customerList)

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="customerList.csv"
                data={customerList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Download
                </Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<IoIosAddCircleOutline className="text-xl" />}
                onClick={() =>
                    router.push('/sekolah/tambahsekolah')
                }
            >
                Tambah
            </Button>
        </div>
    )
}

export default CustomerListActionTools
