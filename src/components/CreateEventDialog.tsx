import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { X } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'
import { useNavigate } from 'react-router-dom'

interface Props {
  organizerId: Id<"users">
  onClose: () => void
}

const categories = ['Workshop', 'Seminar', 'Sports', 'Cultural', 'Technical', 'Social']

export default function CreateEventDialog({ organizerId, onClose }: Props) {
  const navigate = useNavigate()
  const createEvent = useMutation(api.events.createEvent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Workshop' as any,
    maxParticipants: 50,
    isTeamEvent: false,
    teamSize: undefined as number | undefined,
    requirements: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate date is not in the past
    const eventDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (eventDate < today) {
      setError('Event date cannot be in the past')
      setLoading(false)
      return
    }

    try {
      const eventId = await createEvent({
        ...formData,
        organizerId,
        isTeamEvent: formData.isTeamEvent,
        teamSize: formData.isTeamEvent ? formData.teamSize || undefined : undefined,
        requirements: formData.requirements || undefined,
      })

      onClose()
      navigate(`/event/${eventId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="neo-brutal-lg bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black">Create New Event</h2>
            <button
              onClick={onClose}
              className="neo-brutal-sm bg-red-400 p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="neo-brutal bg-red-100 p-4 mb-6">
              <p className="font-bold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold mb-2">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Amazing Workshop"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Describe your event..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Main Auditorium"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">Max Participants *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Team event toggle */}
            <div className="neo-brutal bg-yellow-100 p-4 flex items-start gap-3">
              <input
                id="team-event"
                type="checkbox"
                checked={formData.isTeamEvent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isTeamEvent: e.target.checked,
                    // Clear teamSize when turning off team events
                    teamSize: e.target.checked ? formData.teamSize : undefined,
                  })
                }
                className="mt-1 w-5 h-5 accent-black"
              />
              <div>
                <label htmlFor="team-event" className="font-black cursor-pointer">
                  This is a team event
                </label>
                <p className="text-sm font-semibold">
                  When enabled, participants register as a team. Leave unchecked for individual-only events
                  like most workshops.
                </p>
              </div>
            </div>

            {formData.isTeamEvent && (
              <div>
                <label className="block font-bold mb-2">Team Size * (at least 2)</label>
                <input
                  type="number"
                  min="2"
                  required={formData.isTeamEvent}
                  value={formData.teamSize || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamSize: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter required team size (e.g. 4)"
                />
              </div>
            )}

            <div>
              <label className="block font-bold mb-2">
                {formData.category === 'Workshop' || formData.category === 'Technical'
                  ? 'Requirements * (Workshop/Technical)'
                  : 'Requirements (Optional)'}
              </label>
              <textarea
                required={formData.category === 'Workshop' || formData.category === 'Technical'}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder={
                  formData.category === 'Workshop'
                    ? 'Prerequisites / what participants should know or bring...'
                    : formData.category === 'Technical'
                    ? 'Tech stack, skills, or portfolio requirements...'
                    : 'Any prerequisites or requirements...'
                }
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="neo-brutal bg-green-400 w-full py-4 font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
