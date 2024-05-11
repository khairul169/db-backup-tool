import Card from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import SectionTitle from "@/components/ui/section-title";
import { DatabaseType, databaseColumns } from "../table";

type DatabaseSectionProps = {
  databases: DatabaseType[];
};

const DatabaseSection = ({ databases }: DatabaseSectionProps) => {
  return (
    <div className="flex flex-col">
      <SectionTitle className="mt-8">Databases</SectionTitle>
      <Card className="mt-4 px-2 flex-1 pb-2">
        <DataTable
          columns={databaseColumns as never}
          data={databases}
          pagination
        />
      </Card>
    </div>
  );
};

export default DatabaseSection;
