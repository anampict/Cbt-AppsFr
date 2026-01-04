"use client";

import Button from "@/components/ui/Button";
import { useKelasListStore } from "./KelasListProvider";
import { TbTrash } from "react-icons/tb";

const KelasListSelected = () => {
  const selectedKelas = useKelasListStore((state) => state.selectedKelas);

  if (selectedKelas.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedKelas.length} kelas dipilih
        </span>
        <Button size="sm" variant="solid" color="red-600" icon={<TbTrash />}>
          Hapus Terpilih
        </Button>
      </div>
    </div>
  );
};

export default KelasListSelected;
