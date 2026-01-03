"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { useGuruListStore } from "../_store/guruListStore";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbPencil, TbEye, TbTrash } from "react-icons/tb";
import GuruService from "@/service/GuruService";
import GuruEditDialog from "./GuruEditDialog";
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from "@/components/shared/DataTable";
import type { Guru } from "../types";

type GuruListTableProps = {
  guruListTotal: number;
  pageIndex?: number;
  pageSize?: number;
};

const AvatarColumn = ({ row }: { row: Guru }) => {
  const displayName = row.nama || "N/A";
  const fotoSrc = row.fotoUrl || "";

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

const NameColumn = ({ row }: { row: Guru }) => {
  const displayName = row.nama || "N/A";

  return (
    <Link
      className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100`}
      href={`/guru/${row.id}`}
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

const GuruListTable = ({
  guruListTotal,
  pageIndex = 1,
  pageSize = 10,
}: GuruListTableProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    guruId: "",
    guruName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    guru: Guru | null;
  }>({
    isOpen: false,
    guru: null,
  });

  const guruList = useGuruListStore((state) => state.guruList);
  const selectedGuru = useGuruListStore((state) => state.selectedGuru);
  const isInitialLoading = useGuruListStore((state) => state.initialLoading);
  const setSelectedGuru = useGuruListStore((state) => state.setSelectedGuru);
  const setSelectAllGuru = useGuruListStore((state) => state.setSelectAllGuru);

  const { onAppendQueryParams } = useAppendQueryParams();

  const handleEdit = (guru: Guru) => {
    setEditDialog({
      isOpen: true,
      guru: guru,
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      isOpen: false,
      guru: null,
    });
  };

  const handleViewDetails = (guru: Guru) => {
    router.push(`/guru/${guru.id}`);
  };

  const handleDeleteClick = (guru: Guru) => {
    setDeleteConfirm({
      isOpen: true,
      guruId: guru.id,
      guruName: guru.nama || "Guru ini",
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await GuruService.deleteGuru(deleteConfirm.guruId);
      toast.push(
        <Notification type="success">Guru berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );
      setDeleteConfirm({ isOpen: false, guruId: "", guruName: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">Gagal menghapus guru!</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Guru>[] = useMemo(
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
        header: "Nama Guru",
        accessorKey: "nama",
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
        },
      },
      {
        header: "NIP",
        accessorKey: "nip",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Telepon",
        accessorKey: "telepon",
      },
      {
        header: "Sekolah",
        accessorKey: "sekolah",
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.sekolah.nama}</span>;
        },
      },
      {
        header: "Mata Pelajaran",
        accessorKey: "mapel",
        cell: ({ row }) => {
          const mapelList = row.original.mapel;
          if (mapelList.length === 0) {
            return <span className="text-sm text-gray-400">-</span>;
          }
          const mapelNames = mapelList
            .map((m: any) => m.mapel?.namaMapel || m.namaMapel)
            .filter(Boolean)
            .join(", ");
          return (
            <span className="text-sm" title={mapelNames}>
              {mapelNames.length > 40
                ? `${mapelNames.substring(0, 40)}...`
                : mapelNames}
            </span>
          );
        },
      },
      {
        header: "Kelas",
        accessorKey: "kelas",
        cell: ({ row }) => {
          const kelasList = row.original.kelas;

          if (!kelasList || kelasList.length === 0) {
            return <span className="text-sm text-gray-400">-</span>;
          }
          const kelasNames = kelasList
            .map((k: any) => {
              // Handle nested structure: k.kelas.namaKelas
              if (k.kelas && k.kelas.namaKelas) {
                return k.kelas.namaKelas;
              }
              // Fallback for direct structure
              if (k.namaKelas) {
                return k.namaKelas;
              }
              return null;
            })
            .filter(Boolean)
            .join(", ");

          if (!kelasNames) {
            return <span className="text-sm text-gray-400">-</span>;
          }

          return (
            <span className="text-sm" title={kelasNames}>
              {kelasNames.length > 40
                ? `${kelasNames.substring(0, 40)}...`
                : kelasNames}
            </span>
          );
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

  const handleRowSelect = (checked: boolean, row: Guru) => {
    setSelectedGuru(checked, row);
  };

  const handleAllRowSelect = (checked: boolean, rows: Row<Guru>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllGuru(originalRows);
    } else {
      setSelectAllGuru([]);
    }
  };

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={guruList}
        noData={guruList.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isInitialLoading}
        pagingData={{
          total: guruListTotal,
          pageIndex,
          pageSize,
        }}
        checkboxChecked={(row) =>
          selectedGuru.some((selected) => selected.id === row.id)
        }
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
      />

      {editDialog.guru && (
        <GuruEditDialog
          guru={editDialog.guru}
          isOpen={editDialog.isOpen}
          onClose={handleCloseEditDialog}
          onSuccess={() => router.refresh()}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Guru"
        onClose={() =>
          setDeleteConfirm({ isOpen: false, guruId: "", guruName: "" })
        }
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, guruId: "", guruName: "" })
        }
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus{" "}
          <strong>{deleteConfirm.guruName}</strong>?
        </p>
      </ConfirmDialog>
    </>
  );
};

export default GuruListTable;
