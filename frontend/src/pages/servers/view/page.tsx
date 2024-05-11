import BackButton from "@/components/ui/back-button";
import PageTitle from "@/components/ui/page-title";
import api, { parseJson } from "@/lib/api";
import { IoServer } from "react-icons/io5";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ConnectionStatus, {
  getConnectionLabel,
} from "../components/connection-status";
import Card from "@/components/ui/card";
import BackupSection from "./components/backups-section";
import DatabaseSection from "./components/databases-section";

const ViewServerPage = () => {
  const id = useParams().id!;

  const { data, isLoading, error } = useQuery({
    queryKey: ["servers"],
    queryFn: () => api.servers[":id"].$get({ param: { id } }).then(parseJson),
  });

  const check = useQuery({
    queryKey: ["server", id],
    queryFn: async () => {
      return api.servers.check[":id"].$get({ param: { id } }).then(parseJson);
    },
    refetchInterval: 30000,
  });

  if (isLoading || error) {
    return null;
  }

  return (
    <main>
      <BackButton to="/servers" />
      <PageTitle>Server Information</PageTitle>

      <Card className="mt-4 p-4 md:p-8">
        <IoServer className="text-4xl text-gray-600" />
        <div className="mt-2 flex items-center">
          <p className="text-xl text-gray-800">{data?.name}</p>

          {data?.connection?.host ? (
            <span className="inline-block rounded-lg px-2 py-0.5 bg-gray-100 ml-3 text-sm">
              {data?.connection?.host}
            </span>
          ) : null}
        </div>

        <div className="text-sm mt-1 flex items-center gap-2">
          <ConnectionStatus status={check.data?.success} error={check.error} />
          <p>{getConnectionLabel(check.data?.success, check.error)}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-4 w-full overflow-hidden">
        <DatabaseSection databases={data?.databases || []} />
        <BackupSection databases={data?.databases || []} />
      </div>
    </main>
  );
};

export default ViewServerPage;
