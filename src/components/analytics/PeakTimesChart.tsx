import { motion } from 'framer-motion'

interface PeakTimeData {
    hour: number
    count: number
    label: string
    percentage: number
}

interface PeakTimesChartProps {
    data: PeakTimeData[]
}

export default function PeakTimesChart({ data }: PeakTimesChartProps) {
    if (!data || data.length === 0 || data.every(d => d.count === 0)) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Peak Registration Times</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                    No registration data yet
                </div>
            </div>
        )
    }

    // Group hours into time periods for better visualization
    const periods = [
        { name: 'Morning', range: '6AM-12PM', hours: [6, 7, 8, 9, 10, 11], color: '#F59E0B' },
        { name: 'Afternoon', range: '12PM-5PM', hours: [12, 13, 14, 15, 16], color: '#3B82F6' },
        { name: 'Evening', range: '5PM-9PM', hours: [17, 18, 19, 20], color: '#8B5CF6' },
        { name: 'Night', range: '9PM-6AM', hours: [21, 22, 23, 0, 1, 2, 3, 4, 5], color: '#1E293B' },
    ]

    const periodStats = periods.map(period => {
        const total = period.hours.reduce((sum, h) => sum + (data[h]?.count || 0), 0)
        return { ...period, total }
    })

    const maxPeriodTotal = Math.max(...periodStats.map(p => p.total), 1)

    // Find peak hour
    const peakHour = data.reduce((max, curr) => (curr.count > max.count ? curr : max), data[0])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Peak Registration Times</h3>
            <p className="text-sm text-gray-500 mb-4">
                Most registrations occur at <span className="font-semibold text-indigo-600">{peakHour.label}</span>
            </p>

            {/* Time period bars */}
            <div className="space-y-4 mb-6">
                {periodStats.map((period, index) => (
                    <motion.div
                        key={period.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{period.name}</span>
                            <span className="text-xs text-gray-400">{period.range}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(period.total / maxPeriodTotal) * 100}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="h-full rounded-lg"
                                    style={{ backgroundColor: period.color }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                {period.total}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Hourly heatmap */}
            <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Hourly Distribution</p>
                <div className="grid grid-cols-12 gap-1">
                    {data.slice(0, 24).map((hour, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-sm relative group"
                            style={{
                                backgroundColor: `rgba(99, 102, 241, ${hour.percentage / 100})`,
                            }}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {hour.label}: {hour.count}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>12AM</span>
                    <span>6AM</span>
                    <span>12PM</span>
                    <span>6PM</span>
                    <span>11PM</span>
                </div>
            </div>
        </motion.div>
    )
}
