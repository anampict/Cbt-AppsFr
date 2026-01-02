"use client";

import { useState } from "react";
import StickyFooter from "@/components/shared/StickyFooter";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useMapelListStore } from "../_store/mapelListStore";
import { useRouter } from "next/navigation";
import { TbChecks } from "react-icons/tb";
import MapelService from "@/service/MapelService";

const MapelListSelected = () => {
  const router = useRouter();
  const mapelList = useMapelListStore((state) => state.mapelList);
  const setMapelList = useMapelListStore((state) => state.setMapelList);
  const selectedMapel = useMapelListStore((state) => state.selectedMapel);
  const setSelectAllMapel = useMapelListStore(
    (state) => state.setSelectAllMapel
  );

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete each selected mapel from the API
      await Promise.all(
        selectedMapel
          .filter((mapel) => mapel.id)
          .map((mapel) => MapelService.deleteMapel(mapel.id!))
      );

      const newMapelList = mapelList.filter((mapel) => {
        return !selectedMapel.some((selected) => selected.id === mapel.id);
      });
      setSelectAllMapel([]);
      setMapelList(newMapelList);
      setDeleteConfirmationOpen(false);

      toast.push(
        <Notification type="success">
          {selectedMapel.length} Mata pelajaran berhasil dihapus!
        </Notification>,
        { placement: "top-center" }
      );

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">
          Gagal menghapus mata pelajaran!
        </Notification>,
        { placement: "top-center" }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {selectedMapel.length > 0 && (
        <StickyFooter
          className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
          stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
          defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <span>
                {selectedMapel.length > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-primary">
                      <TbChecks />
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <span className="heading-text">
                        {selectedMapel.length} Mata Pelajaran
                      </span>
                      <span>dipilih</span>
                    </span>
                  </span>
                )}
              </span>

              <div className="flex items-center">
                <Button
                  size="sm"
                  className="ltr:mr-3 rtl:ml-3"
                  type="button"
                  loading={isDeleting}
                  customColorClass={() =>
                    "border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error"
                  }
                  onClick={handleDelete}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </StickyFooter>
      )}
      <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Hapus Mata Pelajaran"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus {selectedMapel.length} mata
          pelajaran yang dipilih? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default MapelListSelected;
