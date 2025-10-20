const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="
      p-4 md:p-5
      bg-gradient-to-br from-background/80 to-background/40
      border border-border/50
      rounded-xl
      shadow-lg hover:shadow-xl
      transition-all duration-300
      hover:scale-[1.02] active:scale-[0.98]
      group
    ">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-text/60 group-hover:text-text/80 transition-colors">
          {title}
        </h3>
        {icon && (
          <span className="text-xl md:text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            {icon}
          </span>
        )}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1.5 leading-none">
        {value}
      </div>
      <p className="text-xs md:text-sm text-text/50 leading-relaxed">{subtitle}</p>
    </div>
  )
}

export default StatCard 