const FilterButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-200
        active:scale-95
        whitespace-nowrap
        ${
          isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'bg-background/50 border border-border text-text/70 hover:bg-background hover:text-text hover:border-primary/30'
        }
      `}
    >
      {children}
    </button>
  )
}

export default FilterButton 