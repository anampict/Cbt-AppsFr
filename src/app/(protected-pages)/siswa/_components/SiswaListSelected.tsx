"use client";

import { useSiswaListStore } from "../_store/siswaListStore";

const SiswaListSelected = () => {
  const selectedSiswa = useSiswaListStore((state) => state.selectedSiswa);

  if (selectedSiswa.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <p className="text-sm font-medium">
        {selectedSiswa.length} siswa dipilih
      </p>
    </div>
  );
};

export default SiswaListSelected;
