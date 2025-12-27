"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Switcher from "@/components/ui/Switcher";
import { TbPlus } from "react-icons/tb";
import PaketService from "@/service/PaketService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";

interface PaketAddDialogProps {
  onSuccess?: () => void;
}

const PaketAddDialog = ({ onSuccess }: PaketAddDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaPaket: "",
    deskripsi: "",
    harga: "" as any,
    maxDomain: 1,
    maxAdminSekolah: 3,
    maxSiswa: 100,
    maxGuru: 10,
    maxSoal: 500,
    maxUjian: 20,
    maxStorage: 1024,
    customDomain: false,
    sslEnabled: false,
    whiteLabel: false,
    apiAccess: false,
    isActive: true,
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      namaPaket: "",
      deskripsi: "",
      harga: "" as any,
      maxDomain: 1,
      maxAdminSekolah: 3,
      maxSiswa: 100,
      maxGuru: 10,
      maxSoal: 500,
      maxUjian: 20,
      maxStorage: 1024,
      customDomain: false,
      sslEnabled: false,
      whiteLabel: false,
      apiAccess: false,
      isActive: true,
    });
  };

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
      await PaketService.createPaket({
        ...formData,
        harga: hargaValue,
      });

      toast.push(
        <Notification type="success">Paket berhasil ditambahkan!</Notification>,
        {
          placement: "top-center",
        }
      );

      handleCloseDialog();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating paket:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan paket!"}
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
    <>
      <Button
        variant="solid"
        size="sm"
        icon={<TbPlus />}
        onClick={handleOpenDialog}
      >
        Tambah Paket
      </Button>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={700}
      >
        <h5 className="mb-4">Tambah Paket Baru</h5>
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
                <h6 className="mb-3 text-sm font-semibold">
                  Limit Sumber Daya
                </h6>
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
                      <label className="text-sm font-medium">
                        Custom Domain
                      </label>
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
                      <label className="text-sm font-medium">
                        Status Aktif
                      </label>
                      <p className="text-xs text-gray-500">
                        Aktifkan paket ini
                      </p>
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
      </Dialog>
    </>
  );
};

export default PaketAddDialog;
