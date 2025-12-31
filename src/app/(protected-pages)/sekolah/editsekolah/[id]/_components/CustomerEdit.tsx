"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CustomerForm from "@/components/views/formeditsekolah";
import sleep from "@/utils/sleep";
import { TbTrash, TbArrowNarrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import SekolahService from "@/service/SekolahService";
import { revalidateSekolahPages } from "../actions";
import type { CustomerFormSchema } from "@/components/views/formeditsekolah/types";
import type { Customer } from "../types";

type CustomerEditProps = {
  data: Customer;
};

const CustomerEdit = ({ data }: CustomerEditProps) => {
  const router = useRouter();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleFormSubmit = async (values: CustomerFormSchema) => {
    console.log("Update sekolah:", values);
    setIsSubmiting(true);
    try {
      // Pass object to SekolahService, it will convert to FormData
      const response = await SekolahService.updateSekolah(data.id, {
        npsn: values.npsn,
        nama: values.nama,
        email: values.email,
        telepon: values.telepon,
        kelurahanKode: values.kelurahanKode,
        alamatLengkap: values.alamatLengkap,
        paketId: values.paketId,
        logo: values.logo instanceof File ? values.logo : undefined,
      });

      toast.push(
        <Notification type="success">Sekolah berhasil diubah!</Notification>,
        { placement: "top-center" }
      );

      // Revalidate halaman sekolah
      await revalidateSekolahPages();

      // Force refresh router cache
      router.refresh();

      await sleep(500);

      // Redirect ke halaman list
      router.push("/sekolah");
    } catch (error: any) {
      console.error("Error updating sekolah:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  const getDefaultValues = () => {
    if (data) {
      // Susun wilayahLabel dari data backend
      const wilayahParts = [data.kelurahan, data.kecamatan].filter(Boolean);
      const wilayahLabel =
        wilayahParts.length > 0 ? wilayahParts.join(", ") : "";

      return {
        npsn: data.npsn || "",
        nama: data.nama || "",
        email: data.email || "",
        telepon: data.telepon || "",
        kelurahanKode: data.kelurahanKode || "",
        alamatLengkap: data.alamatLengkap || "",
        wilayahLabel: wilayahLabel,
        paketId: data.paketId || "",
        logo: data.logoUrl || "",
      };
    }

    return {};
  };

  const handleConfirmDelete = async () => {
    try {
      await SekolahService.deleteSekolah(data.id);
      toast.push(
        <Notification type="success">Sekolah berhasil dihapus!</Notification>,
        { placement: "top-center" }
      );
      router.push("/sekolah");
    } catch (error: any) {
      console.error("Error deleting sekolah:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    }
    setDeleteConfirmationOpen(false);
  };

  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <CustomerForm
        defaultValues={getDefaultValues() as CustomerFormSchema}
        newCustomer={false}
        onFormSubmit={handleFormSubmit}
      >
        <Container>
          <div className="flex items-center justify-between px-8">
            <Button
              className="ltr:mr-3 rtl:ml-3"
              type="button"
              variant="plain"
              icon={<TbArrowNarrowLeft />}
              onClick={handleBack}
            >
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="plain"
                size="sm"
                icon={<TbTrash className="text-error" />}
                onClick={handleDelete}
              />
              <Button variant="solid" type="submit" loading={isSubmiting}>
                Save
              </Button>
            </div>
          </div>
        </Container>
      </CustomerForm>
      <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Hapus Sekolah"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      >
        <p>
          Apakah Anda yakin ingin menghapus sekolah ini? Tindakan ini tidak
          dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default CustomerEdit;
