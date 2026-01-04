"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { TbPlus } from "react-icons/tb";
import KelasAddDialog from "./KelasAddDialog";

const KelasListActionTools = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="solid"
        icon={<TbPlus />}
        onClick={() => setIsAddDialogOpen(true)}
      >
        Tambah Kelas
      </Button>
      <KelasAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => {
          setIsAddDialogOpen(false);
        }}
      />
    </>
  );
};

export default KelasListActionTools;
