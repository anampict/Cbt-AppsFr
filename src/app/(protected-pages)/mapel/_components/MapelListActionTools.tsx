"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { TbCloudDownload } from "react-icons/tb";
import { useMapelListStore } from "../_store/mapelListStore";
import dynamic from "next/dynamic";
import { IoIosAddCircleOutline } from "react-icons/io";
import MapelAddDialog from "./MapelAddDialog";

const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), {
  ssr: false,
});

const MapelListActionTools = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const mapelList = useMapelListStore((state) => state.mapelList);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3">
        <CSVLink className="w-full" filename="mapelList.csv" data={mapelList}>
          <Button
            icon={<TbCloudDownload className="text-xl" />}
            className="w-full"
          >
            Download
          </Button>
        </CSVLink>
        <Button
          variant="solid"
          icon={<IoIosAddCircleOutline className="text-xl" />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Tambah Mapel
        </Button>
      </div>
      <MapelAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
        }}
      />
    </>
  );
};

export default MapelListActionTools;
