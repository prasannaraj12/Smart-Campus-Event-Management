import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Trash2 } from 'lucide-react'
import { getCategoryColor, getDaysUntilEvent } from '../lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'

interface Event {
  _id: Id<"events">
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

  const isOwnerOrganizer = user?.role === 'organizer' && user.userId === event.organizerId

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOwnerOrganizer || deleting) return
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="neo-brutal bg-white overflow-hidden cursor-pointer group relative h-full flex flex-col hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      onClick={() => navigate(`/event/${event._id}`)}
    >
      {/* Category Badge */}
      <div className={`${getCategoryColor(event.category)} px-4 py-2 font-black text-sm`}>
        {event.category}
      </div>

      {/* Days Until Badge */}
      {daysUntil >= 0 && daysUntil <= 7 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute top-4 ${
            isOwnerOrganizer ? 'right-24' : 'right-4'
          } neo-brutal-sm bg-red-400 px-3 py-1 font-black text-xs z-10`}
        >
          {daysUntil === 0 ? 'TODAY!' : `${daysUntil} DAYS LEFT`}
        </motion.div>
      )}

      {/* Delete Button (Organizer Owner Only) */}
      {isOwnerOrganizer && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-4 right-4 z-20 neo-brutal-sm bg-red-400 px-2 py-1 text-xs font-bold inline-flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </motion.button>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-black mb-3 line-clamp-2">{event.title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-2 flex-1">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="w-4 h-4" />
            <span>{participantCount} / {event.maxParticipants} registered</span>
          </div>
        </div>

        {/* View Details Overlay (no pointer events so buttons stay clickable) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
        >
          <span className="text-white text-2xl font-black">View Details</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
