"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar/Avatar";
import Notification from "@/components/ui/Notification";
import Tooltip from "@/components/ui/Tooltip";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { HiPencil, HiOutlineTrash } from "react-icons/hi";
import SekolahService from "@/service/SekolahService";
import { useRouter } from "next/navigation";

type SekolahInfoFieldProps = {
  title?: string;
  value?: string;
};

type ProfileSectionProps = {
  data: Partial<{
    id: string;
    logoUrl: string;
    nama: string;
    npsn: string;
    email: string;
    telepon: string;
    wilayahLabel?: string;
    alamatLengkap?: string;
    kelurahanKode?: string;
    // Legacy fields
    alamat?: string;
    kota?: string;
    provinsi?: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

const SekolahInfoField = ({ title, value }: SekolahInfoFieldProps) => {
  return (
    <div>
      <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">
        {title}
      </span>
      <p className="heading-text font-bold mt-1">{value || "-"}</p>
    </div>
  );
};

const ProfileSection = ({ data = {} }: ProfileSectionProps) => {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await SekolahService.deleteSekolah(data.id!);
      setDialogOpen(false);
      router.push("/sekolah");
      toast.push(
        <Notification title={"Berhasil Dihapus"} type="success">
          Sekolah berhasil dihapus
        </Notification>
      );
    } catch (error: any) {
      console.error("Error deleting sekolah:", error);
      toast.push(
        <Notification title={"Gagal"} type="danger">
          {error.response?.data?.message || "Gagal menghapus sekolah"}
        </Notification>
      );
    }
  };

  const handleEdit = () => {
    router.push(`/sekolah/editsekolah/${data.id}`);
  };

  return (
    <Card className="w-full">
      <div className="flex justify-end">
        <Tooltip title="Edit sekolah">
          <button
            className="close-button button-press-feedback"
            type="button"
            onClick={handleEdit}
          >
            <HiPencil />
          </button>
        </Tooltip>
      </div>
      <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
        <div className="flex xl:flex-col items-center gap-4 mt-6">
          <Avatar size={90} shape="circle" src={data.logoUrl || data.img}>
            {!data.logoUrl && !data.img && data.nama?.charAt(0).toUpperCase()}
          </Avatar>
          <h4 className="font-bold">{data.nama || data.name}</h4>
        </div>
        <div className="grid grid-cols-1 gap-y-7 mt-10">
          <SekolahInfoField title="NPSN" value={data.npsn} />
          <SekolahInfoField title="Email" value={data.email} />
          <SekolahInfoField title="Telepon" value={data.telepon} />
          {(data.kelurahan || data.kecamatan) && (
            <SekolahInfoField
              title="Wilayah"
              value={[data.kelurahan, data.kecamatan]
                .filter(Boolean)
                .join(", ")}
            />
          )}
          <SekolahInfoField
            title="Alamat Lengkap"
            value={data.alamatLengkap || data.alamat || "-"}
          />
        </div>
        <div className="flex flex-col gap-4 mt-10">
          <Button
            block
            customColorClass={() =>
              "text-error hover:border-error hover:ring-1 ring-error hover:text-error"
            }
            icon={<HiOutlineTrash />}
            onClick={handleDialogOpen}
          >
            Delete
          </Button>
        </div>
        <ConfirmDialog
          isOpen={dialogOpen}
          type="danger"
          title="Hapus Sekolah"
          onClose={handleDialogClose}
          onRequestClose={handleDialogClose}
          onCancel={handleDialogClose}
          onConfirm={handleDelete}
        >
          <p>
            Apakah Anda yakin ingin menghapus sekolah ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
        </ConfirmDialog>
      </div>
    </Card>
  );
};

export default ProfileSection;
