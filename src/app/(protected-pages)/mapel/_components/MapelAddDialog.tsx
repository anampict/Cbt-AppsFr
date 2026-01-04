"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import MapelService from "@/service/MapelService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";

interface MapelAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MapelFormData {
  kodeMapel: string;
  namaMapel: string;
  deskripsi: string;
}

const MapelAddDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: MapelAddDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MapelFormData>({
    kodeMapel: "",
    namaMapel: "",
    deskripsi: "",
  });

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

      await MapelService.createMapel(data);

      toast.push(
        <Notification type="success">
          Mata pelajaran berhasil ditambahkan!
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
      console.error("Error creating mapel:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan mata pelajaran!"}
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
        <h5 className="mb-4">Tambah Mata Pelajaran</h5>
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
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default MapelAddDialog;
