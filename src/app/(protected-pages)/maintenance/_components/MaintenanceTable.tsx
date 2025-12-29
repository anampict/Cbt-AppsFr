"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import MaintenanceService from "@/service/MaintenanceService";
import { useRouter } from "next/navigation";
import { TbTrash, TbEye, TbCheck } from "react-icons/tb";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import MaintenanceUpdateDialog from "./MaintenanceUpdateDialog";
import type { ColumnDef } from "@/components/shared/DataTable";
import type { Maintenance } from "../types";

type MaintenanceTableProps = {
  maintenances: Maintenance[];
  onRefresh: () => void;
  pageIndex: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const ActionColumn = ({
  maintenance,
  onDelete,
  onUpdate,
}: {
  maintenance: Maintenance;
  onDelete: () => void;
  onUpdate: () => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      {maintenance.status === "PENDING" && (
        <MaintenanceUpdateDialog
          maintenance={maintenance}
          onSuccess={onUpdate}
          trigger={
            <Tooltip title="Selesaikan Maintenance">
              <div
                className="text-xl cursor-pointer select-none font-semibold text-emerald-600 hover:text-emerald-700"
                role="button"
              >
                <TbCheck />
              </div>
            </Tooltip>
          }
        />
      )}
      <Tooltip title="Hapus">
        <div
          className="text-xl cursor-pointer select-none font-semibold text-red-600 hover:text-red-700"
          role="button"
          onClick={onDelete}
        >
          <TbTrash />
        </div>
      </Tooltip>
    </div>
  );
};

const MaintenanceTable = ({
  maintenances,
  onRefresh,
  pageIndex,
  pageSize,
  total,
  onPaginationChange,
  onPageSizeChange,
}: MaintenanceTableProps) => {
  const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    maintenance: Maintenance | null;
  }>({ isOpen: false, maintenance: null });
  const [deleting, setDeleting] = useState(false);

  const handlePaginationChange = (page: number) => {
    onPaginationChange(page);
  };

  const handleSelectChange = (value: number) => {
    onPageSizeChange(value);
    onPaginationChange(1); // Reset to first page
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.maintenance) return;

    try {
      setDeleting(true);
      await MaintenanceService.deleteMaintenance(
        deleteConfirmation.maintenance.id
      );

      toast.push(
        <Notification type="success">
          Maintenance berhasil dihapus!
        </Notification>,
        {
          placement: "top-center",
        }
      );

      setDeleteConfirmation({ isOpen: false, maintenance: null });
      onRefresh();
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting maintenance:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Gagal menghapus maintenance!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<Maintenance>[] = useMemo(
    () => [
      {
        header: "Sekolah",
        accessorKey: "sekolah.nama",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.sekolah?.nama || "-"}
              </div>
              <div className="text-xs text-gray-500">
                NPSN: {row.sekolah?.npsn || "-"}
              </div>
            </div>
          );
        },
      },
      {
        header: "Tanggal Mulai",
        accessorKey: "tanggalMulai",
        cell: (props) => {
          const row = props.row.original;
          return <div className="text-sm">{formatDate(row.tanggalMulai)}</div>;
        },
      },
      {
        header: "Tanggal Selesai",
        accessorKey: "tanggalSelesai",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="text-sm">
              {row.tanggalSelesai ? formatDate(row.tanggalSelesai) : "-"}
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (props) => {
          const row = props.row.original;
          return (
            <Badge
              className={
                row.status === "DONE"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100"
              }
            >
              {row.status === "DONE" ? "Selesai" : "Pending"}
            </Badge>
          );
        },
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="text-sm max-w-xs truncate">{row.keterangan}</div>
          );
        },
      },
      {
        header: "Aksi",
        accessorKey: "action",
        cell: (props) => {
          const row = props.row.original;
          return (
            <ActionColumn
              maintenance={row}
              onDelete={() =>
                setDeleteConfirmation({ isOpen: true, maintenance: row })
              }
              onUpdate={onRefresh}
            />
          );
        },
      },
    ],
    [onRefresh]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={maintenances}
        pagingData={{
          total: total,
          pageIndex: pageIndex,
          pageSize: pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
      />

      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        type="danger"
        title="Hapus Maintenance"
        confirmText="Hapus"
        cancelText="Batal"
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, maintenance: null })
        }
        onRequestClose={() =>
          setDeleteConfirmation({ isOpen: false, maintenance: null })
        }
        onCancel={() =>
          setDeleteConfirmation({ isOpen: false, maintenance: null })
        }
        onConfirm={handleDelete}
        loading={deleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus maintenance untuk sekolah{" "}
          <span className="font-semibold">
            {deleteConfirmation.maintenance?.sekolah?.nama}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default MaintenanceTable;
