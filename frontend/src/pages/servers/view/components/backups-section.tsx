import Card from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import SectionTitle from "@/components/ui/section-title";
import { DatabaseType, backupsColumns } from "../table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import api, { parseJson } from "@/lib/api";
import { useQueryParams } from "@/hooks/useQueryParams";
import Button from "@/components/ui/button";
import { IoRefresh } from "react-icons/io5";
import Select from "@/components/ui/select";

type BackupSectionProps = {
  databases: DatabaseType[];
};

type QueryParams = {
  page: number;
  limit: number;
  databaseId?: string;
};

const BackupSection = ({ databases }: BackupSectionProps) => {
  const id = useParams().id!;
  const [query, setQuery] = useQueryParams<QueryParams>({
    page: 1,
    limit: 10,
    databaseId: undefined,
  });

  const backups = useQuery({
    queryKey: ["backups/by-server", id, query],
    queryFn: async () => {
      return api.backups
        .$get({
          query: {
            serverId: id,
            limit: String(query.limit),
            page: String(query.page),
            databaseId: query.databaseId,
          },
        })
        .then(parseJson);
    },
    refetchInterval: 3000,
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-2">
        <SectionTitle className="mt-8">Backups</SectionTitle>
        <Button
          icon={IoRefresh}
          variant="ghost"
          size="icon"
          className="text-2xl -mb-1"
          onClick={() => backups.refetch()}
          isLoading={backups.isRefetching}
        />
        <div className="flex-1" />
        <Select
          options={databases.map((i) => ({ label: i.name, value: i.id }))}
          onChange={(i) => setQuery({ databaseId: i })}
          value={query.databaseId}
          placeholder="Select Database"
          className="min-w-[120px] w-auto"
        />
      </div>
      <Card className="mt-4 px-2 flex-1">
        <DataTable
          columns={backupsColumns as never}
          data={backups?.data?.rows || []}
          pagination
          progressPending={backups.isLoading}
          paginationServer
          paginationPerPage={query.limit}
          paginationTotalRows={backups?.data?.count}
          onChangeRowsPerPage={(limit) => setQuery({ limit })}
          onChangePage={(page) => setQuery({ page })}
        />
      </Card>
    </div>
  );
};

export default BackupSection;
