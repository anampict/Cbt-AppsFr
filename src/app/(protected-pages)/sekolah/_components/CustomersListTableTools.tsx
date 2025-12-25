"use client";

import CustomerListSearch from "./CustomerListSearch";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";

const CustomersListTableTools = () => {
  const { onAppendQueryParams } = useAppendQueryParams();

  const handleInputChange = (query: string) => {
    onAppendQueryParams({
      query,
      pageIndex: "1",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <CustomerListSearch onInputChange={handleInputChange} />
    </div>
  );
};

export default CustomersListTableTools;
