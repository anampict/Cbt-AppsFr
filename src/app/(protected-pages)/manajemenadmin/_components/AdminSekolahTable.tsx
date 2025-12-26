"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/shared/DataTable";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import DebouceInput from "@/components/shared/DebouceInput";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import AdminSekolahService, {
  type AdminSekolahResponse,
} from "@/service/AdminSekolahService";
import AdminSekolahAddDialog from "./AdminSekolahAddDialog";
import AdminSekolahEditDialog from "./AdminSekolahEditDialog";
import { TbSearch, TbPencil, TbTrash, TbEye } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import type { ColumnDef, OnSortParam } from "@/components/shared/DataTable";

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

const AdminSekolahTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminSekolahResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] =
    useState<AdminSekolahResponse | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    adminId: "",
    adminName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AdminSekolahService.getListAdminSekolah({
        page: pageIndex,
        limit: pageSize,
        search,
      });
      setData(response.data);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error("Error fetching admin sekolah:", error);
      toast.push(
        <Notification type="danger" title="Error">
          Gagal memuat data: {error.response?.data?.message || error.message}
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, search]);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      adminId: id,
      adminName: name,
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await AdminSekolahService.deleteAdminSekolah(deleteConfirm.adminId);
      toast.push(
        <Notification type="success">
          Admin sekolah berhasil dihapus!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      setDeleteConfirm({ isOpen: false, adminId: "", adminName: "" });
      fetchData();
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting admin sekolah:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus admin sekolah!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (admin: AdminSekolahResponse) => {
    setSelectedAdmin(admin);
    setEditDialogOpen(true);
  };

  const handleViewDetail = (admin: AdminSekolahResponse) => {
    router.push(`/manajemenadmin/detailadmin/${admin.id}`);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedAdmin(null);
    fetchData();
  };

  const handlePaginationChange = (page: number) => {
    setPageIndex(page);
  };

  const handleSelectChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPageIndex(1);
  };

  const handleSort = (sort: OnSortParam) => {
    console.log("Sort:", sort);
    // Implement sorting if backend supports it
  };

  const columns: ColumnDef<AdminSekolahResponse>[] = [
    {
      header: "Nama",
      accessorKey: "name",
      cell: (props) => {
        const row = props.row.original;
        return (
          <div>
            <div className="font-semibold">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        );
      },
    },
    {
      header: "Sekolah",
      accessorKey: "sekolah",
      cell: (props) => {
        const row = props.row.original;
        return (
          <div>
            <div className="font-medium">{row.sekolah?.nama || "-"}</div>
            <div className="text-xs text-gray-500">
              NPSN: {row.sekolah?.npsn || "-"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (props) => {
        const row = props.row.original;
        return (
          <Tag className="bg-blue-100 text-blue-800 border-0">{row.role}</Tag>
        );
      },
    },
    {
      header: "Tanggal Dibuat",
      accessorKey: "createdAt",
      cell: (props) => {
        const row = props.row.original;
        return new Date(row.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      header: "",
      id: "action",
      cell: (props) => (
        <ActionColumn
          onEdit={() => handleEdit(props.row.original)}
          onViewDetail={() => handleViewDetail(props.row.original)}
          onDelete={() =>
            handleDeleteClick(props.row.original.id, props.row.original.name)
          }
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <DebouceInput
            placeholder="Cari nama atau email..."
            prefix={<TbSearch />}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(1);
            }}
          />
        </div>
        <AdminSekolahAddDialog onSuccess={fetchData} />
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagingData={{
          total,
          pageIndex,
          pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
      />

      {selectedAdmin && (
        <AdminSekolahEditDialog
          admin={selectedAdmin}
          isOpen={editDialogOpen}
          onClose={handleCloseEdit}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Admin Sekolah"
        onClose={() =>
          setDeleteConfirm({ isOpen: false, adminId: "", adminName: "" })
        }
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, adminId: "", adminName: "" })
        }
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus admin{" "}
          <strong>{deleteConfirm.adminName}</strong>?
        </p>
      </ConfirmDialog>
    </>
  );
};

export default AdminSekolahTable;
