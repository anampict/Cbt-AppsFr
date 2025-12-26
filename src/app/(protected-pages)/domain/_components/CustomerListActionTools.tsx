"use client";

import DomainAddDialog from "./DomainAddDialog";

const CustomerListActionTools = ({ onRefresh }: { onRefresh?: () => void }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <DomainAddDialog onSuccess={onRefresh} />
    </div>
  );
};

export default CustomerListActionTools;
