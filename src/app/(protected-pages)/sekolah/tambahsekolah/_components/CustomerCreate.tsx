"use client";
import { useState } from "react";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import CustomerForm from "@/components/views/formtambahsekolah/CustomerForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import sleep from "@/utils/sleep";
import { TbTrash } from "react-icons/tb";
import { useRouter } from "next/navigation";
import SekolahService from "@/service/SekolahService";
import type { CustomerFormSchema } from "@/components/views/formtambahsekolah/types";

const CustomerEdit = () => {
  const router = useRouter();

  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleFormSubmit = async (values: CustomerFormSchema) => {
    setIsSubmiting(true);
    try {
      const response = await SekolahService.createSekolah({
        npsn: values.npsn,
        nama: values.nama,
        alamat: values.alamat,
        kota: values.kota,
        provinsi: values.provinsi,
        telepon: values.telepon,
        email: values.email,
        paketId: values.paketId,
        logo: values.logo instanceof File ? values.logo : undefined,
      });

      toast.push(
        <Notification type="success">
          Sekolah berhasil ditambahkan!
        </Notification>,
        { placement: "top-center" }
      );

      await sleep(800);
      router.push("/sekolah");
    } catch (error: any) {
      console.error("Error creating sekolah:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan sekolah!";
      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleConfirmDiscard = () => {
    setDiscardConfirmationOpen(false);
    toast.push(
      <Notification type="success">Perubahan dibatalkan!</Notification>,
      { placement: "top-center" }
    );
    router.push("/sekolah");
  };

  const handleDiscard = () => {
    setDiscardConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDiscardConfirmationOpen(false);
  };

  return (
    <>
      <CustomerForm
        newCustomer
        defaultValues={{
          npsn: "",
          nama: "",
          email: "",
          telepon: "",
          provinsi: "",
          alamat: "",
          kota: "",
          paketId: "",
          logo: "",
          tags: [],
        }}
        onFormSubmit={handleFormSubmit}
      >
        <Container>
          <div className="flex items-center justify-between px-8">
            <span></span>
            <div className="flex items-center">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                customColorClass={() =>
                  "border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent"
                }
                icon={<TbTrash />}
                onClick={handleDiscard}
              >
                Batal
              </Button>
              <Button variant="solid" type="submit" loading={isSubmiting}>
                Simpan
              </Button>
            </div>
          </div>
        </Container>
      </CustomerForm>
      <ConfirmDialog
        isOpen={discardConfirmationOpen}
        type="danger"
        title="Batalkan Perubahan"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDiscard}
      >
        <p>
          Apakah Anda yakin ingin membatalkan ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default CustomerEdit;
