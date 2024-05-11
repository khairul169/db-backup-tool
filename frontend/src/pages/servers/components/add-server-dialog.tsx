import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreateServerSchema,
  createServerSchema,
} from "@backend/schemas/server.schema";
import Form from "@/components/ui/form";
import { InputField } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { connectionTypes } from "../schema";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useFormContext } from "@/context/form-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation } from "react-query";
import api, { parseJson } from "@/lib/api";
import { ErrorAlert } from "@/components/ui/alert";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import { addServerDlg } from "../stores";

const AddServerDialog = () => {
  const { isOpen, data } = addServerDlg.useState();
  const form = useForm({
    resolver: zodResolver(createServerSchema),
    defaultValues: data,
  });
  const type = useWatch({ control: form.control, name: "connection.type" });
  const databases = useWatch({ control: form.control, name: "databases" });

  useEffect(() => {
    form.reset(data);
  }, [form, data]);

  const checkConnection = useMutation({
    mutationFn: async () => {
      const { connection, ssh } = form.getValues();
      const res = await api.servers.check.$post({
        json: { connection, ssh },
      });
      const { databases } = await parseJson(res);
      return {
        success: true,
        databases: databases.map((i) => i.name),
      };
    },
  });

  const createServer = useMutation({
    mutationFn: async (data: CreateServerSchema) => {
      const res = await api.servers.$post({ json: data });
      return parseJson(res);
    },
    onSuccess: () => {
      addServerDlg.onClose();
      queryClient.invalidateQueries("servers");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createServer.mutate(values);
  });

  return (
    <Dialog open={isOpen} onOpenChange={addServerDlg.setOpen}>
      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <DialogTitle>Add Server</DialogTitle>

          <DialogBody>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <InputField form={form} name="name" label="Server Name" />

              <SelectField
                form={form}
                name="connection.type"
                options={connectionTypes}
                label="Type"
              />

              {type === "postgres" && (
                <>
                  <InputField
                    form={form}
                    name="connection.host"
                    label="Hostname"
                  />
                  <InputField
                    form={form}
                    type="number"
                    name="connection.port"
                    label="Port"
                  />
                  <InputField
                    form={form}
                    name="connection.user"
                    label="Username"
                  />
                  <InputField
                    form={form}
                    type="password"
                    name="connection.pass"
                    label="Password"
                  />
                </>
              )}
            </div>

            <ErrorAlert error={checkConnection.error} className="mt-4" />
            <Button
              className="mt-4"
              variant="outline"
              size="sm"
              icon={IoInformationCircleOutline}
              isLoading={checkConnection.isLoading}
              onClick={() => checkConnection.mutate()}
            >
              Check Connection
            </Button>

            <SelectDatabase databases={checkConnection.data?.databases} />
          </DialogBody>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={addServerDlg.onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!databases.length || !checkConnection.data?.success}
              isLoading={createServer.isLoading}
            >
              Submit
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const SelectDatabase = ({ databases }: { databases?: string[] }) => {
  const form = useFormContext<CreateServerSchema>();

  if (databases == null) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm flex-1">Database:</p>
        <Checkbox
          id="select-all-db"
          onCheckedChange={(checked) => {
            if (checked) {
              form.setValue("databases", databases);
            } else {
              form.setValue("databases", []);
            }
          }}
        />
        <Label htmlFor="select-all-db" className="cursor-pointer">
          Select All
        </Label>
      </div>

      {!databases.length && <p className="text-gray-500">No database exist.</p>}

      <Controller
        control={form.control}
        name="databases"
        render={({ field: { value, onChange } }) => (
          <div className="grid sm:grid-cols-2 gap-2 mt-2 max-h-[260px] overflow-y-auto">
            {databases.map((name) => (
              <div
                key={name}
                className="flex gap-2 items-center border rounded px-3 hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`db-${name}`}
                  checked={value.includes(name)}
                  onCheckedChange={(checked) => {
                    onChange(
                      checked
                        ? [...value, name]
                        : value.filter((i) => i !== name)
                    );
                  }}
                />
                <Label
                  htmlFor={`db-${name}`}
                  className="flex-1 py-3 block cursor-pointer"
                >
                  {name}
                </Label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default AddServerDialog;
