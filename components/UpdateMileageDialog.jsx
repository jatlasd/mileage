import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UpdateMileageDialog = ({ needsOilChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMileage, setNewMileage] = useState("");
  const [lastChangeDate, setLastChangeDate] = useState(null);
  const [oldMileage, setOldMileage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/oil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mileage: Number(newMileage),
          currentlyNeeds: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to update oil change mileage");
      setIsOpen(false);
      setNewMileage("");
      window.location.reload();
    } catch (error) {
      console.error("Error updating oil change:", error);
      alert("Failed to update oil change mileage");
    }
  };

  useEffect(() => {
    const fetchOil = async () => {
      const response = await fetch("/api/oil");
      const data = await response.json();
      if (data.lastChange) {
        const date = new Date(data.lastChange);
        const estDate = new Date(
          date.toLocaleString("en-US", { timeZone: "America/New_York" })
        );
        const month = estDate.toLocaleString("en-US", { month: "long" });
        const formattedDate = `${month} ${estDate.getDate()}, ${estDate.getFullYear()}`;
        setLastChangeDate(formattedDate);
        setOldMileage(data.mileage);
      }
    };
    fetchOil();
  }, []);

  if (!needsOilChange) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-1/2 md:w-1/4 mb-6 gap-2">
          <AlertCircle className="w-4 h-4" />
          Oil Change Needed
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1b26] border border-white/[0.1]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Oil Change Needed!
          </DialogTitle>
        </DialogHeader>

        <p className="text-lg text-text/80">
          Your vehicle has exceeded 3,000 miles since the last oil change.
          Please enter the new mileage after completing the oil change.
        </p>
        <p className="text-sm text-text/60">
          Last changed at{" "}
          <span className="text-primary/80 text-lg font-semibold">
            {oldMileage}
          </span>{" "}
          miles on{" "}
          <span className="text-primary text-lg font-semibold'">
            {lastChangeDate || "No previous change"}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-transparent">
                New Oil Change Mileage
              </label>
              <Input
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(e.target.value)}
                placeholder="Enter current mileage"
                className="w-full h-14 px-4 border text-text/80 border-white/10 rounded-xl bg-white/[0.07] font-mono placeholder:text-text/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.09] transition-all"
                required
              />
            </div>

            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                className="bg-accent-2/40 hover:bg-accent-2/50 text-text/50 hover:text-text/60"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={!newMileage}
                className="bg-primary/60 hover:bg-primary/70"
              >
                Update Mileage
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMileageDialog;
