"use client";

import { useState, useEffect } from "react";
import DomainTable from "./DomainTable";
import DomainAddDialog from "./DomainAddDialog";
import DomainService from "@/service/DomainService";
import Spinner from "@/components/ui/Spinner";
import type { Domain } from "../types";

const DomainListContent = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await DomainService.getListDomain();
      const allDomains = response.data || [];
      setTotal(allDomains.length);

      // Client-side pagination
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setDomains(allDomains.slice(startIndex, endIndex));
    } catch (error) {
      console.error("Error fetching domains:", error);
      setDomains([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [pageIndex, pageSize]);

  const handleRefresh = () => {
    fetchDomains();
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
        <DomainAddDialog onSuccess={handleRefresh} />
      </div>
      <DomainTable
        domains={domains}
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

export default DomainListContent;
