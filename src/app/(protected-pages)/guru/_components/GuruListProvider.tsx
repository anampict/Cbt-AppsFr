"use client";

import { useEffect } from "react";
import { useGuruListStore } from "../_store/guruListStore";
import type { Guru } from "../types";
import type { CommonProps } from "@/@types/common";

interface GuruListProviderProps extends CommonProps {
  guruList: Guru[];
}

const GuruListProvider = ({ guruList, children }: GuruListProviderProps) => {
  const setGuruList = useGuruListStore((state) => state.setGuruList);

  const setInitialLoading = useGuruListStore(
    (state) => state.setInitialLoading
  );

  useEffect(() => {
    setGuruList(guruList);

    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guruList]);

  return <>{children}</>;
};

export default GuruListProvider;
