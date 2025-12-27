"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switcher from "@/components/ui/Switcher";
import Spinner from "@/components/ui/Spinner";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import PaketService from "@/service/PaketService";
import NoUserFound from "@/assets/svg/NoUserFound";
import type { Paket } from "../../../types";
import { TbArrowLeft } from "react-icons/tb";

interface PaketEditFormProps {
  paketId: string;
}

const PaketEditForm = ({ paketId }: PaketEditFormProps) => {
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paket, setPaket] = useState<Paket | null>(null);
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
    fetchPaket();
  }, [paketId]);

  const fetchPaket = async () => {
    try {
      setLoadingData(true);
      const response = await PaketService.getPaketDetail(paketId);
      const data = response.data;
      setPaket(data);
      setFormData({
        namaPaket: data.namaPaket,
        deskripsi: data.deskripsi || "",
        harga: data.harga,
        maxDomain: data.maxDomain,
        maxAdminSekolah: data.maxAdminSekolah,
        maxSiswa: data.maxSiswa,
        maxGuru: data.maxGuru,
        maxSoal: data.maxSoal,
        maxUjian: data.maxUjian,
        maxStorage: data.maxStorage,
        customDomain: data.customDomain,
        sslEnabled: data.sslEnabled,
        whiteLabel: data.whiteLabel,
        apiAccess: data.apiAccess,
        isActive: data.isActive,
      });
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
      setLoadingData(false);
    }
  };

  const handleBack = () => {
    router.push("/paket-limit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaPaket) {
      toast.push(
        <Notification type="warning">Nama paket harus diisi!</Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    if (formData.harga < 0) {
      toast.push(
        <Notification type="warning">Harga tidak boleh negatif!</Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);
      await PaketService.updatePaket(paketId, formData);

      toast.push(
        <Notification type="success">Paket berhasil diperbarui!</Notification>,
        {
          placement: "top-center",
        }
      );

      router.push("/paket-limit");
      router.refresh();
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

  if (loadingData) {
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
      <div className="mb-6 flex items-center gap-3">
        <Button
          size="sm"
          variant="plain"
          icon={<TbArrowLeft />}
          onClick={handleBack}
        >
          Kembali
        </Button>
        <h3 className="text-xl font-bold">Edit Paket</h3>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <h5 className="font-bold mb-4">Informasi Dasar</h5>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama paket"
                value={formData.namaPaket}
                onChange={(e) =>
                  setFormData({ ...formData, namaPaket: e.target.value })
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
                placeholder="Masukkan harga"
                value={formData.harga}
                onChange={(e) =>
                  setFormData({ ...formData, harga: Number(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Deskripsi
              </label>
              <Input
                textArea
                placeholder="Masukkan deskripsi paket"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Limits */}
            <div className="lg:col-span-2 mt-4">
              <h5 className="font-bold mb-4">Batasan</h5>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Max Domain
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.maxDomain}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDomain: Number(e.target.value),
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
                placeholder="0"
                value={formData.maxAdminSekolah}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAdminSekolah: Number(e.target.value),
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
                placeholder="0"
                value={formData.maxSiswa}
                onChange={(e) =>
                  setFormData({ ...formData, maxSiswa: Number(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Max Guru</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.maxGuru}
                onChange={(e) =>
                  setFormData({ ...formData, maxGuru: Number(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Max Soal</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.maxSoal}
                onChange={(e) =>
                  setFormData({ ...formData, maxSoal: Number(e.target.value) })
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
                placeholder="0"
                value={formData.maxUjian}
                onChange={(e) =>
                  setFormData({ ...formData, maxUjian: Number(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Max Storage (MB)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.maxStorage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStorage: Number(e.target.value),
                  })
                }
                disabled={loading}
              />
            </div>

            {/* Features */}
            <div className="lg:col-span-2 mt-4">
              <h5 className="font-bold mb-4">Fitur</h5>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">
                  Custom Domain
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan untuk mengizinkan custom domain
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
                <label className="block text-sm font-medium">SSL Enabled</label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan untuk mengizinkan SSL
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
                <label className="block text-sm font-medium">White Label</label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan untuk white label branding
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
                <label className="block text-sm font-medium">API Access</label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan untuk mengizinkan API access
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

            {/* Status */}
            <div className="lg:col-span-2 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">
                    Status Paket
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Aktifkan atau nonaktifkan paket
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

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="plain"
              onClick={handleBack}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default PaketEditForm;
