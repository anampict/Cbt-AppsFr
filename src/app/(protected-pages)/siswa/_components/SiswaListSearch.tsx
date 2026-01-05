"use client";

import { useState, useCallback } from "react";
import Input from "@/components/ui/Input";
import { TbSearch } from "react-icons/tb";
import debounce from "lodash/debounce";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const SiswaListSearch = () => {
  const { onAppendQueryParams } = useAppendQueryParams();
  const [searchValue, setSearchValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onAppendQueryParams({ query: value, pageIndex: "1" });
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-96">
      <Input
        placeholder="Cari siswa..."
        size="sm"
        prefix={<TbSearch className="text-lg" />}
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SiswaListSearch;
