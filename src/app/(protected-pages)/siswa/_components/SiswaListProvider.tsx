"use client";

import { useEffect } from "react";
import { useSiswaListStore } from "../_store/siswaListStore";
import type { Siswa } from "../types";

type SiswaListProviderProps = {
  siswaList: Siswa[];
  children: React.ReactNode;
};

const SiswaListProvider = ({ siswaList, children }: SiswaListProviderProps) => {
  const setSiswaList = useSiswaListStore((state) => state.setSiswaList);
  const setInitialLoading = useSiswaListStore(
    (state) => state.setInitialLoading
  );

  useEffect(() => {
    setSiswaList(siswaList);
    setInitialLoading(false);
  }, [siswaList, setSiswaList, setInitialLoading]);

  return <>{children}</>;
};

export default SiswaListProvider;
