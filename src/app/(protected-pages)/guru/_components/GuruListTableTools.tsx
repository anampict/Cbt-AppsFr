"use client";

import GuruListSearch from "./GuruListSearch";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const GuruListTableTools = () => {
  const { onAppendQueryParams } = useAppendQueryParams();

  const handleInputChange = (query: string) => {
    onAppendQueryParams({
      query,
      pageIndex: "1",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <GuruListSearch onInputChange={handleInputChange} />
    </div>
  );
};

export default GuruListTableTools;
