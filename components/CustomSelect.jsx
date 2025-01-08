import { memo } from "react";

const CustomSelect = memo(function CustomSelect({ value, onChange, options, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[#1a1b26] text-sm rounded-lg px-3 py-1.5 border border-white/[0.1] text-white/80 outline-none appearance-none cursor-pointer hover:bg-[#1f2133] transition-colors pr-8 relative ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        backgroundSize: "16px",
      }}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value} className="bg-[#1a1b26]">
          {label}
        </option>
      ))}
    </select>
  );
});

export default CustomSelect; 