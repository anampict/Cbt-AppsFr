"use client";

import Button from "@/components/ui/Button";
import { TbCloudDownload } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useMapelListStore } from "../_store/mapelListStore";
import dynamic from "next/dynamic";
import { IoIosAddCircleOutline } from "react-icons/io";

const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), {
  ssr: false,
});

const MapelListActionTools = () => {
  const router = useRouter();

  const mapelList = useMapelListStore((state) => state.mapelList);

  return (
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
        onClick={() => router.push("/mapel/tambah")}
      >
        Tambah Mapel
      </Button>
    </div>
  );
};

export default MapelListActionTools;
