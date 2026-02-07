import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'
import { Id } from '../../convex/_generated/dataModel'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import EventInfo from '../components/event-detail/EventInfo'
import EventSidebar from '../components/event-detail/EventSidebar'
import EventCountdown from '../components/event-detail/EventCountdown'

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const event = useQuery(
    api.events.getEventById,
    eventId ? { eventId: eventId as Id<"events"> } : 'skip'
  )

  const registrations = useQuery(
    api.registrations.getEventRegistrations,
    eventId ? { eventId: eventId as Id<"events"> } : 'skip'
  )

  const myRegistration = useQuery(
    api.registrations.isRegistered,
    eventId && user?.userId ? { 
      eventId: eventId as Id<"events">,
      userId: user.userId 
    } : 'skip'
  )

  const organizer = useQuery(
    api.users.getUser,
    event ? { userId: event.organizerId } : 'skip'
  )

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="neo-brutal-lg bg-white p-12">
          <p className="text-2xl font-bold">Loading event...</p>
        </div>
      </div>
    )
  }

  const isOrganizer = user?.userId === event.organizerId
  const participantCount = registrations?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="neo-brutal bg-white px-6 py-3 font-bold mb-8 inline-flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        <EventCountdown date={event.date} time={event.time} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <EventInfo 
              event={event} 
              organizer={organizer}
              participantCount={participantCount}
            />
          </div>

          <div>
            <EventSidebar
              event={event}
              isOrganizer={isOrganizer}
              myRegistration={myRegistration}
              registrations={registrations || []}
              participantCount={participantCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
