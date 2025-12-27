"use client";

import { useMemo, useState } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import { TbPencil, TbTrash, TbCheck, TbX, TbEye } from "react-icons/tb";
import { useRouter, useSearchParams } from "next/navigation";
import type { Paket } from "../types";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import PaketService from "@/service/PaketService";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PaketEditDialog from "./PaketEditDialog";

const { Tr, Th, Td, THead, TBody } = Table;

type PaketTableProps = {
  data: Paket[];
  total: number;
  pageIndex: number;
  pageSize: number;
  onSuccess?: () => void;
};

const PaketTable = ({
  data,
  total,
  pageIndex,
  pageSize,
  onSuccess,
}: PaketTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handlePaginationChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageIndex", page.toString());
    router.push(`/paket-limit?${params.toString()}`);
  };

  const handleEdit = (paket: Paket) => {
    setSelectedPaket(paket);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedPaket(null);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleViewDetail = (paket: Paket) => {
    router.push(`/paket-limit/detailpaket/${paket.id}`);
  };

  const handleDeleteClick = (paket: Paket) => {
    setSelectedPaket(paket);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPaket) return;

    try {
      setDeleting(true);
      await PaketService.deletePaket(selectedPaket.id);

      toast.push(
        <Notification type="success">Paket berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );

      setDeleteDialogOpen(false);
      setSelectedPaket(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting paket:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus paket!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <Tr>
              <Th>Nama Paket</Th>
              <Th>Harga</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </THead>
          <TBody>
            {data.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="text-center">
                  Tidak ada data paket
                </Td>
              </Tr>
            ) : (
              data.map((paket) => (
                <Tr key={paket.id}>
                  <Td>
                    <div>
                      <div className="font-semibold">{paket.namaPaket}</div>
                      {paket.deskripsi && (
                        <div className="text-xs text-gray-500">
                          {paket.deskripsi}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <span className="font-medium">
                      {formatCurrency(paket.harga)}
                    </span>
                  </Td>
                  <Td>
                    {paket.isActive ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <TbCheck className="text-lg" />
                        <span className="font-medium">Aktif</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <TbX className="text-lg" />
                        <span className="font-medium">Nonaktif</span>
                      </div>
                    )}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Tooltip title="Edit">
                        <div
                          className="text-xl cursor-pointer select-none font-semibold"
                          role="button"
                          onClick={() => handleEdit(paket)}
                        >
                          <TbPencil />
                        </div>
                      </Tooltip>
                      <Tooltip title="View">
                        <div
                          className="text-xl cursor-pointer select-none font-semibold"
                          role="button"
                          onClick={() => handleViewDetail(paket)}
                        >
                          <TbEye />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <div
                          className="text-xl cursor-pointer select-none font-semibold text-error"
                          role="button"
                          onClick={() => handleDeleteClick(paket)}
                        >
                          <TbTrash />
                        </div>
                      </Tooltip>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={pageIndex}
            total={total}
            pageSize={pageSize}
            onChange={handlePaginationChange}
          />
        </div>
      )}

      {selectedPaket && (
        <PaketEditDialog
          paket={selectedPaket}
          isOpen={editDialogOpen}
          onClose={handleCloseEdit}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        type="danger"
        title="Hapus Paket"
        onClose={() => setDeleteDialogOpen(false)}
        onRequestClose={() => setDeleteDialogOpen(false)}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      >
        <p>
          Apakah Anda yakin ingin menghapus paket{" "}
          <strong>{selectedPaket?.namaPaket}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default PaketTable;
