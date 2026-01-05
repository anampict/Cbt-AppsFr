"use client";

import { use, useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import {
  TbArrowLeft,
  TbMail,
  TbPhone,
  TbMapPin,
  TbCalendar,
  TbSchool,
  TbUsers,
} from "react-icons/tb";
import Link from "next/link";
import SiswaService from "@/service/SiswaService";
import type { Siswa } from "../types";

const BACKEND_URL = "http://localhost:3000";

export default function SiswaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [siswa, setSiswa] = useState<Siswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        const response = await SiswaService.getSiswaById(id);
        setSiswa(response.data);
      } catch (err) {
        console.error("Error fetching siswa:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size={40} />
        </div>
      </Container>
    );
  }

  if (error || !siswa) {
    return (
      <Container>
        <AdaptiveCard>
          <div className="text-center py-8">
            <h4 className="mb-2">Data Siswa Tidak Ditemukan</h4>
            <p className="text-gray-500 mb-4">
              Siswa yang Anda cari tidak tersedia
            </p>
            <Link href="/siswa">
              <Button variant="solid" size="sm" icon={<TbArrowLeft />}>
                Kembali ke Daftar Siswa
              </Button>
            </Link>
          </div>
        </AdaptiveCard>
      </Container>
    );
  }

  const displayName = siswa.nama || "N/A";
  const fotoSrc = siswa.fotoUrl
    ? siswa.fotoUrl.startsWith("http")
      ? siswa.fotoUrl
      : `${BACKEND_URL}${siswa.fotoUrl}`
    : "";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <div className="mb-4">
        <Link href="/siswa">
          <Button variant="plain" size="sm" icon={<TbArrowLeft />}>
            Kembali ke Daftar Siswa
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <AdaptiveCard className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            {fotoSrc ? (
              <Avatar
                size={120}
                shape="circle"
                src={fotoSrc}
                alt={displayName}
              />
            ) : (
              <Avatar size={120} shape="circle" alt={displayName}>
                <span className="text-4xl">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </Avatar>
            )}
            <h4 className="mt-4 mb-1">{displayName}</h4>
            <p className="text-gray-500">
              {siswa.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
            </p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TbSchool className="text-lg text-gray-500" />
                <span>{siswa.kelas?.namaKelas || "-"}</span>
              </div>
            </div>
          </div>
        </AdaptiveCard>

        {/* Details Card */}
        <AdaptiveCard className="lg:col-span-2">
          <h5 className="mb-4">Informasi Siswa</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block">
                NISN
              </label>
              <p className="text-base">{siswa.nisn}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block">
                NIS
              </label>
              <p className="text-base">{siswa.nis}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbMail className="text-lg" />
                Email
              </label>
              <p className="text-base">{siswa.email}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbPhone className="text-lg" />
                Telepon
              </label>
              <p className="text-base">{siswa.telepon}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbCalendar className="text-lg" />
                Tanggal Lahir
              </label>
              <p className="text-base">{formatDate(siswa.tanggalLahir)}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbUsers className="text-lg" />
                Kelas
              </label>
              <p className="text-base">{siswa.kelas?.namaKelas || "-"}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbMapPin className="text-lg" />
                Alamat
              </label>
              <p className="text-base">{siswa.alamat}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500 mb-1 block flex items-center gap-2">
                <TbSchool className="text-lg" />
                Sekolah
              </label>
              <p className="text-base">{siswa.sekolah?.nama}</p>
              <p className="text-sm text-gray-500">
                NPSN: {siswa.sekolah?.npsn}
              </p>
            </div>
          </div>
        </AdaptiveCard>
      </div>
    </Container>
  );
}
