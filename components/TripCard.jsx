import { memo } from "react";
import { Clock, Edit2, X, Check } from "lucide-react";
import TripBreaks from "./TripBreaks";
import TripOrders from "./TripOrders";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const TripTime = memo(function TripTime({ startTime, endTime, duration, totalBreakDuration }) {
  const netDuration = duration
    ? duration - Math.round(totalBreakDuration / 60)
    : null;

  return (
    <div className="flex flex-wrap gap-3 mt-2 text-sm text-text/50">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        <span>
          {startTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
          {endTime && (
            <>
              →{" "}
              {endTime.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </>
          )}
        </span>
      </div>
      {duration && (
        <div className="text-text/40">
          {netDuration}m (breaks: {Math.round(totalBreakDuration / 60)}m)
        </div>
      )}
    </div>
  );
});

const MileageEdit = memo(function MileageEdit({
  isEditing,
  editForm,
  onEditFormChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  trip,
}) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={editForm.startMileage}
          onChange={(e) =>
            onEditFormChange({
              ...editForm,
              startMileage: e.target.value,
            })
          }
          className="w-20 px-2 py-1 text-sm bg-white/10 rounded border border-white/20 font-mono"
          placeholder="Start"
        />
        <span className="text-text/50">→</span>
        <input
          type="number"
          value={editForm.endMileage}
          onChange={(e) =>
            onEditFormChange({
              ...editForm,
              endMileage: e.target.value,
            })
          }
          className="w-20 px-2 py-1 text-sm bg-white/10 rounded border border-white/20 font-mono"
          placeholder="End"
        />
        <button
          onClick={() => onSave(trip._id)}
          className="p-1 hover:bg-white/10 rounded"
        >
          <Check className="w-4 h-4 text-green-400" />
        </button>
        <button onClick={onCancel} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-text/50 font-mono">
        {trip.startMileage} → {trip.endMileage || "..."}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(trip)} className="p-1 hover:bg-white/10 rounded">
          <Edit2 className="w-4 h-4 text-text/40" />
        </button>
        <DeleteConfirmDialog onConfirm={() => onDelete(trip._id)} />
      </div>
    </>
  );
});

const TripCard = memo(function TripCard({
  trip,
  editingTrip,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onEditFormChange,
  onDelete,
}) {
  const startTime = new Date(trip.startDatetime);
  const endTime = trip.endDatetime ? new Date(trip.endDatetime) : null;
  const duration = endTime
    ? Math.round((endTime - startTime) / (1000 * 60))
    : null;
  const totalBreakDuration = trip.totalBreakDuration || 0;

  return (
    <div className="bg-white/[0.07] rounded-xl p-4 border border-white/[0.05]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl">
              {trip.tripMiles?.toFixed(1) || "--"}
            </span>
            <span className="text-text/60">mi</span>
            {trip.isActive && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>

          <TripTime
            startTime={startTime}
            endTime={endTime}
            duration={duration}
            totalBreakDuration={totalBreakDuration}
          />
        </div>

        <div className="flex items-center gap-2">
          <MileageEdit
            isEditing={editingTrip === trip._id}
            editForm={editForm}
            onEditFormChange={onEditFormChange}
            onSave={onSave}
            onCancel={onCancel}
            onEdit={onEdit}
            onDelete={onDelete}
            trip={trip}
          />
        </div>
      </div>

      <TripBreaks breaks={trip.breaks} />
      <TripOrders orders={trip.orders} />
    </div>
  );
});

export default TripCard; 