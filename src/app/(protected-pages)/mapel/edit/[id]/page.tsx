"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import MapelService from "@/service/MapelService";
import { TbArrowLeft } from "react-icons/tb";
import type { Mapel } from "../../types";

export default function EditMapelPage() {
  const router = useRouter();
  const params = useParams();
  const mapelId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    kodeMapel: "",
    namaMapel: "",
    deskripsi: "",
  });

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const response = await MapelService.getMapelById(mapelId);
        const mapel = response.data;
        setFormData({
          kodeMapel: mapel.kodeMapel,
          namaMapel: mapel.namaMapel,
          deskripsi: mapel.deskripsi || "",
        });
      } catch (error) {
        console.error("Fetch mapel error:", error);
        toast.push(
          <Notification type="danger">
            Gagal memuat data mata pelajaran!
          </Notification>,
          {
            placement: "top-center",
          }
        );
        router.push("/mapel");
      } finally {
        setIsFetching(false);
      }
    };

    fetchMapel();
  }, [mapelId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.kodeMapel.trim() || !formData.namaMapel.trim()) {
      toast.push(
        <Notification type="warning">
          Kode Mapel dan Nama Mapel wajib diisi!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    setIsLoading(true);
    try {
      await MapelService.updateMapel(mapelId, {
        kodeMapel: formData.kodeMapel,
        namaMapel: formData.namaMapel,
        deskripsi: formData.deskripsi || null,
      });

      toast.push(
        <Notification type="success">
          Mata pelajaran berhasil diperbarui!
        </Notification>,
        {
          placement: "top-center",
        }
      );

      router.push("/mapel");
      router.refresh();
    } catch (error: any) {
      console.error("Update mapel error:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui mata pelajaran!";
      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Container>
        <AdaptiveCard>
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" />
          </div>
        </AdaptiveCard>
      </Container>
    );
  }

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Button
              variant="plain"
              size="sm"
              icon={<TbArrowLeft />}
              onClick={() => router.back()}
            />
            <h3>Edit Mata Pelajaran</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="kodeMapel" className="font-semibold">
                  Kode Mapel <span className="text-error">*</span>
                </label>
                <Input
                  id="kodeMapel"
                  name="kodeMapel"
                  placeholder="Contoh: MTK"
                  value={formData.kodeMapel}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="namaMapel" className="font-semibold">
                  Nama Mata Pelajaran <span className="text-error">*</span>
                </label>
                <Input
                  id="namaMapel"
                  name="namaMapel"
                  placeholder="Contoh: Matematika"
                  value={formData.namaMapel}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="deskripsi" className="font-semibold">
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                placeholder="Deskripsi mata pelajaran (opsional)"
                value={formData.deskripsi}
                onChange={handleChange}
                disabled={isLoading}
                className="input input-md h-32"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <Button
                type="button"
                variant="plain"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" variant="solid" loading={isLoading}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </AdaptiveCard>
    </Container>
  );
}
