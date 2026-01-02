"use client";

import { useState } from "react";
import StickyFooter from "@/components/shared/StickyFooter";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useGuruListStore } from "../_store/guruListStore";
import { useRouter } from "next/navigation";
import { TbChecks } from "react-icons/tb";
import GuruService from "@/service/GuruService";

const GuruListSelected = () => {
  const router = useRouter();
  const guruList = useGuruListStore((state) => state.guruList);
  const setGuruList = useGuruListStore((state) => state.setGuruList);
  const selectedGuru = useGuruListStore((state) => state.selectedGuru);
  const setSelectAllGuru = useGuruListStore((state) => state.setSelectAllGuru);

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
      // Delete each selected guru from the API
      await Promise.all(
        selectedGuru
          .filter((guru) => guru.id)
          .map((guru) => GuruService.deleteGuru(guru.id!))
      );

      const newGuruList = guruList.filter((guru) => {
        return !selectedGuru.some((selected) => selected.id === guru.id);
      });
      setSelectAllGuru([]);
      setGuruList(newGuruList);
      setDeleteConfirmationOpen(false);

      toast.push(
        <Notification type="success">
          {selectedGuru.length} Guru berhasil dihapus!
        </Notification>,
        { placement: "top-center" }
      );

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.push(
        <Notification type="danger">Gagal menghapus guru!</Notification>,
        { placement: "top-center" }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {selectedGuru.length > 0 && (
        <StickyFooter
          className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
          stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
          defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <span>
                {selectedGuru.length > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-primary">
                      <TbChecks />
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <span className="heading-text">
                        {selectedGuru.length} Guru
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
        title="Hapus Guru"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ loading: isDeleting }}
      >
        <p>
          Apakah Anda yakin ingin menghapus {selectedGuru.length} guru yang
          dipilih? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default GuruListSelected;
