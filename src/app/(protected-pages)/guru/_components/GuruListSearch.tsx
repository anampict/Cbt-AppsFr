"use client";

import DebouceInput from "@/components/shared/DebouceInput";
import { TbSearch } from "react-icons/tb";
import { Ref } from "react";

type GuruListSearchProps = {
  onInputChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
};

const GuruListSearch = (props: GuruListSearchProps) => {
  const { onInputChange, ref } = props;

  return (
    <DebouceInput
      ref={ref}
      placeholder="Cari guru..."
      suffix={<TbSearch className="text-lg" />}
      className="w-full md:w-100"
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default GuruListSearch;
