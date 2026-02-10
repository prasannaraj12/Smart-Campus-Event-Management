import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface OverviewStatsProps {
    totalEvents: number
    totalRegistrations: number
    totalAttendance: number
    attendanceRate: number
    upcomingEvents: number
}

export default function OverviewStats({
    totalEvents,
    totalRegistrations,
    totalAttendance,
    attendanceRate,
    upcomingEvents,
}: OverviewStatsProps) {
    const stats = [
        {
            label: 'Total Events',
            value: totalEvents,
            subtitle: `${upcomingEvents} upcoming`,
            color: 'from-violet-500 to-purple-600',
            bgColor: 'from-violet-50 to-purple-100',
            borderColor: 'border-violet-200',
        },
        {
            label: 'Registrations',
            value: totalRegistrations,
            subtitle: 'All time',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'from-blue-50 to-cyan-100',
            borderColor: 'border-blue-200',
        },
        {
            label: 'Attendance',
            value: totalAttendance,
            subtitle: 'Marked present',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'from-emerald-50 to-teal-100',
            borderColor: 'border-emerald-200',
        },
        {
            label: 'Attendance Rate',
            value: `${attendanceRate}%`,
            subtitle: 'Show-up rate',
            color: 'from-amber-500 to-orange-600',
            bgColor: 'from-amber-50 to-orange-100',
            borderColor: 'border-amber-200',
            isPercentage: true,
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} rounded-2xl p-5 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
                >
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className={`w-4 h-4 text-gray-500`} />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
