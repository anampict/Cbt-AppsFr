"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/shared/Container";
import PaketAddDialog from "./_components/PaketAddDialog";
import PaketTable from "./_components/PaketTable";
import PaketService from "@/service/PaketService";
import Spinner from "@/components/ui/Spinner";
import type { Paket } from "./types";

export default function Page() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paketList, setPaketList] = useState<Paket[]>([]);
  const [total, setTotal] = useState(0);

  const pageIndex = parseInt(searchParams.get("pageIndex") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const fetchPaket = async () => {
    setLoading(true);
    try {
      const response = await PaketService.getListPaket({
        page: pageIndex,
        limit: pageSize,
      });
      setPaketList(response.data || []);
      setTotal(response.data?.length || 0);
    } catch (error) {
      console.error("Error fetching paket:", error);
      setPaketList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  return (
    <Container>
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Daftar Paket</h3>
          <PaketAddDialog onSuccess={fetchPaket} />
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size={40} />
          </div>
        ) : (
          <PaketTable
            data={paketList}
            total={total}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onSuccess={fetchPaket}
          />
        )}
      </div>
    </Container>
  );
}
