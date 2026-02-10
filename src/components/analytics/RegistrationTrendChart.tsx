import { motion } from 'framer-motion'

interface TrendData {
    date: string
    count: number
    label: string
}

interface RegistrationTrendChartProps {
    data: TrendData[]
}

export default function RegistrationTrendChart({ data }: RegistrationTrendChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Trends</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                    No registration data yet
                </div>
            </div>
        )
    }

    const maxCount = Math.max(...data.map(d => d.count), 1)

    // Use fixed dimensions for better control
    const padding = { top: 20, right: 20, bottom: 40, left: 40 }
    const width = 500
    const height = 200
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Calculate points for the line chart
    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (d.count / maxCount) * chartHeight
        return { x, y, ...d }
    })

    // Create SVG path
    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ')

    // Create area path (filled area under the line)
    const areaPath = `${linePath} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

    // Show only 6 labels evenly distributed
    const labelCount = 6
    const labelIndices = Array.from({ length: labelCount }, (_, i) =>
        Math.round((i / (labelCount - 1)) * (data.length - 1))
    )

    // Y-axis labels
    const yLabels = [0, Math.round(maxCount / 2), maxCount]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Registration Trends</h3>
            <p className="text-sm text-gray-500 mb-4">Last 30 days</p>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto"
                    style={{ minHeight: '200px' }}
                >
                    {/* Grid lines */}
                    {[0, 0.5, 1].map((ratio) => (
                        <line
                            key={ratio}
                            x1={padding.left}
                            y1={padding.top + chartHeight - ratio * chartHeight}
                            x2={padding.left + chartWidth}
                            y2={padding.top + chartHeight - ratio * chartHeight}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="4 2"
                        />
                    ))}

                    {/* Y-axis labels */}
                    {yLabels.map((label, i) => (
                        <text
                            key={i}
                            x={padding.left - 10}
                            y={padding.top + chartHeight - (i / 2) * chartHeight + 4}
                            textAnchor="end"
                            className="text-xs fill-gray-400"
                            style={{ fontSize: '11px' }}
                        >
                            {label}
                        </text>
                    ))}

                    {/* Area fill */}
                    <path
                        d={areaPath}
                        fill="url(#trendGradient)"
                        opacity="0.4"
                    />

                    {/* Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />

                    {/* Data points - show only on key positions */}
                    {labelIndices.map((idx) => {
                        const p = points[idx]
                        return (
                            <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="white"
                                stroke="#6366f1"
                                strokeWidth="2"
                            />
                        )
                    })}

                    {/* X-axis labels */}
                    {labelIndices.map((idx) => {
                        const p = points[idx]
                        return (
                            <text
                                key={p.date}
                                x={p.x}
                                y={height - 10}
                                textAnchor="middle"
                                className="fill-gray-400"
                                style={{ fontSize: '10px' }}
                            >
                                {p.label}
                            </text>
                        )
                    })}

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </motion.div>
    )
}
