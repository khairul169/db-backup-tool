import { ErrorAlert } from "@/components/ui/alert";
import Button from "@/components/ui/button";
import api, { parseJson } from "@/lib/api";
import { useQuery } from "react-query";
import ServerList from "../../servers/components/server-list";
import ServerFormDialog from "../../servers/components/server-form-dialog";
import { initialServerData } from "@/pages/servers/schema";
import PageTitle from "@/components/ui/page-title";
import { serverFormDlg } from "@/pages/servers/stores";

const ServerSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["servers"],
    queryFn: () => api.servers.$get().then(parseJson),
  });

  return (
    <section>
      <PageTitle setTitle={false}>Servers</PageTitle>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <ErrorAlert error={error} />
      ) : !data?.length ? (
        <div className="mt-4 min-h-60 md:min-h-80 flex flex-col items-center justify-center">
          <p>No server added.</p>
          <Button
            className="mt-2"
            onClick={() => serverFormDlg.onOpen({ ...initialServerData })}
          >
            Add Server
          </Button>
        </div>
      ) : (
        <ServerList items={data} />
      )}

      <ServerFormDialog />
    </section>
  );
};

export default ServerSection;
