"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { TbSearch } from "react-icons/tb";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const KelasListTableTools = () => {
  const { onAppendQueryParams } = useAppendQueryParams();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onAppendQueryParams({
      query: searchValue,
      pageIndex: "1",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        size="sm"
        placeholder="Cari kelas..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="max-w-md"
      />
      <Button size="sm" icon={<TbSearch />} onClick={handleSearch}>
        Cari
      </Button>
    </div>
  );
};

export default KelasListTableTools;
