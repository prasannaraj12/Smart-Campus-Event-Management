import { motion } from 'framer-motion'

interface CategoryData {
    category: string
    eventCount: number
    registrationCount: number
    color: string
}

interface CategoryPieChartProps {
    data: CategoryData[]
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Events by Category</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                    No category data yet
                </div>
            </div>
        )
    }

    const total = data.reduce((sum, d) => sum + d.eventCount, 0)
    const radius = 80
    const centerX = 100
    const centerY = 100

    // Calculate pie slices
    let currentAngle = -90 // Start from top

    const slices = data.map((d) => {
        const percentage = d.eventCount / total
        const angle = percentage * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle = endAngle

        // Calculate path for pie slice
        const startRad = (startAngle * Math.PI) / 180
        const endRad = (endAngle * Math.PI) / 180

        const x1 = centerX + radius * Math.cos(startRad)
        const y1 = centerY + radius * Math.sin(startRad)
        const x2 = centerX + radius * Math.cos(endRad)
        const y2 = centerY + radius * Math.sin(endRad)

        const largeArc = angle > 180 ? 1 : 0

        const path =
            `M ${centerX} ${centerY} ` +
            `L ${x1} ${y1} ` +
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} ` +
            `Z`

        return { ...d, path, percentage: Math.round(percentage * 100) }
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Events by Category</h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Pie Chart */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="flex-shrink-0">
                    {slices.map((slice, i) => (
                        <motion.path
                            key={slice.category}
                            d={slice.path}
                            fill={slice.color}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                            style={{ transformOrigin: 'center' }}
                        />
                    ))}
                    {/* Center circle for donut effect */}
                    <circle cx={centerX} cy={centerY} r={45} fill="white" />
                    <text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        className="text-2xl font-bold fill-gray-900"
                    >
                        {total}
                    </text>
                    <text
                        x={centerX}
                        y={centerY + 15}
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                    >
                        Events
                    </text>
                </svg>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {slices.map((slice) => (
                        <div key={slice.category} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: slice.color }}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {slice.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    {slice.eventCount} events
                                </span>
                                <span className="text-xs font-semibold text-gray-400">
                                    {slice.percentage}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
