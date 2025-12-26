"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import { useRouter } from "next/navigation";
import DomainService from "@/service/DomainService";
import {
  TbArrowNarrowLeft,
  TbTrash,
  TbCheck,
  TbX,
  TbShieldCheck,
  TbCalendar,
  TbLink,
  TbWorld,
  TbSchool,
  TbMapPin,
  TbPhone,
  TbMail,
} from "react-icons/tb";

interface DomainDetailsProps {
  data: {
    id: string;
    domain: string;
    customDomain: string;
    sslEnabled: boolean;
    isActive: boolean;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
    sekolahId: string;
    sekolah: {
      id: string;
      npsn: string;
      nama: string;
      alamat: string;
      kota: string;
      provinsi: string;
    };
  };
}

const DomainDetails = ({ data }: DomainDetailsProps) => {
  const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await DomainService.deleteDomain(data.id);

      toast.push(
        <Notification type="success">Domain berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );

      router.push("/domain");
    } catch (error: any) {
      console.error("Error deleting domain:", error);

      let errorMessage = "Gagal menghapus domain!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = new Date(data.expiredAt) < new Date();

  return (
    <>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="plain"
            size="sm"
            icon={<TbArrowNarrowLeft />}
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button
            variant="solid"
            size="sm"
            customColorClass={() =>
              "border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent"
            }
            icon={<TbTrash />}
            onClick={() => setDeleteConfirmation(true)}
          >
            Hapus Domain
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="mb-4">
            <div className="mb-6">
              <h4 className="font-bold mb-2">Informasi Domain</h4>
              <p className="text-sm text-gray-500">
                Detail lengkap domain sekolah
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbWorld className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Domain Utama</p>
                  <p className="font-semibold text-gray-900">{data.domain}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbLink className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Custom Domain</p>
                  <p className="font-semibold text-gray-900">
                    {data.customDomain}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbCalendar className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tanggal Expired</p>
                  <p
                    className={`font-semibold ${
                      isExpired ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {formatDate(data.expiredAt)}
                    {isExpired && (
                      <span className="ml-2 text-xs text-red-500">
                        (Sudah expired)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex-1 flex gap-4">
                  <div
                    className={`flex items-center gap-1.5 ${
                      data.isActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {data.isActive ? (
                      <>
                        <TbCheck className="text-base" />
                        <span className="text-sm font-medium">Aktif</span>
                      </>
                    ) : (
                      <>
                        <TbX className="text-base" />
                        <span className="text-sm font-medium">Nonaktif</span>
                      </>
                    )}
                  </div>
                  {data.sslEnabled && (
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <TbShieldCheck className="text-base" />
                      <span className="text-sm font-medium">SSL Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h5 className="font-bold mb-4">Informasi Sekolah</h5>

            <div className="flex items-start gap-4 mb-6">
              <Avatar
                size={60}
                shape="circle"
                className="bg-blue-100 text-blue-600"
              >
                <TbSchool className="text-2xl" />
              </Avatar>
              <div className="flex-1">
                <h6 className="font-bold text-gray-900 mb-1">
                  {data.sekolah.nama}
                </h6>
                <p className="text-sm text-gray-500">
                  NPSN: {data.sekolah.npsn}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbMapPin className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Alamat</p>
                  <p className="font-medium text-gray-900">
                    {data.sekolah.alamat}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbMapPin className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Kota</p>
                  <p className="font-medium text-gray-900">
                    {data.sekolah.kota}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TbMapPin className="text-xl text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Provinsi</p>
                  <p className="font-medium text-gray-900">
                    {data.sekolah.provinsi}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmation}
        type="danger"
        title="Hapus Domain"
        confirmText="Hapus"
        cancelText="Batal"
        onClose={() => setDeleteConfirmation(false)}
        onRequestClose={() => setDeleteConfirmation(false)}
        onCancel={() => setDeleteConfirmation(false)}
        onConfirm={handleDelete}
        confirmButtonColor="red-600"
        loading={deleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus domain{" "}
          <strong>{data.domain}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default DomainDetails;
