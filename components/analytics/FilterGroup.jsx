import { Card } from '../ui/card'
import FilterButton from './FilterButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const FilterGroup = ({ title, value, onChange, options }) => {
  return (
    <Card className="p-3 bg-background border-white/[0.1]">
      <h3 className="text-sm font-medium mb-2 text-text/60">{title}</h3>
      <div className="block md:hidden">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-[#1a1b26] border border-white/[0.1] text-white/80 hover:bg-[#1f2133] transition-colors">
            <SelectValue placeholder={`Select ${title.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1b26] border border-white/[0.1] text-white/80">
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className="hover:bg-[#1f2133] focus:bg-[#1f2133] focus:text-white/80"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="hidden md:flex md:flex-wrap gap-2">
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