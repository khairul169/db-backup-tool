import React from "react";
import DataTableComponent, { TableColumn } from "react-data-table-component";

type DataTableProps = React.ComponentPropsWithoutRef<typeof DataTableComponent>;

const DataTable = ({ ...props }: DataTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <DataTableComponent {...props} />
    </div>
  );
};

export type { TableColumn };
export default DataTable;
