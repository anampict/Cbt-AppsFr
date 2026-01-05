"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { useSiswaListStore } from "../_store/siswaListStore";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbPencil, TbEye, TbTrash } from "react-icons/tb";
import SiswaService from "@/service/SiswaService";
import SiswaEditDialog from "./SiswaEditDialog";
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from "@/components/shared/DataTable";
import type { Siswa } from "../types";

type SiswaListTableProps = {
  siswaListTotal: number;
  pageIndex?: number;
  pageSize?: number;
};

const AvatarColumn = ({ row }: { row: Siswa }) => {
  const displayName = row.nama || "N/A";
  const fotoSrc = row.fotoUrl
    ? row.fotoUrl.startsWith("http")
      ? row.fotoUrl
      : `http://localhost:3000${row.fotoUrl}`
    : "";

  return (
    <div className="flex items-center">
      {fotoSrc ? (
        <Avatar size={40} shape="circle" src={fotoSrc} alt={displayName} />
      ) : (
        <Avatar size={40} shape="circle" alt={displayName}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </div>
  );
};

const NameColumn = ({ row }: { row: Siswa }) => {
  const displayName = row.nama || "N/A";

  return (
    <Link
      className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100`}
      href={`/siswa/${row.id}`}
    >
      {displayName}
    </Link>
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

const SiswaListTable = ({
  siswaListTotal,
  pageIndex = 1,
  pageSize = 10,
}: SiswaListTableProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    siswaId: "",
    siswaName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    siswa: Siswa | null;
  }>({
    isOpen: false,
    siswa: null,
  });

  const siswaList = useSiswaListStore((state) => state.siswaList);
  const selectedSiswa = useSiswaListStore((state) => state.selectedSiswa);
  const isInitialLoading = useSiswaListStore((state) => state.initialLoading);
  const setSelectedSiswa = useSiswaListStore((state) => state.setSelectedSiswa);
  const setSelectAllSiswa = useSiswaListStore(
    (state) => state.setSelectAllSiswa
  );

  const { onAppendQueryParams } = useAppendQueryParams();

  const handleEdit = (siswa: Siswa) => {
    setEditDialog({
      isOpen: true,
      siswa: siswa,
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      isOpen: false,
      siswa: null,
    });
  };

  const handleViewDetails = (siswa: Siswa) => {
    router.push(`/siswa/${siswa.id}`);
  };

  const handleDeleteClick = (siswa: Siswa) => {
    setDeleteConfirm({
      isOpen: true,
      siswaId: siswa.id,
      siswaName: siswa.nama || "Siswa ini",
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await SiswaService.deleteSiswa(deleteConfirm.siswaId);
      toast.push(
        <Notification type="success">Siswa berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );
      setDeleteConfirm({ isOpen: false, siswaId: "", siswaName: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">Gagal menghapus siswa!</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Siswa>[] = useMemo(
    () => [
      {
        header: "Foto",
        accessorKey: "fotoUrl",
        cell: (props) => {
          const row = props.row.original;
          return <AvatarColumn row={row} />;
        },
      },
      {
        header: "Nama Siswa",
        accessorKey: "nama",
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
        },
      },
      {
        header: "NISN",
        accessorKey: "nisn",
      },
      {
        header: "NIS",
        accessorKey: "nis",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Jenis Kelamin",
        accessorKey: "jenisKelamin",
        cell: ({ row }) => {
          return (
            <span className="text-sm">
              {row.original.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
            </span>
          );
        },
      },
      {
        header: "Kelas",
        accessorKey: "kelas",
        cell: ({ row }) => {
          return (
            <span className="text-sm">
              {row.original.kelas?.namaKelas || "-"}
            </span>
          );
        },
      },
      {
        header: "Sekolah",
        accessorKey: "sekolah",
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.sekolah.nama}</span>;
        },
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

  const handleRowSelect = (checked: boolean, row: Siswa) => {
    setSelectedSiswa(checked, row);
  };

  const handleAllRowSelect = (checked: boolean, rows: Row<Siswa>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllSiswa(originalRows);
    } else {
      setSelectAllSiswa([]);
    }
  };

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={siswaList}
        noData={siswaList.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isInitialLoading}
        pagingData={{
          total: siswaListTotal,
          pageIndex,
          pageSize,
        }}
        checkboxChecked={(row) =>
          selectedSiswa.some((selected) => selected.id === row.id)
        }
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
      />

      {editDialog.siswa && (
        <SiswaEditDialog
          siswa={editDialog.siswa}
          isOpen={editDialog.isOpen}
          onClose={handleCloseEditDialog}
          onSuccess={() => router.refresh()}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Siswa"
        onClose={() =>
          setDeleteConfirm({ isOpen: false, siswaId: "", siswaName: "" })
        }
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, siswaId: "", siswaName: "" })
        }
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus{" "}
          <strong>{deleteConfirm.siswaName}</strong>?
        </p>
      </ConfirmDialog>
    </>
  );
};

export default SiswaListTable;
