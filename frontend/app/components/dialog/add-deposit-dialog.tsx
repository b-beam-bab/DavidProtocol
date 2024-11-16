import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export const AddDepositDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Add Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Deposit</DialogTitle>
          <DialogDescription>
            Deposit dialog content will be added here.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
