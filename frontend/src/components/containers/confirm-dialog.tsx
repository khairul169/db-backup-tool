import { createDisclosureStore } from "@/lib/disclosure";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import Button from "../ui/button";

type ConfirmDialogData = {
  onConfirm: () => void;
  title?: string;
  description?: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const confirmDlg = createDisclosureStore<ConfirmDialogData>({
  onConfirm: () => {},
});

const ConfirmDialog = () => {
  const { isOpen, data } = confirmDlg.useState();

  return (
    <Dialog open={isOpen} onOpenChange={confirmDlg.setOpen}>
      <DialogContent>
        <DialogTitle>{data?.title || "Are you sure?"}</DialogTitle>
        <DialogDescription>{data?.description}</DialogDescription>

        <DialogFooter>
          <Button variant="outline" onClick={confirmDlg.onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              data?.onConfirm();
              confirmDlg.onClose();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
