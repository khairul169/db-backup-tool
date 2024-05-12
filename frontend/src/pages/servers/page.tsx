import { ErrorAlert } from "@/components/ui/alert";
import Button from "@/components/ui/button";
import api, { parseJson } from "@/lib/api";
import { useQuery } from "react-query";
import ServerList from "./components/server-list";
import ServerFormDialog from "./components/server-form-dialog";
import { serverFormDlg } from "./stores";
import { initialServerData } from "./schema";
import PageTitle from "@/components/ui/page-title";

const ServerPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["servers"],
    queryFn: () => api.servers.$get().then(parseJson),
  });

  return (
    <main>
      <div className="flex items-center gap-2 mt-2 md:mt-4">
        <PageTitle className="flex-1">Servers</PageTitle>

        <Button onClick={() => serverFormDlg.onOpen({ ...initialServerData })}>
          Add Server
        </Button>
      </div>

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
    </main>
  );
};

export default ServerPage;
