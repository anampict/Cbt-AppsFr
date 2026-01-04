"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import MapelService from "@/service/MapelService";
import { TbArrowLeft, TbPencil } from "react-icons/tb";
import type { Mapel } from "../types";

export default function DetailMapelPage() {
  const router = useRouter();
  const params = useParams();
  const mapelId = params.id as string;

  const [mapel, setMapel] = useState<Mapel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const response = await MapelService.getMapelById(mapelId);
        setMapel(response.data);
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
        setIsLoading(false);
      }
    };

    fetchMapel();
  }, [mapelId, router]);

  if (isLoading) {
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

  if (!mapel) {
    return (
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-500">Mata pelajaran tidak ditemukan</p>
            <Button onClick={() => router.push("/mapel")}>
              Kembali ke Daftar Mapel
            </Button>
          </div>
        </AdaptiveCard>
      </Container>
    );
  }

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="plain"
                size="sm"
                icon={<TbArrowLeft />}
                onClick={() => router.back()}
              />
              <h3>Detail Mata Pelajaran</h3>
            </div>
            <Button
              variant="solid"
              icon={<TbPencil />}
              onClick={() => router.push(`/mapel/edit/${mapel.id}`)}
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Kode Mapel
              </label>
              <p className="font-semibold text-lg">{mapel.kodeMapel}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Nama Mata Pelajaran
              </label>
              <p className="font-semibold text-lg">{mapel.namaMapel}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Sekolah
              </label>
              <p className="font-semibold">{mapel.sekolah.nama}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                NPSN
              </label>
              <p className="font-semibold">{mapel.sekolah.npsn}</p>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Deskripsi
              </label>
              <p className="text-base">{mapel.deskripsi || "-"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Jumlah Guru
              </label>
              <p className="font-semibold">
                {mapel.guru.length > 0
                  ? `${mapel.guru.length} Guru`
                  : "Belum ada guru"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Tanggal Dibuat
              </label>
              <p className="text-sm">
                {new Date(mapel.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {mapel.guru.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="font-semibold">Daftar Guru</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mapel.guru.map((guru: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <p className="font-semibold">{guru.nama || "N/A"}</p>
                    <p className="text-sm text-gray-500">{guru.email || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdaptiveCard>
    </Container>
  );
}
