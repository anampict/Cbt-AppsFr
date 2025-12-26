"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import AdminSekolahService, {
  type AdminSekolahResponse,
} from "@/service/AdminSekolahService";
import type { AdminSekolahData } from "@/server/actions/getAdminSekolah";
import {
  TbArrowLeft,
  TbPencil,
  TbTrash,
  TbMail,
  TbSchool,
  TbCalendar,
  TbShieldCheck,
} from "react-icons/tb";

interface AdminSekolahDetailContentProps {
  admin: AdminSekolahData;
}

const AdminSekolahDetailContent = ({
  admin,
}: AdminSekolahDetailContentProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBack = () => {
    router.push("/manajemenadmin");
  };

  const handleEdit = () => {
    router.push(`/manajemenadmin/editadmin/${admin.id}`);
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await AdminSekolahService.deleteAdminSekolah(admin.id);
      toast.push(
        <Notification type="success">
          Admin sekolah berhasil dihapus!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      router.push("/manajemenadmin");
    } catch (error: any) {
      console.error("Error deleting admin sekolah:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus admin sekolah!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const displayName = admin.name || "Nama Tidak Tersedia";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="plain"
            icon={<TbArrowLeft />}
            onClick={handleBack}
          >
            Kembali
          </Button>
          <h3 className="text-xl font-bold">Detail Admin Sekolah</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="solid"
            icon={<TbPencil />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="solid"
            color="red-500"
            icon={<TbTrash />}
            onClick={handleDeleteClick}
          >
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center py-6">
            <Avatar size={120} shape="circle">
              {firstLetter}
            </Avatar>
            <h4 className="mt-4 mb-1 font-bold text-xl">{displayName}</h4>
            <p className="text-gray-500 text-sm mb-3">{admin.email}</p>
            <Tag className="bg-blue-100 text-blue-800 border-0 font-semibold">
              {admin.role}
            </Tag>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <h5 className="font-bold mb-6">Informasi Admin</h5>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="text-2xl text-gray-400 mt-1">
                <TbMail />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold">{admin.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4">
              <div className="text-2xl text-gray-400 mt-1">
                <TbShieldCheck />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="font-semibold">{admin.role}</p>
              </div>
            </div>

            {/* Sekolah */}
            <div className="flex items-start gap-4">
              <div className="text-2xl text-gray-400 mt-1">
                <TbSchool />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Sekolah</p>
                <p className="font-semibold">{admin.sekolah?.nama || "-"}</p>
                {admin.sekolah?.npsn && (
                  <p className="text-sm text-gray-500 mt-1">
                    NPSN: {admin.sekolah.npsn}
                  </p>
                )}
              </div>
            </div>

            {/* Tanggal Dibuat */}
            <div className="flex items-start gap-4">
              <div className="text-2xl text-gray-400 mt-1">
                <TbCalendar />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Tanggal Dibuat</p>
                <p className="font-semibold">
                  {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Tanggal Update */}
            {admin.updatedAt && (
              <div className="flex items-start gap-4">
                <div className="text-2xl text-gray-400 mt-1">
                  <TbCalendar />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">
                    Terakhir Diperbarui
                  </p>
                  <p className="font-semibold">
                    {new Date(admin.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        type="danger"
        title="Hapus Admin Sekolah"
        onClose={() => setDeleteConfirm(false)}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus admin <strong>{admin.name}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default AdminSekolahDetailContent;
