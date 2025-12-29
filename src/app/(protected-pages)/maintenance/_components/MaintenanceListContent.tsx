"use client";

import { useState, useEffect } from "react";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceAddDialog from "./MaintenanceAddDialog";
import MaintenanceService from "@/service/MaintenanceService";
import Spinner from "@/components/ui/Spinner";
import type { Maintenance } from "../types";

const MaintenanceListContent = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const response = await MaintenanceService.getListMaintenance();
      const allMaintenances = response.data || [];
      setTotal(allMaintenances.length);

      // Client-side pagination
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setMaintenances(allMaintenances.slice(startIndex, endIndex));
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      setMaintenances([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, [pageIndex, pageSize]);

  const handleRefresh = () => {
    fetchMaintenances();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <MaintenanceAddDialog onSuccess={handleRefresh} />
      </div>
      <MaintenanceTable
        maintenances={maintenances}
        onRefresh={handleRefresh}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={total}
        onPaginationChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </>
  );
};

export default MaintenanceListContent;
