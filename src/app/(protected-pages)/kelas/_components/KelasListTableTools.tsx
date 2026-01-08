"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { TbSearch } from "react-icons/tb";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const KelasListTableTools = () => {
  const { onAppendQueryParams } = useAppendQueryParams();
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    onAppendQueryParams({
      query: value,
      pageIndex: "1",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        size="sm"
        placeholder="Cari kelas..."
        value={searchValue}
        onChange={handleChange}
        className="max-w-md"
      />
    </div>
  );
};

export default KelasListTableTools;
