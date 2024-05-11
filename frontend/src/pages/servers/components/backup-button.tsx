import Button from "@/components/ui/button";
import api, { parseJson } from "@/lib/api";
import { useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useMutation } from "react-query";
import { BackupType } from "../view/table";
import { toast } from "sonner";

type BackupButtonProps = {
  databaseId: string;
  onCreate?: (data: BackupType) => void;
};

const BackupButton = ({ databaseId, onCreate }: BackupButtonProps) => {
  const [isPressed, setPressed] = useState(false);

  const createBackup = useMutation({
    mutationFn: async () => {
      return api.backups.$post({ json: { databaseId } }).then(parseJson);
    },
    onSuccess: (data) => {
      onCreate?.(data as never);
      toast.success("Backup queued!");
    },
  });

  const onPress = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 2000);
    createBackup.mutate();
  };

  return (
    <Button
      icon={IoCloudDownloadOutline}
      variant="outline"
      size="sm"
      onClick={onPress}
      isLoading={isPressed || createBackup.isLoading}
    >
      Backup
    </Button>
  );
};

export default BackupButton;
