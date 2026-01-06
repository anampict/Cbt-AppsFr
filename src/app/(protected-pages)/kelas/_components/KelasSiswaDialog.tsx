"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import Input from "@/components/ui/Input";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import SiswaService from "@/service/SiswaService";
import SiswaEditDialog from "../../siswa/_components/SiswaEditDialog";
import { TbSearch, TbPencil, TbTrash, TbPlus } from "react-icons/tb";
import debounce from "lodash/debounce";
import type { Siswa } from "../../siswa/types";
import type { ColumnDef } from "@/components/shared/DataTable";

interface KelasSiswaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kelasId: string;
  kelasName: string;
  onSuccess?: () => void;
}

const KelasSiswaDialog = ({
  isOpen,
  onClose,
  kelasId,
  kelasName,
  onSuccess,
}: KelasSiswaDialogProps) => {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    siswa: Siswa | null;
  }>({
    isOpen: false,
    siswa: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    siswaId: "",
    siswaName: "",
  });

  useEffect(() => {
    if (isOpen && kelasId) {
      loadSiswaList();
    }
  }, [isOpen, kelasId, searchValue]);

  const loadSiswaList = async () => {
    try {
      setLoading(true);
      const response = await SiswaService.getSiswaByKelas(kelasId, {
        limit: 100,
        search: searchValue || undefined,
      });
      setSiswaList(response.data);
      setTotalSiswa(response.meta.total);
    } catch (error) {
      console.error("Error loading siswa:", error);
      setSiswaList([]);
      setTotalSiswa(0);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

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

  const handleDeleteClick = (siswa: Siswa) => {
    setDeleteConfirm({
      isOpen: true,
      siswaId: siswa.id,
      siswaName: siswa.nama,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await SiswaService.deleteSiswa(deleteConfirm.siswaId);

      toast.push(
        <Notification type="success">Siswa berhasil dihapus!</Notification>,
        {
          placement: "top-center",
        }
      );

      setDeleteConfirm({
        isOpen: false,
        siswaId: "",
        siswaName: "",
      });

      loadSiswaList();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error deleting siswa:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menghapus siswa!"}
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
      siswaId: "",
      siswaName: "",
    });
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

  const columns: ColumnDef<Siswa>[] = useMemo(
    () => [
      {
        header: "Foto",
        accessorKey: "fotoUrl",
        cell: (props) => {
          const row = props.row.original;
          const displayName = row.nama || "N/A";
          const fotoSrc = row.fotoUrl
            ? row.fotoUrl.startsWith("http")
              ? row.fotoUrl
              : `http://localhost:3000${row.fotoUrl}`
            : "";

          return (
            <div className="flex items-center">
              {fotoSrc ? (
                <Avatar
                  size={40}
                  shape="circle"
                  src={fotoSrc}
                  alt={displayName}
                />
              ) : (
                <Avatar size={40} shape="circle" alt={displayName}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </div>
          );
        },
      },
      {
        header: "Nama Siswa",
        accessorKey: "nama",
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {row.nama}
            </div>
          );
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
          return (
            <div>
              <div className="text-sm font-medium">
                {row.original.sekolah?.nama || "-"}
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
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        width={1200}
        closable={!loading}
      >
        <div className="flex items-center justify-between mb-4">
          <h5 className="mb-0">Daftar Siswa - {kelasName}</h5>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Cari siswa..."
              size="md"
              className="w-full sm:w-48 md:w-120" // HP: full, Desktop: 192px/256px
              prefix={<TbSearch className="text-lg" />}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            size="sm"
            variant="solid"
            icon={<TbPlus />}
            onClick={() => {
              // Navigate to add siswa page or open add dialog
              window.location.href = "/siswa";
            }}
          >
            Tambah Siswa
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size={40} />
          </div>
        ) : siswaList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchValue
              ? "Tidak ada siswa yang sesuai dengan pencarian"
              : "Belum ada siswa di kelas ini"}
          </div>
        ) : (
          <div className="mt-4">
            <DataTable columns={columns} data={siswaList} loading={loading} />
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 text-center">
          Total: {totalSiswa} siswa
        </div>
      </Dialog>

      {editDialog.siswa && (
        <SiswaEditDialog
          siswa={editDialog.siswa}
          isOpen={editDialog.isOpen}
          onClose={handleCloseEditDialog}
          onSuccess={() => {
            handleCloseEditDialog();
            loadSiswaList();
            onSuccess?.();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        type="danger"
        title="Hapus Siswa"
        onClose={handleCancelDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus{" "}
          <strong>{deleteConfirm.siswaName}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default KelasSiswaDialog;
