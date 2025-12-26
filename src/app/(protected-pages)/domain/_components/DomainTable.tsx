"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import DomainService from "@/service/DomainService";
import { useRouter } from "next/navigation";
import {
  TbPencil,
  TbTrash,
  TbEye,
  TbCheck,
  TbX,
  TbShieldCheck,
} from "react-icons/tb";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DomainEditDialog from "./DomainEditDialog";
import type { ColumnDef } from "@/components/shared/DataTable";
import type { Domain } from "../types";

type DomainTableProps = {
  domains: Domain[];
  onRefresh: () => void;
  pageIndex: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const ActionColumn = ({
  domain,
  onDelete,
  onEdit,
  onViewDetail,
}: {
  domain: Domain;
  onDelete: () => void;
  onEdit: () => void;
  onViewDetail: () => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <DomainEditDialog
        domain={domain}
        onSuccess={onEdit}
        trigger={
          <Tooltip title="Edit">
            <div
              className="text-xl cursor-pointer select-none font-semibold"
              role="button"
            >
              <TbPencil />
            </div>
          </Tooltip>
        }
      />
      <Tooltip title="View">
        <div
          className="text-xl cursor-pointer select-none font-semibold"
          role="button"
          onClick={onViewDetail}
        >
          <TbEye />
        </div>
      </Tooltip>
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

const DomainTable = ({
  domains,
  onRefresh,
  pageIndex,
  pageSize,
  total,
  onPaginationChange,
  onPageSizeChange,
}: DomainTableProps) => {
  const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    domain: Domain | null;
  }>({ isOpen: false, domain: null });
  const [deleting, setDeleting] = useState(false);

  const handlePaginationChange = (page: number) => {
    onPaginationChange(page);
  };

  const handleSelectChange = (value: number) => {
    onPageSizeChange(value);
    onPaginationChange(1); // Reset to first page
  };

  const handleViewDetails = (domain: Domain) => {
    router.push(`/domain/detaildomain/${domain.id}`);
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.domain) return;

    try {
      setDeleting(true);
      await DomainService.deleteDomain(deleteConfirmation.domain.id);

      toast.push(
        <Notification type="success">Domain berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );

      setDeleteConfirmation({ isOpen: false, domain: null });
      onRefresh();
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting domain:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Gagal menghapus domain!";

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

  const columns: ColumnDef<Domain>[] = useMemo(
    () => [
      {
        header: "Domain",
        accessorKey: "domain",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {row.domain}
              </div>
              <div className="text-xs text-gray-500">{row.customDomain}</div>
            </div>
          );
        },
      },
      {
        header: "Sekolah",
        accessorKey: "sekolah.nama",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.sekolah.nama}
              </div>
              <div className="text-xs text-gray-500">
                NPSN: {row.sekolah.npsn}
              </div>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-1.5 ${
                  row.isActive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {row.isActive ? (
                  <>
                    <TbCheck className="text-base" />
                    <span className="text-sm font-medium">Aktif</span>
                  </>
                ) : (
                  <>
                    <TbX className="text-base" />
                    <span className="text-sm font-medium">Nonaktif</span>
                  </>
                )}
              </div>
              {row.sslEnabled && (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <TbShieldCheck className="text-base" />
                  <span className="text-xs">SSL Enabled</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Expired At",
        accessorKey: "expiredAt",
        cell: (props) => {
          const row = props.row.original;
          const expiredDate = new Date(row.expiredAt);
          const now = new Date();
          const isExpired = expiredDate < now;

          return (
            <div>
              <div
                className={`font-medium ${
                  isExpired
                    ? "text-red-600"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {expiredDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="text-xs text-gray-500">
                {expiredDate.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
      },
      {
        header: "Aksi",
        id: "action",
        cell: (props) => {
          const row = props.row.original;
          return (
            <ActionColumn
              domain={row}
              onDelete={() =>
                setDeleteConfirmation({ isOpen: true, domain: row })
              }
              onEdit={onRefresh}
              onViewDetail={() => handleViewDetails(row)}
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
        data={domains}
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
        title="Hapus Domain"
        confirmText="Hapus"
        cancelText="Batal"
        onClose={() => setDeleteConfirmation({ isOpen: false, domain: null })}
        onRequestClose={() =>
          setDeleteConfirmation({ isOpen: false, domain: null })
        }
        onCancel={() => setDeleteConfirmation({ isOpen: false, domain: null })}
        onConfirm={handleDelete}
        confirmButtonColor="red-600"
        loading={deleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus domain{" "}
          <strong>{deleteConfirmation.domain?.domain}</strong>? Tindakan ini
          tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default DomainTable;
