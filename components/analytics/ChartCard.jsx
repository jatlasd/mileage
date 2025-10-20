const ChartCard = ({ title, subtitle, height = 300, children, icon }) => {
  return (
    <div className="
      p-4 md:p-6
      bg-gradient-to-br from-background/80 to-background/40
      border border-border/50
      rounded-xl
      shadow-lg
      transition-all duration-300
    ">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="text-base md:text-lg font-bold text-text">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-text/50 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div
        style={{ height: `${height}px` }}
        className="
          flex items-center justify-center
          bg-background/30
          rounded-lg
          border border-border/30
          overflow-hidden
        "
      >
        {children}
      </div>
    </div>
  )
}

export default ChartCard 