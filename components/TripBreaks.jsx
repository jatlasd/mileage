import { memo } from "react";

const Break = memo(function Break({ breakPeriod }) {
  const breakStart = new Date(breakPeriod.startTime);
  const breakEnd = breakPeriod.endTime ? new Date(breakPeriod.endTime) : null;

  return (
    <div className="text-xs text-text/60 flex items-center gap-2">
      <span>
        {breakStart.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
        {breakEnd && (
          <>
            →{" "}
            {breakEnd.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </>
        )}
      </span>
      {breakPeriod.duration && (
        <span className="text-text/40">
          ({Math.round(breakPeriod.duration / 60)}m)
        </span>
      )}
    </div>
  );
});

const TripBreaks = memo(function TripBreaks({ breaks }) {
  if (!breaks || breaks.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.05]">
      <div className="text-xs text-text/40 mb-2">Breaks:</div>
      <div className="space-y-1">
        {breaks.map((breakPeriod, index) => (
          <Break key={index} breakPeriod={breakPeriod} />
        ))}
      </div>
    </div>
  );
});

export default TripBreaks; 