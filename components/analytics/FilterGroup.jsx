import FilterButton from './FilterButton'

const FilterGroup = ({ title, value, onChange, options, icon }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="text-sm font-semibold text-text/80 uppercase tracking-wide">{title}</h3>
      </div>

      {/* Mobile: Horizontal scroll tabs */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex gap-2 md:flex-wrap min-w-max md:min-w-0">
          {options.map((option) => (
            <FilterButton
              key={option.value}
              isActive={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default FilterGroup 