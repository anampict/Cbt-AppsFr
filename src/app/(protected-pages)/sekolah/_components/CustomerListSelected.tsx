'use client'

import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useCustomerListStore } from '../_store/customerListStore'
import { useRouter } from 'next/navigation'
import { TbChecks } from 'react-icons/tb'
import SekolahService from '@/service/SekolahService'

const CustomerListSelected = () => {
    const router = useRouter()
    const customerList = useCustomerListStore((state) => state.customerList)
    const setCustomerList = useCustomerListStore(
        (state) => state.setCustomerList,
    )
    const selectedCustomer = useCustomerListStore(
        (state) => state.selectedCustomer,
    )
    const setSelectAllCustomer = useCustomerListStore(
        (state) => state.setSelectAllCustomer,
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            // Delete each selected customer from the API
            await Promise.all(
                selectedCustomer
                    .filter((customer) => customer.id)
                    .map((customer) =>
                        SekolahService.deleteSekolah(customer.id!),
                    ),
            )
            
            const newCustomerList = customerList.filter((customer) => {
                return !selectedCustomer.some(
                    (selected) => selected.id === customer.id,
                )
            })
            setSelectAllCustomer([])
            setCustomerList(newCustomerList)
            setDeleteConfirmationOpen(false)
            
            toast.push(
                <Notification type="success">
                    {selectedCustomer.length} Sekolah berhasil dihapus!
                </Notification>,
                { placement: 'top-center' },
            )
            
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
            toast.push(
                <Notification type="danger">Gagal menghapus sekolah!</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedCustomer.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedCustomer.length}{' '}
                                                Sekolah
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    loading={isDeleting}
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Hapus Sekolah"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ loading: isDeleting }}
            >
                <p>
                    Apakah Anda yakin ingin menghapus {selectedCustomer.length} sekolah yang dipilih?
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListSelected
