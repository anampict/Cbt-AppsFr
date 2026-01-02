"use client";

import { useEffect } from "react";
import { useMapelListStore } from "../_store/mapelListStore";
import type { Mapel } from "../types";
import type { CommonProps } from "@/@types/common";

interface MapelListProviderProps extends CommonProps {
  mapelList: Mapel[];
}

const MapelListProvider = ({ mapelList, children }: MapelListProviderProps) => {
  const setMapelList = useMapelListStore((state) => state.setMapelList);

  const setInitialLoading = useMapelListStore(
    (state) => state.setInitialLoading
  );

  useEffect(() => {
    setMapelList(mapelList);

    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapelList]);

  return <>{children}</>;
};

export default MapelListProvider;
