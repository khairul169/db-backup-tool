import CheckboxField from "@/components/ui/checkbox";
import { InputField } from "@/components/ui/input";
import { SelectField, SelectOption } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { useFormContext } from "@/context/form-context";
import { CreateServerSchema } from "@backend/schemas/server.schema";
import { useWatch } from "react-hook-form";

const intervalList: SelectOption[] = [
  // { label: "Second", value: "second" },
  { label: "Minute", value: "minute" },
  { label: "Hour", value: "hour" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const dayOfWeekList: SelectOption[] = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

const monthList: SelectOption[] = [
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" },
];

const BackupTab = () => {
  const form = useFormContext<CreateServerSchema>();
  const scheduled = useWatch({
    control: form.control,
    name: "backup.scheduled",
  });
  const interval = useWatch({
    control: form.control,
    name: "backup.interval",
  });

  return (
    <TabsContent value="backup" className="mt-4">
      <CheckboxField form={form} name="backup.compress" label="Compressed" />

      <CheckboxField
        className="mt-4"
        form={form}
        name="backup.scheduled"
        label="Schedule Backup"
      />

      {scheduled && (
        <div className="ml-6 mt-2 p-2 rounded bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <p className="flex-1">every</p>
            <InputField
              form={form}
              name="backup.every"
              type="number"
              className="w-2/3"
            />
          </div>
          <SelectField
            form={form}
            name="backup.interval"
            options={intervalList}
          />

          {["day", "week", "month", "year"].includes(interval) && (
            <div className="flex items-center gap-2">
              <p className="flex-1">at</p>
              <InputField
                type="time"
                form={form}
                name="backup.time"
                className="w-2/3"
              />
            </div>
          )}

          {["week", "month"].includes(interval) && (
            <div className="flex items-center gap-2">
              <p className="flex-1">on</p>
              <SelectField
                form={form}
                name="backup.day"
                options={dayOfWeekList}
                className="w-2/3"
              />
            </div>
          )}

          {interval === "year" && (
            <div className="flex items-center gap-2">
              <p className="flex-1">on</p>
              <SelectField
                form={form}
                name="backup.month"
                options={monthList}
                className="w-2/3"
              />
            </div>
          )}
        </div>
      )}
    </TabsContent>
  );
};

export default BackupTab;
