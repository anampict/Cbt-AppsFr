"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Loading from "@/components/shared/Loading";
import classNames from "@/utils/classNames";
import { NumericFormat } from "react-number-format";
import {
  TbSchool,
  TbUser,
  TbWorld,
  TbClock,
  TbCalendar,
  TbCalendarStats,
  TbShield,
  TbUserCircle,
  TbPackage,
  TbMapPin,
} from "react-icons/tb";
import DashboardService from "@/service/DashboardService";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { DashboardStats } from "@/service/DashboardService";

const Chart = dynamic(() => import("@/components/shared/Chart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <Loading loading />
    </div>
  ),
});

type StatCardProps = {
  title: string;
  value: number | ReactNode;
  icon: ReactNode;
  iconClass: string;
  subtitle?: string;
};

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  subtitle,
}: StatCardProps) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {title}
          </div>
          <h3 className="font-bold text-2xl mb-1">{value}</h3>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
        <div
          className={classNames(
            "flex items-center justify-center w-12 h-12 rounded-xl text-white text-2xl",
            iconClass
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.getStats();
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.response?.data?.message || "Gagal memuat data statistik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-20">
          <Loading loading />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80"
          >
            Coba Lagi
          </button>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  // Prepare chart data for distribusi paket
  const paketChartData = {
    series: stats.distribusiPaket.map((p) => p.jumlah),
    labels: stats.distribusiPaket.map((p) => p.paketNama),
  };

  // Prepare chart data for top provinsi
  const provinsiChartData = {
    series: [
      {
        name: "Jumlah Sekolah",
        data: stats.top5Provinsi.map((p) => p.jumlah),
      },
    ],
    categories: stats.top5Provinsi.map((p) => p.provinsi),
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Stats */}
      <Card>
        <h4 className="mb-4">Statistik Utama</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Sekolah"
            value={
              <NumericFormat
                displayType="text"
                value={stats.overview.totalSekolah}
                thousandSeparator={true}
              />
            }
            iconClass="bg-blue-500"
            icon={<TbSchool />}
          />
          <StatCard
            title="Total Pengguna"
            value={
              <NumericFormat
                displayType="text"
                value={stats.overview.totalAdmin}
                thousandSeparator={true}
              />
            }
            iconClass="bg-green-500"
            icon={<TbUser />}
            subtitle={`${stats.adminBreakdown.totalSuperadmin} Superadmin, ${stats.adminBreakdown.totalAdminSekolah} Admin Sekolah`}
          />
          <StatCard
            title="Total Domain"
            value={
              <NumericFormat
                displayType="text"
                value={stats.overview.totalDomain}
                thousandSeparator={true}
              />
            }
            iconClass="bg-purple-500"
            icon={<TbWorld />}
          />
        </div>
      </Card>

      {/* Sekolah Baru */}
      <Card>
        <h4 className="mb-4">Sekolah Terbaru</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Hari Ini"
            value={
              <NumericFormat
                displayType="text"
                value={stats.sekolahBaru.hariIni}
                thousandSeparator={true}
              />
            }
            iconClass="bg-cyan-500"
            icon={<TbClock />}
          />
          <StatCard
            title="Minggu Ini"
            value={
              <NumericFormat
                displayType="text"
                value={stats.sekolahBaru.mingguIni}
                thousandSeparator={true}
              />
            }
            iconClass="bg-indigo-500"
            icon={<TbCalendar />}
          />
          <StatCard
            title="Bulan Ini"
            value={
              <NumericFormat
                displayType="text"
                value={stats.sekolahBaru.bulanIni}
                thousandSeparator={true}
              />
            }
            iconClass="bg-pink-500"
            icon={<TbCalendarStats />}
          />
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribusi Paket */}
        <Card>
          <h4 className="mb-4 flex items-center gap-2">
            <TbPackage className="text-xl" />
            Distribusi Paket
          </h4>
          <Chart
            type="donut"
            series={paketChartData.series}
            height="300px"
            customOptions={{
              labels: paketChartData.labels,
              legend: {
                position: "bottom",
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        label: "Total",
                      },
                    },
                  },
                },
              },
            }}
          />
        </Card>

        {/* Top 5 Provinsi */}
        <Card>
          <h4 className="mb-4 flex items-center gap-2">
            <TbMapPin className="text-xl" />
            Top 5 Provinsi
          </h4>
          <Chart
            type="bar"
            series={provinsiChartData.series}
            xAxis={provinsiChartData.categories}
            height="300px"
            customOptions={{
              plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 4,
                },
              },
              dataLabels: {
                enabled: true,
              },
            }}
          />
        </Card>
      </div>

      {/* Admin Breakdown */}
      <Card>
        <h4 className="mb-4">Breakdown Admin</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Superadmin"
            value={
              <NumericFormat
                displayType="text"
                value={stats.adminBreakdown.totalSuperadmin}
                thousandSeparator={true}
              />
            }
            iconClass="bg-red-500"
            icon={<TbShield />}
          />
          <StatCard
            title="Admin Sekolah"
            value={
              <NumericFormat
                displayType="text"
                value={stats.adminBreakdown.totalAdminSekolah}
                thousandSeparator={true}
              />
            }
            iconClass="bg-orange-500"
            icon={<TbUserCircle />}
          />
        </div>
      </Card>
    </div>
  );
};

export default Overview;
