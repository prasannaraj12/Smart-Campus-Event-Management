import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Trash2 } from 'lucide-react'
import { getDaysUntilEvent } from '../lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'

interface Event {
  _id: Id<"events">
  _creationTime?: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxParticipants: number
  organizerId: Id<"users">
}

interface Props {
  event: Event
  onDeleted?: (id: Id<"events">) => void
}

export default function EventCard({ event, onDeleted }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const deleteEvent = useMutation(api.events.deleteEvent)
  const [deleting, setDeleting] = useState(false)

  const registrations = useQuery(api.registrations.getEventRegistrations, { eventId: event._id })

  const daysUntil = getDaysUntilEvent(event.date)
  const participantCount = registrations?.length || 0
  const capacityPercentage = (participantCount / event.maxParticipants) * 100

  // Check if event was created recently (within 3 days)
  const createdDaysAgo = event._creationTime
    ? Math.floor((Date.now() - event._creationTime) / (1000 * 60 * 60 * 24))
    : 999
  const isNew = createdDaysAgo <= 3

  // Capacity status
  const isAlmostFull = capacityPercentage >= 80
  const isFull = capacityPercentage >= 100

  // Capacity bar color
  const getCapacityColor = () => {
    if (capacityPercentage >= 80) return 'bg-red-500'
    if (capacityPercentage >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Time indicator text
  const getTimeIndicator = () => {
    if (daysUntil < 0) return { text: 'Closed', color: 'bg-gray-500 text-white' }
    if (daysUntil === 0) return { text: 'Today', color: 'bg-red-500 text-white' }
    if (daysUntil === 1) return { text: 'Tomorrow', color: 'bg-orange-500 text-white' }
    if (daysUntil <= 7) return { text: `${daysUntil}D left`, color: 'bg-yellow-400 text-black' }
    return null
  }

  const timeIndicator = getTimeIndicator()

  // Force string comparison for consistent behavior
  const isAnyOrganizer = user?.role === 'organizer';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAnyOrganizer || deleting) return
    const confirmed = window.confirm('Delete this event? This cannot be undone.')
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteEvent({ eventId: event._id, userId: user!.userId })
      onDeleted?.(event._id)
    } catch (err) {
      console.error('Failed to delete event:', err)
      alert('Failed to delete event')
    } finally {
      setDeleting(false)
    }
  }

  // Get category color class (lighter version for modern look)
  const getCategoryBgClass = (category: string) => {
    const colors: Record<string, string> = {
      Workshop: 'bg-yellow-400',
      Seminar: 'bg-blue-400',
      Sports: 'bg-green-400',
      Cultural: 'bg-pink-400',
      Technical: 'bg-purple-400',
      Social: 'bg-orange-400',
    }
    return colors[category] || 'bg-gray-400'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group h-full flex flex-col"
    >
      {/* Category Strip - Thinner */}
      <div className={`${getCategoryBgClass(event.category)} px-4 py-1.5 flex items-center justify-between`}>
        <span className="font-bold text-xs uppercase tracking-wide">{event.category}</span>

        {/* Badges */}
        <div className="flex gap-1">
          {isNew && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              🆕 New
            </span>
          )}
          {isAlmostFull && !isFull && (
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              ALMOST FULL
            </span>
          )}
          {isFull && (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              Full
            </span>
          )}
          {timeIndicator && (
            <span className={`${timeIndicator.color} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
              {timeIndicator.text}
            </span>
          )}
        </div>
      </div>

      {/* Organizer Action Buttons */}
      {isAnyOrganizer && (
        <div className="absolute top-10 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Export CSV Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              import('../lib/utils').then(({ exportToCSV }) => {
                const data = registrations?.map(r => ({ ...r, eventName: event.title })) || [];
                exportToCSV(data, `${event.title}_registrations`);
              });
            }}
            disabled={!registrations || registrations.length === 0}
            className="bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-lg inline-flex items-center gap-1 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Participants to CSV"
          >
            <Users className="w-3 h-3" />
            CSV
          </motion.button>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg inline-flex items-center gap-1 hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Delete Event"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col relative">
        {/* Title - Larger */}
        <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        {/* Description - 2 lines max */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>

        {/* Event Details - Muted icons */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-700">
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 font-medium">
              <Users className="w-3 h-3 inline mr-1" />
              {participantCount} / {event.maxParticipants} seats filled
            </span>
            <span className={`font-bold ${capacityPercentage >= 80 ? 'text-red-600' : capacityPercentage >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
              {Math.round(capacityPercentage)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${getCapacityColor()} rounded-full`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/event/${event._id}`)
            }}
            disabled={isFull}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isFull
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 shadow-sm hover:shadow-md'
              }`}
          >
            {isFull ? 'Full' : 'Register'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/event/${event._id}`)}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            View Details →
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
