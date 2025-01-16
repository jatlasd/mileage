import { memo } from "react";

const StatBox = memo(function StatBox({ label, value }) {
  return (
    <div className="bg-white/[0.03] p-3 rounded-lg">
      <div className="text-text/50 mb-1">{label}</div>
      <div className="font-mono text-lg">{value.toFixed(1)}</div>
    </div>
  );
});

const MileageStats = memo(function MileageStats({ stats }) {
  const currentMonth = new Date()
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

    const calculateWriteoff = () => {
      return stats.ytd * 0.7
    }

  return (
    <div className="bg-white/[0.07] border-b border-white/[0.05] rounded-xl mt-10">
      <div className="p-5 space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-text/60">TODAY</span>
          <span className="font-mono text-3xl text-primary">
            {stats.today.toFixed(1)}
          </span>
          <span className="text-sm text-text/60">miles</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <StatBox label="YTD" value={stats.ytd} />
          <StatBox label={currentMonth} value={stats.month} />
          <StatBox label="WEEK" value={stats.week} />
          <StatBox label="TAX" value={calculateWriteoff()} />
        </div>
      </div>
    </div>
  );
}); 

export default MileageStats