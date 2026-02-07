import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, User, FileText } from 'lucide-react'
import { getCategoryColor, formatDate } from '../../lib/utils'
import { Id } from '../../../convex/_generated/dataModel'

interface Event {
  _id: Id<"events">
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxParticipants: number
  teamSize?: number
  requirements?: string
}

interface Props {
  event: Event
  organizer: any
  participantCount: number
}

export default function EventInfo({ event, organizer, participantCount }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="neo-brutal-lg bg-white p-8"
    >
      <div className={`${getCategoryColor(event.category)} px-4 py-2 font-black inline-block mb-6`}>
        {event.category}
      </div>

      <h1 className="text-5xl font-black mb-6">{event.title}</h1>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <Calendar className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold">Date</p>
            <p className="text-lg">{formatDate(event.date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold">Time</p>
            <p className="text-lg">{event.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold">Location</p>
            <p className="text-lg">{event.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold">Participants</p>
            <p className="text-lg">{participantCount} / {event.maxParticipants} registered</p>
          </div>
        </div>

        {organizer && (
          <div className="flex items-start gap-3">
            <User className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold">Organizer</p>
              <p className="text-lg">{organizer.email || 'Campus Organizer'}</p>
            </div>
          </div>
        )}

        {event.teamSize && (
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold">Team Size</p>
              <p className="text-lg">{event.teamSize} members per team</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t-4 border-black pt-6 mb-6">
        <h2 className="text-2xl font-black mb-4">About This Event</h2>
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
      </div>

      {event.requirements && (
        <div className="neo-brutal bg-yellow-100 p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black mb-2">Requirements</h3>
              <p className="leading-relaxed whitespace-pre-wrap">{event.requirements}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
