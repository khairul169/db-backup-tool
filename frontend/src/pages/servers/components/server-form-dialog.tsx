import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import Form from "@/components/ui/form";
import { useMutation } from "react-query";
import api, { parseJson } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import { serverFormDlg } from "../stores";
import ConnectionTab from "./server-form-connection-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackupTab from "./server-form-backup-tab";
import { ServerFormSchema, serverFormSchema } from "../schema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ServerFormDialog = () => {
  const { isOpen, data } = serverFormDlg.useState();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(serverFormSchema),
    defaultValues: data,
  });
  const databases = useWatch({ control: form.control, name: "databases" });

  useEffect(() => {
    form.reset(data);
  }, [form, data]);

  const saveServer = useMutation({
    mutationFn: async (data: ServerFormSchema) => {
      if (data.id) {
        const res = await api.servers[":id"].$patch({
          param: { id: data.id },
          json: data,
        });
        return parseJson(res);
      } else {
        const res = await api.servers.$post({ json: data });
        return parseJson(res);
      }
    },
    onSuccess: (data) => {
      serverFormDlg.onClose();
      queryClient.invalidateQueries("servers");
      navigate(`/servers/${data.id}`);
    },
    onError: (err) => {
      toast.error((err as Error)?.message || "Failed to save server");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    saveServer.mutate(values);
  });

  return (
    <Dialog open={isOpen} onOpenChange={serverFormDlg.setOpen}>
      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <DialogTitle>{`${data?.id ? "Edit" : "Add"} Server`}</DialogTitle>

          <DialogBody className="min-h-[300px]">
            <Tabs defaultValue="connection" className="mt-4">
              <TabsList>
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
              </TabsList>

              <ConnectionTab />
              <BackupTab />
            </Tabs>
          </DialogBody>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={serverFormDlg.onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!databases?.length}
              isLoading={saveServer.isLoading}
            >
              Submit
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerFormDialog;
