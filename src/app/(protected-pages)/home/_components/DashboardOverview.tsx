"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Loading from "@/components/shared/Loading";
import { NumericFormat } from "react-number-format";
import { TbSchool, TbUser, TbWorld } from "react-icons/tb";
import DashboardService from "@/service/DashboardService";
import type { DashboardStats } from "@/service/DashboardService";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
};

const StatCard = ({ title, value, icon, iconClass }: StatCardProps) => {
  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {title}
          </div>
          <h3 className="font-bold text-3xl">
            <NumericFormat displayType="text" value={value} thousandSeparator />
          </h3>
        </div>
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-xl ${iconClass}`}
        >
          <div className="text-2xl text-white">{icon}</div>
        </div>
      </div>
    </Card>
  );
};

const DashboardOverview = () => {
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
      <div className="flex items-center justify-center py-20">
        <Loading loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Sekolah"
        value={stats.totalSekolah}
        icon={<TbSchool />}
        iconClass="bg-blue-500"
      />
      <StatCard
        title="Total Admin"
        value={stats.totalAdmin}
        icon={<TbUser />}
        iconClass="bg-green-500"
      />
      <StatCard
        title="Total Domain"
        value={stats.totalDomain}
        icon={<TbWorld />}
        iconClass="bg-purple-500"
      />
    </div>
  );
};

export default DashboardOverview;
