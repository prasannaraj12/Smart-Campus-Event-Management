import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, MapPin, Users, ChevronRight } from 'lucide-react'

interface RecommendedEventsProps {
    userId: Id<"users">
}

const categoryColors: Record<string, string> = {
    Workshop: 'bg-purple-100 text-purple-700 border-purple-200',
    Seminar: 'bg-blue-100 text-blue-700 border-blue-200',
    Sports: 'bg-green-100 text-green-700 border-green-200',
    Cultural: 'bg-pink-100 text-pink-700 border-pink-200',
    Technical: 'bg-orange-100 text-orange-700 border-orange-200',
    Social: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export default function RecommendedEvents({ userId }: RecommendedEventsProps) {
    const navigate = useNavigate()
    const recommendedEvents = useQuery(api.recommendations.getRecommendedEvents, { userId })

    // Don't render if no recommendations or loading
    if (!recommendedEvents || recommendedEvents.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">Events You Might Like</h2>
                </div>
                <span className="text-sm text-gray-500">Based on your interests</span>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {recommendedEvents.map((event: any) => (
                        <motion.div
                            key={event._id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/event/${event._id}`)}
                            className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden"
                        >
                            {/* Category Accent Bar */}
                            <div className={`h-1 ${categoryColors[event.category]?.split(' ')[0] || 'bg-gray-200'}`} />

                            <div className="p-4">
                                {/* Category Badge */}
                                <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'} mb-2`}>
                                    {event.category}
                                </span>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

                                {/* Meta Info */}
                                <div className="space-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{event.maxParticipants} spots</span>
                                    </div>
                                </div>

                                {/* View Button */}
                                <div className="mt-3 flex items-center justify-end text-sm font-semibold text-indigo-600">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
