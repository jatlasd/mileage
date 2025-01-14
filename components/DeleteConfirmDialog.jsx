import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmDialog({ onConfirm }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-1 hover:bg-white/10 rounded">
          <Trash2 className="w-4 h-4 text-primary" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1b26] border border-white/[0.1]">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Trip</DialogTitle>
          <DialogDescription className="text-text/50">
            Are you sure you want to delete this trip? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-text hover:bg-white/10 hover:text-text">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="ghost" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-400" onClick={onConfirm}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 