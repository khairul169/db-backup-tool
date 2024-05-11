import api, { parseJson } from "@/lib/api";
import { InferResponseType } from "hono/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "react-query";
import { IoCheckmarkCircle, IoServerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ConnectionStatus from "./connection-status";

dayjs.extend(relativeTime);

type ServerItemType = InferResponseType<typeof api.servers.$get>[number];
type ServerListProps = {
  items: ServerItemType[];
};

const ServerList = ({ items }: ServerListProps) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mt-4">
      {items.map((item) => (
        <ServerItem key={item.id} {...item} />
      ))}
    </div>
  );
};

const ServerItem = ({ id, name, databases }: ServerItemType) => {
  const { data: check, error } = useQuery({
    queryKey: ["server", id],
    queryFn: async () => {
      return api.servers.check[":id"].$get({ param: { id } }).then(parseJson);
    },
    refetchInterval: 30000,
  });

  return (
    <Link
      to={`/servers/${id}`}
      className="border rounded-lg p-4 md:p-6 bg-white transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start gap-2 md:gap-4">
        <div className="relative">
          <IoServerOutline className="text-gray-800 text-xl mt-1" />
          <ConnectionStatus
            status={check?.success}
            error={error}
            className="absolute -top-0.5 -right-0.5"
          />
        </div>

        <div className="flex-1">
          <p className="font-medium text-xl">{name}</p>

          <div className="mt-1 flex items-center">
            <p>
              {`${databases.length} database` +
                (databases.length > 1 ? "s" : "")}
            </p>
            <p className="ml-8">0 errors</p>
            <IoCheckmarkCircle className="text-green-600 ml-1 inline" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServerList;
