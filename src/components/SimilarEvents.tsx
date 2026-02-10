import { motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Calendar, MapPin, ArrowRight } from 'lucide-react'

interface SimilarEventsProps {
    eventId: Id<"events">
}

const categoryColors: Record<string, string> = {
    Workshop: 'bg-purple-100 text-purple-700',
    Seminar: 'bg-blue-100 text-blue-700',
    Sports: 'bg-green-100 text-green-700',
    Cultural: 'bg-pink-100 text-pink-700',
    Technical: 'bg-orange-100 text-orange-700',
    Social: 'bg-yellow-100 text-yellow-700',
}

export default function SimilarEvents({ eventId }: SimilarEventsProps) {
    const navigate = useNavigate()
    const similarEvents = useQuery(api.recommendations.getSimilarEvents, { eventId })

    // Don't render if no similar events or loading
    if (!similarEvents || similarEvents.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
        >
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Similar Events</h2>
            </div>

            {/* Grid of Similar Events */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarEvents.map((event: any) => (
                    <motion.div
                        key={event._id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/event/${event._id}`)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 p-4"
                    >
                        {/* Category Badge */}
                        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'} mb-2`}>
                            {event.category}
                        </span>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{event.title}</h3>

                        {/* Meta Info */}
                        <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{event.location}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600">
                            View <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
