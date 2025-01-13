const FilterButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-surface hover:bg-surface/80 text-text/80'
      }`}
    >
      {children}
    </button>
  )
}

export default FilterButton 