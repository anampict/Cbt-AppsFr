"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import MapelService from "@/service/MapelService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import type { Mapel } from "../types";

interface MapelEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mapel: Mapel | null;
  onSuccess?: () => void;
}

interface MapelFormData {
  kodeMapel: string;
  namaMapel: string;
  deskripsi: string;
}

const MapelEditDialog = ({
  isOpen,
  onClose,
  mapel,
  onSuccess,
}: MapelEditDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MapelFormData>({
    kodeMapel: "",
    namaMapel: "",
    deskripsi: "",
  });

  useEffect(() => {
    if (mapel) {
      setFormData({
        kodeMapel: mapel.kodeMapel,
        namaMapel: mapel.namaMapel,
        deskripsi: mapel.deskripsi || "",
      });
    }
  }, [mapel]);

  const handleCloseDialog = () => {
    setFormData({
      kodeMapel: "",
      namaMapel: "",
      deskripsi: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapel) return;

    if (!formData.kodeMapel || !formData.namaMapel) {
      toast.push(
        <Notification type="warning">
          Kode Mapel dan Nama Mapel harus diisi!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        kodeMapel: formData.kodeMapel,
        namaMapel: formData.namaMapel,
        deskripsi: formData.deskripsi || null,
      };

      await MapelService.updateMapel(mapel.id, data);

      toast.push(
        <Notification type="success">
          Mata pelajaran berhasil diupdate!
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
      console.error("Error updating mapel:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal mengupdate mata pelajaran!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseDialog}
      width={600}
      closable={!loading}
    >
      <div className="flex flex-col h-full justify-between">
        <h5 className="mb-4">Edit Mata Pelajaran</h5>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Kode Mapel <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: MTK, IPA, BIN"
                  value={formData.kodeMapel}
                  onChange={(e) =>
                    setFormData({ ...formData, kodeMapel: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Nama Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Matematika, IPA, Bahasa Indonesia"
                  value={formData.namaMapel}
                  onChange={(e) =>
                    setFormData({ ...formData, namaMapel: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi mata pelajaran (opsional)"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  disabled={loading}
                  className="input input-md h-32"
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
              Update
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default MapelEditDialog;
