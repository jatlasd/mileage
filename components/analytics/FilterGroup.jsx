import { Card } from '../ui/card'
import FilterButton from './FilterButton'

const FilterGroup = ({ title, value, onChange, options }) => {
  return (
    <Card className="p-4 bg-background border-white/[0.1]">
      <h3 className="text-lg font-semibold mb-3 text-text">{title}</h3>
      <div className="flex gap-2">
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
    </Card>
  )
}

export default FilterGroup 