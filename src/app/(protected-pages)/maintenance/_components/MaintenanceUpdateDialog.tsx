"use client";

import { useState, ReactNode } from "react";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import MaintenanceService from "@/service/MaintenanceService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import type { Maintenance } from "../types";

interface MaintenanceUpdateDialogProps {
  maintenance: Maintenance;
  onSuccess?: () => void;
  trigger: ReactNode;
}

const MaintenanceUpdateDialog = ({
  maintenance,
  onSuccess,
  trigger,
}: MaintenanceUpdateDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tanggalSelesai: new Date(),
    keterangan: maintenance.keterangan,
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFormData({
      tanggalSelesai: new Date(),
      keterangan: maintenance.keterangan,
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tanggalSelesai) {
      toast.push(
        <Notification type="warning">
          Tanggal selesai harus diisi!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        status: "DONE" as const,
        tanggalSelesai: formData.tanggalSelesai.toISOString(),
        keterangan: formData.keterangan,
      };

      console.log("Updating maintenance with payload:", payload);

      await MaintenanceService.updateMaintenance(maintenance.id, payload);

      toast.push(
        <Notification type="success">
          Maintenance berhasil diselesaikan!
        </Notification>,
        {
          placement: "top-center",
        }
      );

      handleCloseDialog();

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error updating maintenance:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Gagal menyelesaikan maintenance!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={handleOpenDialog}>{trigger}</div>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={600}
      >
        <h5 className="mb-4">Selesaikan Maintenance</h5>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              {/* Info Sekolah */}
              <div className="col-span-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sekolah
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {maintenance.sekolah?.nama}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  NPSN: {maintenance.sekolah?.npsn}
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-semibold">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  placeholder="Pilih Tanggal Selesai"
                  value={formData.tanggalSelesai}
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      tanggalSelesai: date || new Date(),
                    });
                  }}
                  inputFormat="DD/MM/YYYY HH:mm"
                  disabled={loading}
                />
              </div>

              {/* Keterangan */}
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-semibold">
                  Keterangan
                </label>
                <Input
                  textArea
                  placeholder="Masukkan keterangan penyelesaian"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keterangan: e.target.value,
                    })
                  }
                  disabled={loading}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="plain"
              onClick={handleCloseDialog}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              Selesaikan
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default MaintenanceUpdateDialog;
