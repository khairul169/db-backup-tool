import { IconType } from "react-icons";
import {
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoRemoveCircle,
  IoSyncCircle,
} from "react-icons/io5";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  status: "pending" | "running" | "success" | "failed";
  output?: string;
};

const labels: Record<Props["status"], string> = {
  pending: "Pending",
  running: "Running",
  success: "Success",
  failed: "Failed",
};

const colors: Record<Props["status"], string> = {
  pending: "bg-gray-500",
  running: "bg-blue-500",
  success: "bg-green-600",
  failed: "bg-red-500",
};

const icons: Record<Props["status"], IconType> = {
  pending: IoRemoveCircle,
  running: IoSyncCircle,
  success: IoCheckmarkCircle,
  failed: IoCloseCircleOutline,
};

const BackupStatus = ({ status, output }: Props) => {
  const Icon = icons[status] || "div";

  return (
    <Popover>
      <PopoverTrigger
        disabled={!output}
        title={output?.substring(0, 120)}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-lg text-white shrink-0",
          colors[status]
        )}
      >
        <Icon
          className={cn("text-lg", status === "running" ? "animate-spin" : "")}
        />
        <p className="text-sm">{labels[status]}</p>
      </PopoverTrigger>

      <PopoverContent className="max-w-lg w-screen p-0">
        <textarea className="font-mono text-sm w-full h-[200px] border-none outline-none p-4">
          {output}
        </textarea>
      </PopoverContent>
    </Popover>
  );
};

export default BackupStatus;
