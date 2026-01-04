"use client";

import { ReactNode } from "react";
import { create } from "zustand";
import type { Kelas } from "../types";

type KelasList = Kelas[];

interface KelasListStore {
  kelasList: KelasList;
  selectedKelas: string[];
  initialLoading: boolean;
  setKelasList: (list: KelasList) => void;
  setSelectedKelas: (id: string[]) => void;
  setSelectAllKelas: (checked: boolean) => void;
  setInitialLoading: (loading: boolean) => void;
}

export const useKelasListStore = create<KelasListStore>((set) => ({
  kelasList: [],
  selectedKelas: [],
  initialLoading: true,
  setKelasList: (list: KelasList) => set({ kelasList: list }),
  setSelectedKelas: (ids: string[]) => set({ selectedKelas: ids }),
  setSelectAllKelas: (checked: boolean) =>
    set((state) => ({
      selectedKelas: checked ? state.kelasList.map((kelas) => kelas.id) : [],
    })),
  setInitialLoading: (loading: boolean) => set({ initialLoading: loading }),
}));

export default function KelasListProvider({
  children,
  kelasList,
}: {
  children: ReactNode;
  kelasList: KelasList;
}) {
  const setKelasList = useKelasListStore((state) => state.setKelasList);
  const setInitialLoading = useKelasListStore(
    (state) => state.setInitialLoading
  );

  setKelasList(kelasList);
  setInitialLoading(false);

  return <>{children}</>;
}
