import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, User, FileText, Mail, Phone, Copy, Check, Ticket } from 'lucide-react'
import { getCategoryColor, formatDate } from '../../lib/utils'
import { Id } from '../../../convex/_generated/dataModel'
import { useState } from 'react'
import ShareButtons from '../ShareButtons'

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
  organizerName?: string
  organizerEmail?: string
  organizerPhone?: string
  organizerRole?: string
  showContactInfo?: boolean
}

interface Props {
  event: Event
  organizer: any
  participantCount: number
  isOrganizer?: boolean
  isRegistered?: boolean
  onRegisterClick?: () => void
}

export default function EventInfo({ event, organizer, participantCount, isOrganizer, isRegistered, onRegisterClick }: Props) {
  const capacityPercent = (participantCount / event.maxParticipants) * 100
  const [copied, setCopied] = useState<string | null>(null)
  const isFilling = capacityPercent >= 70
  const isFull = participantCount >= event.maxParticipants

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const hasContactInfo = event.showContactInfo !== false && (event.organizerName || event.organizerEmail || event.organizerPhone)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-md p-8"
    >
      {/* Category Badge */}
      <div className={`${getCategoryColor(event.category)} px-4 py-1.5 text-sm font-bold rounded-full inline-block mb-4`}>
        {event.category}
      </div>

      {/* Title Row with Secondary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-black text-gray-900">{event.title}</h1>

        {/* Secondary Register CTA - Hidden on mobile (shown in bottom bar) */}
        {!isOrganizer && onRegisterClick && (
          <div className="hidden sm:block flex-shrink-0">
            {isRegistered ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 font-semibold rounded-xl">
                <Check className="w-5 h-5" />
                Registered
              </div>
            ) : isFull ? (
              <div className="px-4 py-2.5 bg-gray-100 text-gray-500 font-semibold rounded-xl">
                Event Full
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegisterClick}
                className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all ${isFilling ? 'animate-pulse' : ''}`}
              >
                <Ticket className="w-5 h-5" />
                Register
                {isFilling && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {event.maxParticipants - participantCount} left
                  </span>
                )}
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Event Details Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-semibold text-gray-900">{event.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-semibold text-gray-900">{event.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Capacity</p>
            <p className="font-semibold text-gray-900">{participantCount} / {event.maxParticipants}</p>
          </div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Registration progress</span>
          <span className="font-semibold">{Math.round(capacityPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all rounded-full ${capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Organizer Contact Info */}
      {hasContactInfo && (
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact Organizer
          </h3>
          <div className="space-y-2">
            {event.organizerName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-800">{event.organizerName}</span>
                {event.organizerRole && (
                  <span className="text-gray-500">• {event.organizerRole}</span>
                )}
              </div>
            )}
            {event.organizerEmail && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${event.organizerEmail}`} className="text-indigo-600 hover:underline">
                    {event.organizerEmail}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(event.organizerEmail!, 'email')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
            {event.organizerPhone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a href={`tel:${event.organizerPhone}`} className="text-indigo-600 hover:underline">
                    {event.organizerPhone}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(event.organizerPhone!, 'phone')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copied === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback organizer info from user record */}
      {!hasContactInfo && organizer && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Organized by</p>
            <p className="font-semibold text-gray-900">{organizer.email || 'Campus Organizer'}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">About This Event</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
      </div>

      {/* Requirements */}
      {event.requirements && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Requirements</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{event.requirements}</p>
            </div>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <ShareButtons
          title={event.title}
          description={`Join me at ${event.title} on ${formatDate(event.date)}!`}
        />
      </div>
    </motion.div>
  )
}
