"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import PaketService from "@/service/PaketService";
import NoUserFound from "@/assets/svg/NoUserFound";
import type { Paket } from "../../../types";
import {
  TbArrowLeft,
  TbPencil,
  TbTrash,
  TbCurrencyDollar,
  TbUsers,
  TbSchool,
  TbFileText,
  TbClipboardCheck,
  TbWorld,
  TbLock,
  TbTag,
  TbApi,
  TbCalendar,
  TbCheck,
  TbX,
  TbPackage,
} from "react-icons/tb";

interface PaketDetailContentProps {
  paketId: string;
}

const PaketDetailContent = ({ paketId }: PaketDetailContentProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paket, setPaket] = useState<Paket | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPaket();
  }, [paketId]);

  const fetchPaket = async () => {
    try {
      setLoading(true);
      const response = await PaketService.getPaketDetail(paketId);
      setPaket(response.data);
    } catch (error: any) {
      console.error("Error fetching paket:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal memuat data paket!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/paket-limit");
  };

  const handleEdit = () => {
    router.push(`/paket-limit/editpaket/${paketId}`);
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!paket) return;

    setIsDeleting(true);
    try {
      await PaketService.deletePaket(paket.id);
      toast.push(
        <Notification type="success">Paket berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );
      router.push("/paket-limit");
    } catch (error: any) {
      console.error("Error deleting paket:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus paket!"}
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size={40} />
      </div>
    );
  }

  if (!paket) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <NoUserFound height={280} width={280} />
        <h2 className="mt-4">Paket tidak ditemukan!</h2>
        <Button className="mt-4" onClick={handleBack}>
          Kembali
        </Button>
      </div>
    );
  }

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
          <h3 className="text-xl font-bold">Detail Paket</h3>
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
        {/* Package Overview Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center py-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mb-4">
              <TbPackage className="text-5xl" />
            </div>
            <h4 className="mt-2 mb-1 font-bold text-xl text-center">
              {paket.namaPaket}
            </h4>
            <p className="text-3xl font-bold text-primary-500 mb-3">
              {formatCurrency(paket.harga)}
            </p>
            {paket.isActive ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <TbCheck />
                Aktif
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
                <TbX />
                Nonaktif
              </Badge>
            )}
            {paket.deskripsi && (
              <p className="mt-4 text-sm text-gray-600 text-center px-4">
                {paket.deskripsi}
              </p>
            )}
          </div>
        </Card>

        {/* Package Details Card */}
        <Card className="lg:col-span-2">
          <h5 className="font-bold mb-6">Informasi Paket</h5>

          <div className="space-y-6">
            {/* Harga */}
            <div className="flex items-start gap-4">
              <div className="text-2xl text-gray-400 mt-1">
                <TbCurrencyDollar />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Harga</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(paket.harga)}
                </p>
              </div>
            </div>

            {/* Limits */}
            <div className="border-t pt-4">
              <h6 className="font-semibold mb-4 text-gray-700">Batasan</h6>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="text-xl text-gray-400 mt-1">
                    <TbUsers />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Siswa</p>
                    <p className="font-semibold">{paket.maxSiswa}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl text-gray-400 mt-1">
                    <TbSchool />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Guru</p>
                    <p className="font-semibold">{paket.maxGuru}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl text-gray-400 mt-1">
                    <TbFileText />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Soal</p>
                    <p className="font-semibold">{paket.maxSoal}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl text-gray-400 mt-1">
                    <TbClipboardCheck />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Ujian</p>
                    <p className="font-semibold">{paket.maxUjian}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4">
              <h6 className="font-semibold mb-4 text-gray-700">Fitur</h6>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl ${
                      paket.customDomain ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    <TbWorld />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Custom Domain</p>
                  </div>
                  {paket.customDomain ? (
                    <TbCheck className="text-green-500" />
                  ) : (
                    <TbX className="text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl ${
                      paket.sslEnabled ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    <TbLock />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">SSL Enabled</p>
                  </div>
                  {paket.sslEnabled ? (
                    <TbCheck className="text-green-500" />
                  ) : (
                    <TbX className="text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl ${
                      paket.whiteLabel ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    <TbTag />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">White Label</p>
                  </div>
                  {paket.whiteLabel ? (
                    <TbCheck className="text-green-500" />
                  ) : (
                    <TbX className="text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl ${
                      paket.apiAccess ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    <TbApi />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">API Access</p>
                  </div>
                  {paket.apiAccess ? (
                    <TbCheck className="text-green-500" />
                  ) : (
                    <TbX className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl text-gray-400 mt-1">
                  <TbCalendar />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tanggal Dibuat</p>
                  <p className="font-semibold">
                    {new Date(paket.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {paket.updatedAt && (
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-gray-400 mt-1">
                    <TbCalendar />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      Terakhir Diupdate
                    </p>
                    <p className="font-semibold">
                      {new Date(paket.updatedAt).toLocaleDateString("id-ID", {
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
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        type="danger"
        title="Hapus Paket"
        onClose={() => setDeleteConfirm(false)}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus paket{" "}
          <strong>{paket.namaPaket}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default PaketDetailContent;
