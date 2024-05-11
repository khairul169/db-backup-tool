import { TableColumn } from "@/components/ui/data-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BackupButton from "../components/backup-button";
import { copyToClipboard, formatBytes } from "@/lib/utils";
import BackupStatus from "../components/backup-status";
import { queryClient } from "@/lib/queryClient";
import Button from "@/components/ui/button";
import { IoCloudDownload, IoCopy, IoEllipsisVertical } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { confirmDlg } from "@/components/containers/confirm-dialog";
import api, { parseJson } from "@/lib/api";
import { toast } from "sonner";

dayjs.extend(relativeTime);

export type DatabaseType = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  serverId: string;
  lastBackupAt: string | null;
};

export const databaseColumns: TableColumn<DatabaseType>[] = [
  {
    name: "Name",
    selector: (i) => i.name,
  },
  {
    name: "Last Backup",
    selector: (i) =>
      i.lastBackupAt ? dayjs(i.lastBackupAt).format("YYYY-MM-DD HH:mm") : "",
    cell: (i) => (i.lastBackupAt ? dayjs(i.lastBackupAt).fromNow() : "never"),
  },
  {
    selector: (i) => i.id,
    width: "160px",
    cell: (i) => (
      <div className="flex items-center justify-end gap-1 w-full">
        <BackupButton
          databaseId={i.id}
          onCreate={() => {
            queryClient.invalidateQueries(["backups/by-server", i.serverId]);
          }}
        />
      </div>
    ),
  },
];

export type BackupType = {
  id: string;
  serverId: string;
  databaseId: string;
  type: string;
  status: string;
  output: string;
  key: string | null;
  hash: string | null;
  size: number | null;
  createdAt: Date;
  database?: DatabaseType;
};

const onRestoreBackup = async (row: BackupType) => {
  try {
    const res = await api.backups.restore.$post({
      json: { backupId: row.id },
    });
    await parseJson(res);
    toast.success("Queueing database restore!");
    queryClient.invalidateQueries(["backups/by-server", row.serverId]);
  } catch (err) {
    toast.error("Failed to restore backup! " + (err as Error).message);
  }
};

export const backupsColumns: TableColumn<BackupType>[] = [
  {
    name: "Type",
    selector: (i) => i.type,
    cell: (i) => (i.type === "backup" ? "Backup" : "Restore"),
  },
  {
    name: "Database Name",
    selector: (i) => i.database?.name || "-",
  },
  {
    name: "Status",
    selector: (i) => i.status,
    cell: (i) => <BackupStatus status={i.status as never} output={i.output} />,
  },
  {
    name: "Data",
    selector: (i) => i.key || "-",
    center: true,
    cell: (i) =>
      i.key ? (
        <Button
          variant="outline"
          icon={IoCloudDownload}
          className="min-w-[80px] px-2"
          size="sm"
        >
          {formatBytes(i.size || 0)}
        </Button>
      ) : (
        "-"
      ),
  },
  {
    name: "SHA256",
    selector: (i) => i.hash || "",
    cell: (i) =>
      i.hash ? (
        <Button
          icon={IoCopy}
          size="sm"
          className="truncate shrink-0 px-2 -mx-2"
          variant="ghost"
          title={i.hash}
          onClick={() => copyToClipboard(i.hash!)}
        >
          <p className="flex-1">{i.hash.substring(0, 8) + ".."}</p>
        </Button>
      ) : (
        "-"
      ),
  },
  {
    name: "Timestamp",
    selector: (i) => dayjs(i.createdAt).format("YYYY-MM-DD HH:mm"),
    cell: (i) => {
      const diff = dayjs().diff(dayjs(i.createdAt), "days");
      return diff < 3
        ? dayjs(i.createdAt).fromNow()
        : dayjs(i.createdAt).format("DD/MM/YY HH:mm");
    },
  },
  {
    selector: (i) => i.id,
    width: "40px",
    style: { padding: 0 },
    cell: (row) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IoEllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                confirmDlg.onOpen({
                  title: "Restore Backup",
                  description: "Are you sure want to restore this backup?",
                  onConfirm: () => onRestoreBackup(row),
                });
              }}
            >
              Restore
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
