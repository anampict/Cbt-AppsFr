"use client";

import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Switcher from "@/components/ui/Switcher";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import PaketService from "@/service/PaketService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import type { Paket } from "../types";

interface PaketEditDialogProps {
  paket: Paket;
  isOpen: boolean;
  onClose: () => void;
}

const PaketEditDialog = ({ paket, isOpen, onClose }: PaketEditDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaPaket: "",
    deskripsi: "",
    harga: 0,
    maxDomain: 0,
    maxAdminSekolah: 0,
    maxSiswa: 0,
    maxGuru: 0,
    maxSoal: 0,
    maxUjian: 0,
    maxStorage: 0,
    customDomain: false,
    sslEnabled: false,
    whiteLabel: false,
    apiAccess: false,
    isActive: true,
  });

  useEffect(() => {
    if (paket) {
      setFormData({
        namaPaket: paket.namaPaket,
        deskripsi: paket.deskripsi || "",
        harga: paket.harga,
        maxDomain: paket.maxDomain,
        maxAdminSekolah: paket.maxAdminSekolah,
        maxSiswa: paket.maxSiswa,
        maxGuru: paket.maxGuru,
        maxSoal: paket.maxSoal,
        maxUjian: paket.maxUjian,
        maxStorage: paket.maxStorage,
        customDomain: paket.customDomain,
        sslEnabled: paket.sslEnabled,
        whiteLabel: paket.whiteLabel,
        apiAccess: paket.apiAccess,
        isActive: paket.isActive,
      });
    }
  }, [paket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hargaValue =
      typeof formData.harga === "string"
        ? parseInt(formData.harga)
        : formData.harga;

    if (!formData.namaPaket || !hargaValue || hargaValue <= 0) {
      toast.push(
        <Notification type="warning">
          Nama paket dan harga harus diisi!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);
      await PaketService.updatePaket(paket.id, {
        ...formData,
        harga: hargaValue,
      });

      toast.push(
        <Notification type="success">Paket berhasil diperbarui!</Notification>,
        {
          placement: "top-center",
        }
      );

      onClose();
    } catch (error: any) {
      console.error("Error updating paket:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal memperbarui paket!"}
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
      onClose={onClose}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
      width={700}
    >
      <h5 className="mb-4">Edit Paket</h5>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {/* Informasi Dasar */}
            <div className="border-b pb-4">
              <h6 className="mb-3 text-sm font-semibold">Informasi Dasar</h6>
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Basic, Pro, Enterprise"
                    value={formData.namaPaket}
                    onChange={(e) =>
                      setFormData({ ...formData, namaPaket: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Deskripsi
                  </label>
                  <Input
                    type="text"
                    placeholder="Deskripsi paket"
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="500000"
                    prefix="Rp"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        harga: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Limit Sumber Daya */}
            <div className="border-b pb-4">
              <h6 className="mb-3 text-sm font-semibold">Limit Sumber Daya</h6>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Domain
                  </label>
                  <Input
                    type="number"
                    value={formData.maxDomain}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDomain: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Admin Sekolah
                  </label>
                  <Input
                    type="number"
                    value={formData.maxAdminSekolah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAdminSekolah: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Siswa
                  </label>
                  <Input
                    type="number"
                    value={formData.maxSiswa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxSiswa: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Guru
                  </label>
                  <Input
                    type="number"
                    value={formData.maxGuru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxGuru: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Soal
                  </label>
                  <Input
                    type="number"
                    value={formData.maxSoal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxSoal: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Max Ujian
                  </label>
                  <Input
                    type="number"
                    value={formData.maxUjian}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUjian: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Max Storage (MB)
                  </label>
                  <Input
                    type="number"
                    value={formData.maxStorage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxStorage: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Fitur Tambahan */}
            <div className="border-b pb-4">
              <h6 className="mb-3 text-sm font-semibold">Fitur Tambahan</h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Custom Domain</label>
                    <p className="text-xs text-gray-500">
                      Izinkan pengguna menggunakan domain sendiri
                    </p>
                  </div>
                  <Switcher
                    checked={formData.customDomain}
                    onChange={(checked) =>
                      setFormData({ ...formData, customDomain: checked })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">SSL Enabled</label>
                    <p className="text-xs text-gray-500">
                      Aktifkan sertifikat SSL
                    </p>
                  </div>
                  <Switcher
                    checked={formData.sslEnabled}
                    onChange={(checked) =>
                      setFormData({ ...formData, sslEnabled: checked })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">White Label</label>
                    <p className="text-xs text-gray-500">
                      Sembunyikan branding aplikasi
                    </p>
                  </div>
                  <Switcher
                    checked={formData.whiteLabel}
                    onChange={(checked) =>
                      setFormData({ ...formData, whiteLabel: checked })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">API Access</label>
                    <p className="text-xs text-gray-500">
                      Berikan akses ke API eksternal
                    </p>
                  </div>
                  <Switcher
                    checked={formData.apiAccess}
                    onChange={(checked) =>
                      setFormData({ ...formData, apiAccess: checked })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Status Aktif</label>
                    <p className="text-xs text-gray-500">Aktifkan paket ini</p>
                  </div>
                  <Switcher
                    checked={formData.isActive}
                    onChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="plain"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" variant="solid" loading={loading}>
            Simpan
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default PaketEditDialog;
