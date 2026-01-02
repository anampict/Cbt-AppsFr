"use client";

import MapelListSearch from "./MapelListSearch";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const MapelListTableTools = () => {
  const { onAppendQueryParams } = useAppendQueryParams();

  const handleInputChange = (query: string) => {
    onAppendQueryParams({
      query,
      pageIndex: "1",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <MapelListSearch onInputChange={handleInputChange} />
    </div>
  );
};

export default MapelListTableTools;
