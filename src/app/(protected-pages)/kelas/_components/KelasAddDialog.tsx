"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import KelasService from "@/service/KelasService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import type { KelasFormData } from "../types";

interface KelasAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const tingkatOptions = [
  { label: "10 (X)", value: 10 },
  { label: "11 (XI)", value: 11 },
  { label: "12 (XII)", value: 12 },
];

const KelasAddDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: KelasAddDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KelasFormData>({
    namaKelas: "",
    tingkat: 10,
    jurusan: "",
  });

  const handleCloseDialog = () => {
    setFormData({
      namaKelas: "",
      tingkat: 10,
      jurusan: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaKelas || !formData.tingkat || !formData.jurusan) {
      toast.push(
        <Notification type="warning">Semua field harus diisi!</Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);

      // Prepare JSON data
      const data = {
        namaKelas: formData.namaKelas,
        tingkat: formData.tingkat,
        jurusan: formData.jurusan,
      };

      await KelasService.createKelas(data);

      toast.push(
        <Notification type="success">Kelas berhasil ditambahkan!</Notification>,
        {
          placement: "top-center",
        }
      );

      handleCloseDialog();

      // Call onSuccess callback to refresh the table
      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error creating kelas:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan kelas!"}
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
        <h5 className="mb-4">Tambah Kelas</h5>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Nama Kelas <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: X IPA 1"
                  value={formData.namaKelas}
                  onChange={(e) =>
                    setFormData({ ...formData, namaKelas: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Tingkat <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih tingkat"
                  options={tingkatOptions}
                  value={tingkatOptions.find(
                    (opt) => opt.value === formData.tingkat
                  )}
                  onChange={(option) => {
                    if (option) {
                      setFormData({
                        ...formData,
                        tingkat: option.value as number,
                      });
                    }
                  }}
                  isDisabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: IPA, IPS, TKJ, MM"
                  value={formData.jurusan}
                  onChange={(e) =>
                    setFormData({ ...formData, jurusan: e.target.value })
                  }
                  disabled={loading}
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

export default KelasAddDialog;
