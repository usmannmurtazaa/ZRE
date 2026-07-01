export function HorizontalBarChart({
  data,
  color = 'var(--primary, #3D52A0)',
}: {
  data: { name: string; value: number; fill?: string }[]
  color?: string
}) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground">No data yet.</p>
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="group flex items-center gap-3">
          <span className="text-xs text-foreground w-20 truncate" title={item.name}>
            {item.name}
          </span>
          <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
              style={{
                width: `${Math.round((item.value / max) * 100)}%`,
                backgroundColor: item.fill || color,
              }}
            />
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center text-[10px] text-white font-medium drop-shadow">
              {item.value}
            </div>
          </div>
          <span className="text-xs font-medium text-foreground w-8 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function VerticalBarChart({
  data,
  color = 'var(--primary, #3D52A0)',
  height = 160,
}: {
  data: { label: string; value: number }[]
  color?: string
  height?: number
}) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground">No data yet.</p>
  const max = Math.max(...data.map((d) => d.value), 1)
  const barWidth = 24
  const gap = 12
  const chartWidth = data.length * (barWidth + gap)
  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={height} className="mx-auto">
        {data.map((item, i) => {
          const barHeight = (item.value / max) * (height - 30)
          const x = i * (barWidth + gap)
          const y = height - barHeight - 20
          return (
            <g key={item.label} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={color}
                className="transition-all duration-500 group-hover:brightness-110"
              />
              <text
                x={x + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {item.label}
              </text>
              {item.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {item.value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
