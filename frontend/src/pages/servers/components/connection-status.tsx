import { cn } from "@/lib/utils";

type ConnectionStatusProps = {
  status?: boolean | null;
  error?: unknown;
  className?: string;
};

const ConnectionStatus = ({
  status,
  error,
  className,
}: ConnectionStatusProps) => {
  const statusColor = status
    ? "bg-green-600 animate-pulse"
    : error
    ? "bg-red-500 animate-ping"
    : "bg-gray-500";
  const statusLabel = getConnectionLabel(status, error);

  return (
    <div
      className={cn("size-3 rounded-full", statusColor, className)}
      title={statusLabel}
    />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const getConnectionLabel = (
  status?: boolean | null,
  error?: unknown
) => {
  return status ? "Connected" : error ? "Error!" : "Unknown";
};

export default ConnectionStatus;
