"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { useCustomerListStore } from "../_store/customerListStore";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbPencil, TbEye, TbTrash } from "react-icons/tb";
import SekolahService from "@/service/SekolahService";
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from "@/components/shared/DataTable";
import type { Customer } from "../types";

type CustomerListTableProps = {
  customerListTotal: number;
  pageIndex?: number;
  pageSize?: number;
};

const statusColor: Record<string, string> = {
  active: "bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900",
  blocked: "bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900",
};

const NameColumn = ({ row }: { row: Customer }) => {
  const displayName = row.nama || row.name || "N/A";
  const logoSrc = row.logoUrl || row.img || "";

  return (
    <div className="flex items-center">
      {logoSrc ? (
        <Avatar size={40} shape="circle" src={logoSrc} alt={displayName} />
      ) : (
        <Avatar size={40} shape="circle" alt={displayName}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <Link
        className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
        href={`/sekolah/detailsekolah/${row.id}`}
      >
        {displayName}
      </Link>
    </div>
  );
};

const ActionColumn = ({
  onEdit,
  onViewDetail,
  onDelete,
}: {
  onEdit: () => void;
  onViewDetail: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Edit">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onEdit}
        >
          <TbPencil />
        </div>
      </Tooltip>
      <Tooltip title="View">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onViewDetail}
        >
          <TbEye />
        </div>
      </Tooltip>
      <Tooltip title="Delete">
        <div
          className={`text-xl cursor-pointer select-none font-semibold text-error`}
          role="button"
          onClick={onDelete}
        >
          <TbTrash />
        </div>
      </Tooltip>
    </div>
  );
};

const CustomerListTable = ({
  customerListTotal,
  pageIndex = 1,
  pageSize = 10,
}: CustomerListTableProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    customerId: "",
    customerName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const customerList = useCustomerListStore((state) => state.customerList);
  const selectedCustomer = useCustomerListStore(
    (state) => state.selectedCustomer
  );
  const isInitialLoading = useCustomerListStore(
    (state) => state.initialLoading
  );
  const setSelectedCustomer = useCustomerListStore(
    (state) => state.setSelectedCustomer
  );
  const setSelectAllCustomer = useCustomerListStore(
    (state) => state.setSelectAllCustomer
  );

  const { onAppendQueryParams } = useAppendQueryParams();

  const handleEdit = (customer: Customer) => {
    router.push(`/sekolah/editsekolah/${customer.id}`);
  };

  const handleViewDetails = (customer: Customer) => {
    router.push(`/sekolah/detailsekolah/${customer.id}`);
  };

  const handleDeleteClick = (customer: Customer) => {
    setDeleteConfirm({
      isOpen: true,
      customerId: customer.id,
      customerName: customer.nama || customer.name || "Sekolah ini",
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await SekolahService.deleteSekolah(deleteConfirm.customerId);
      toast.push(
        <Notification type="success">Sekolah berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );
      setDeleteConfirm({ isOpen: false, customerId: "", customerName: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">Gagal menghapus sekolah!</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      {
        header: "Nama Sekolah",
        accessorKey: "nama",
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
        },
      },
      {
        header: "NPSN",
        accessorKey: "npsn",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Kota",
        accessorKey: "kota",
      },
      {
        header: "Provinsi",
        accessorKey: "provinsi",
      },
      {
        header: "Telepon",
        accessorKey: "telepon",
      },
      {
        header: "",
        id: "action",
        cell: (props) => (
          <ActionColumn
            onEdit={() => handleEdit(props.row.original)}
            onViewDetail={() => handleViewDetails(props.row.original)}
            onDelete={() => handleDeleteClick(props.row.original)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePaginationChange = (page: number) => {
    onAppendQueryParams({
      pageIndex: String(page),
    });
  };

  const handleSelectChange = (value: number) => {
    onAppendQueryParams({
      pageSize: String(value),
      pageIndex: "1",
    });
  };

  const handleSort = (sort: OnSortParam) => {
    onAppendQueryParams({
      order: sort.order,
      sortKey: sort.key,
    });
  };

  const handleRowSelect = (checked: boolean, row: Customer) => {
    setSelectedCustomer(checked, row);
  };

  const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllCustomer(originalRows);
    } else {
      setSelectAllCustomer([]);
    }
  };

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={customerList}
        noData={customerList.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isInitialLoading}
        pagingData={{
          total: customerListTotal,
          pageIndex,
          pageSize,
        }}
        checkboxChecked={(row) =>
          selectedCustomer.some((selected) => selected.id === row.id)
        }
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
      />
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Sekolah"
        onClose={() =>
          setDeleteConfirm({ isOpen: false, customerId: "", customerName: "" })
        }
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, customerId: "", customerName: "" })
        }
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus{" "}
          <strong>{deleteConfirm.customerName}</strong>?
        </p>
      </ConfirmDialog>
    </>
  );
};

export default CustomerListTable;
