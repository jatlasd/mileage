import { memo, useMemo } from "react";
import CustomSelect from "./CustomSelect";

const FilterBar = memo(function FilterBar({
  filterPeriod,
  filterYear,
  totalItems,
  onFilterPeriodChange,
  onFilterYearChange,
}) {
  const periodOptions = useMemo(
    () => [
      { value: "all", label: "All Time" },
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "week", label: "Last 7 Days" },
      { value: "month", label: "Last 30 Days" },
    ],
    []
  );

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
      }),
    []
  );

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-text/60">RECENT TRIPS</h2>
        <CustomSelect
          value={filterPeriod}
          onChange={onFilterPeriodChange}
          options={periodOptions}
        />
      </div>
      <div className="flex items-center gap-4">
        <CustomSelect
          value={filterYear}
          onChange={onFilterYearChange}
          options={yearOptions}
        />
        <div className="text-sm text-text/40">{totalItems} total</div>
      </div>
    </div>
  );
});

export default FilterBar; 