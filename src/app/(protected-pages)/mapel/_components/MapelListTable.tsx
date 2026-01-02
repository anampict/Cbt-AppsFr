"use client";

import { useMemo, useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { useMapelListStore } from "../_store/mapelListStore";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbPencil, TbEye, TbTrash } from "react-icons/tb";
import MapelService from "@/service/MapelService";
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from "@/components/shared/DataTable";
import type { Mapel } from "../types";

type MapelListTableProps = {
  mapelListTotal: number;
  pageIndex?: number;
  pageSize?: number;
};

const NameColumn = ({ row }: { row: Mapel }) => {
  const displayName = row.namaMapel || "N/A";

  return (
    <Link
      className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100`}
      href={`/mapel/${row.id}`}
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

const MapelListTable = ({
  mapelListTotal,
  pageIndex = 1,
  pageSize = 10,
}: MapelListTableProps) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    mapelId: "",
    mapelName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const mapelList = useMapelListStore((state) => state.mapelList);
  const selectedMapel = useMapelListStore((state) => state.selectedMapel);
  const isInitialLoading = useMapelListStore((state) => state.initialLoading);
  const setSelectedMapel = useMapelListStore((state) => state.setSelectedMapel);
  const setSelectAllMapel = useMapelListStore(
    (state) => state.setSelectAllMapel
  );

  const { onAppendQueryParams } = useAppendQueryParams();

  const handleEdit = (mapel: Mapel) => {
    router.push(`/mapel/edit/${mapel.id}`);
  };

  const handleViewDetails = (mapel: Mapel) => {
    router.push(`/mapel/${mapel.id}`);
  };

  const handleDeleteClick = (mapel: Mapel) => {
    setDeleteConfirm({
      isOpen: true,
      mapelId: mapel.id,
      mapelName: mapel.namaMapel || "Mata pelajaran ini",
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await MapelService.deleteMapel(deleteConfirm.mapelId);
      toast.push(
        <Notification type="success">
          Mata pelajaran berhasil dihapus!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      setDeleteConfirm({ isOpen: false, mapelId: "", mapelName: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">
          Gagal menghapus mata pelajaran!
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Mapel>[] = useMemo(
    () => [
      {
        header: "Kode Mapel",
        accessorKey: "kodeMapel",
      },
      {
        header: "Nama Mata Pelajaran",
        accessorKey: "namaMapel",
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
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
        header: "NPSN",
        accessorKey: "npsn",
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.sekolah.npsn}</span>;
        },
      },
      {
        header: "Jumlah Guru",
        accessorKey: "guru",
        cell: ({ row }) => {
          const guruCount = row.original.guru.length;
          return (
            <span className="text-sm">
              {guruCount > 0 ? `${guruCount} Guru` : "-"}
            </span>
          );
        },
      },
      {
        header: "Deskripsi",
        accessorKey: "deskripsi",
        cell: ({ row }) => {
          return (
            <span className="text-sm">{row.original.deskripsi || "-"}</span>
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

  const handleRowSelect = (checked: boolean, row: Mapel) => {
    setSelectedMapel(checked, row);
  };

  const handleAllRowSelect = (checked: boolean, rows: Row<Mapel>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllMapel(originalRows);
    } else {
      setSelectAllMapel([]);
    }
  };

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={mapelList}
        noData={mapelList.length === 0}
        loading={isInitialLoading}
        pagingData={{
          total: mapelListTotal,
          pageIndex,
          pageSize,
        }}
        checkboxChecked={(row) =>
          selectedMapel.some((selected) => selected.id === row.id)
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
        title="Hapus Mata Pelajaran"
        onClose={() =>
          setDeleteConfirm({ isOpen: false, mapelId: "", mapelName: "" })
        }
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, mapelId: "", mapelName: "" })
        }
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus{" "}
          <strong>{deleteConfirm.mapelName}</strong>?
        </p>
      </ConfirmDialog>
    </>
  );
};

export default MapelListTable;
