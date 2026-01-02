"use client";

import DebouceInput from "@/components/shared/DebouceInput";
import { TbSearch } from "react-icons/tb";
import { Ref } from "react";

type MapelListSearchProps = {
  onInputChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
};

const MapelListSearch = (props: MapelListSearchProps) => {
  const { onInputChange, ref } = props;

  return (
    <DebouceInput
      ref={ref}
      placeholder="Cari mata pelajaran..."
      suffix={<TbSearch className="text-lg" />}
      className="w-full md:w-100"
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default MapelListSearch;
