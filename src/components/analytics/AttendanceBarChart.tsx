import { motion } from 'framer-motion'

interface AttendanceData {
    eventId: string
    title: string
    registrations: number
    attendance: number
    rate: number
    date: string
}

interface AttendanceBarChartProps {
    data: AttendanceData[]
}

export default function AttendanceBarChart({ data }: AttendanceBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance by Event</h3>
                <div className="h-48 flex items-center justify-center text-gray-400">
                    No attendance data yet
                </div>
            </div>
        )
    }

    // Show only top 6 events
    const displayData = data.slice(0, 6)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance by Event</h3>
            <p className="text-sm text-gray-500 mb-4">Showing {displayData.length} most recent events</p>

            <div className="space-y-4">
                {displayData.map((event, index) => (
                    <motion.div
                        key={event.eventId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                {event.title}
                            </span>
                            <span className="text-sm text-gray-500">
                                {event.attendance}/{event.registrations} ({event.rate}%)
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${event.rate}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`h-full rounded-full ${event.rate >= 80
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                        : event.rate >= 50
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                            : 'bg-gradient-to-r from-rose-400 to-rose-500'
                                    }`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-500">80%+ Excellent</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-gray-500">50-79% Good</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-gray-500">&lt;50% Needs Improvement</span>
                </div>
            </div>
        </motion.div>
    )
}
