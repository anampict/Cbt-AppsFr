"use client";

import { useMemo, useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { useKelasListStore } from "./KelasListProvider";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { useRouter } from "next/navigation";
import { TbPencil, TbTrash } from "react-icons/tb";
import KelasService from "@/service/KelasService";
import KelasEditDialog from "./KelasEditDialog";
import KelasSiswaDialog from "./KelasSiswaDialog";
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from "@/components/shared/DataTable";
import type { Kelas } from "../types";

type KelasListTableProps = {
  kelasListTotal: number;
  pageIndex?: number;
  pageSize?: number;
};

const ActionColumn = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
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

const KelasListTable = ({
  kelasListTotal,
  pageIndex = 1,
  pageSize = 10,
}: KelasListTableProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    kelasId: "",
    kelasName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    kelas: Kelas | null;
  }>({
    isOpen: false,
    kelas: null,
  });

  const [siswaDialog, setSiswaDialog] = useState<{
    isOpen: boolean;
    kelasId: string;
    kelasName: string;
  }>({
    isOpen: false,
    kelasId: "",
    kelasName: "",
  });

  const kelasList = useKelasListStore((state) => state.kelasList);
  const selectedKelas = useKelasListStore((state) => state.selectedKelas);
  const isInitialLoading = useKelasListStore((state) => state.initialLoading);
  const setSelectedKelas = useKelasListStore((state) => state.setSelectedKelas);
  const setSelectAllKelas = useKelasListStore(
    (state) => state.setSelectAllKelas
  );

  const { onAppendQueryParams } = useAppendQueryParams();

  const handleEdit = (kelas: Kelas) => {
    setEditDialog({
      isOpen: true,
      kelas: kelas,
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      isOpen: false,
      kelas: null,
    });
  };

  const handleShowSiswa = (kelas: Kelas) => {
    setSiswaDialog({
      isOpen: true,
      kelasId: kelas.id,
      kelasName: kelas.namaKelas,
    });
  };

  const handleCloseSiswaDialog = () => {
    setSiswaDialog({
      isOpen: false,
      kelasId: "",
      kelasName: "",
    });
  };

  const handleDeleteClick = (kelas: Kelas) => {
    setDeleteConfirm({
      isOpen: true,
      kelasId: kelas.id,
      kelasName: kelas.namaKelas,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await KelasService.deleteKelas(deleteConfirm.kelasId);

      toast.push(
        <Notification type="success">Kelas berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );

      setDeleteConfirm({
        isOpen: false,
        kelasId: "",
        kelasName: "",
      });

      router.refresh();
    } catch (error: any) {
      console.error("Error deleting kelas:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus kelas!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      kelasId: "",
      kelasName: "",
    });
  };

  const handlePaginationChange = (page: number) => {
    onAppendQueryParams({
      pageIndex: page.toString(),
    });
  };

  const handleSelectChange = (checked: boolean, row: Row<Kelas>) => {
    const id = row.id;
    if (checked) {
      setSelectedKelas([...selectedKelas, id]);
    } else {
      setSelectedKelas(selectedKelas.filter((selectedId) => selectedId !== id));
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAllKelas(checked);
  };

  const handleSort = (sort: OnSortParam) => {
    const { order, key } = sort;

    onAppendQueryParams({
      sort: { order, key },
    });
  };

  const columns: ColumnDef<Kelas>[] = useMemo(
    () => [
      {
        header: "Nama Kelas",
        accessorKey: "namaKelas",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {row.namaKelas}
            </div>
          );
        },
      },
      {
        header: "Tingkat",
        accessorKey: "tingkat",
        cell: (props) => {
          const row = props.row.original;
          const tingkatLabel =
            row.tingkat === 10
              ? "X"
              : row.tingkat === 11
              ? "XI"
              : row.tingkat === 12
              ? "XII"
              : row.tingkat.toString();
          return <div>{tingkatLabel}</div>;
        },
      },
      {
        header: "Jurusan",
        accessorKey: "jurusan",
        cell: (props) => {
          const row = props.row.original;
          return <div>{row.jurusan}</div>;
        },
      },
      {
        header: "Jumlah Siswa",
        accessorKey: "_count.siswa",
        cell: (props) => {
          const row = props.row.original;
          const siswaCount = row._count?.siswa || 0;
          return (
            <div
              className={
                siswaCount > 0
                  ? "text-center cursor-pointer hover:text-primary font-medium transition-colors"
                  : "text-center text-gray-500"
              }
              onClick={() => siswaCount > 0 && handleShowSiswa(row)}
              role={siswaCount > 0 ? "button" : undefined}
              title={
                siswaCount > 0 ? "Klik untuk melihat daftar siswa" : undefined
              }
            >
              {siswaCount} siswa
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
              <div className="font-medium">{row.sekolah.nama}</div>
              <div className="text-xs text-gray-500">
                NPSN: {row.sekolah.npsn}
              </div>
            </div>
          );
        },
      },
      {
        header: "",
        id: "action",
        cell: (props) => {
          const row = props.row.original;
          return (
            <ActionColumn
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDeleteClick(row)}
            />
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={kelasList}
        loading={isInitialLoading}
        pagingData={{
          total: kelasListTotal,
          pageIndex: pageIndex,
          pageSize: pageSize,
        }}
        checkboxChecked={(row) => selectedKelas.includes(row.id)}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onIndeterminateCheckBoxChange={handleSelectAllChange}
        onSort={handleSort}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Kelas"
        confirmButtonColor="red-600"
        onClose={handleCancelDelete}
        onRequestClose={handleCancelDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        loading={isDeleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus kelas{" "}
          <strong>{deleteConfirm.kelasName}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </ConfirmDialog>

      <KelasEditDialog
        isOpen={editDialog.isOpen}
        onClose={handleCloseEditDialog}
        kelas={editDialog.kelas}
        onSuccess={() => {
          handleCloseEditDialog();
          router.refresh();
        }}
      />

      <KelasSiswaDialog
        isOpen={siswaDialog.isOpen}
        onClose={handleCloseSiswaDialog}
        kelasId={siswaDialog.kelasId}
        kelasName={siswaDialog.kelasName}
        onSuccess={() => router.refresh()}
      />
    </>
  );
};

export default KelasListTable;
