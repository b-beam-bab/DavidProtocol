import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type IssueBondDialogProps = {
  disabled: boolean;
};

export const IssueBondDialog = ({ disabled }: IssueBondDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          Issue New Bond
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue New Bond</DialogTitle>
          <DialogDescription>
            Bond issuance dialog content will be added here.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
