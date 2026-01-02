"use client";

import Button from "@/components/ui/Button";
import { TbCloudDownload } from "react-icons/tb";
import { useGuruListStore } from "../_store/guruListStore";
import dynamic from "next/dynamic";
import GuruAddDialog from "./GuruAddDialog";

const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), {
  ssr: false,
});

const GuruListActionTools = () => {
  const guruList = useGuruListStore((state) => state.guruList);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <CSVLink className="w-full" filename="guruList.csv" data={guruList}>
        <Button
          icon={<TbCloudDownload className="text-xl" />}
          className="w-full"
        >
          Download
        </Button>
      </CSVLink>
      <GuruAddDialog />
    </div>
  );
};

export default GuruListActionTools;
