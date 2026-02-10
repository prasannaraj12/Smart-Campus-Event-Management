import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { X, Sparkles } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'
import { useNavigate } from 'react-router-dom'

interface Props {
  organizerId: Id<"users">
  onClose: () => void
}

const categories = ['Workshop', 'Seminar', 'Sports', 'Cultural', 'Technical', 'Social', 'Hackathon']

export default function CreateEventDialog({ organizerId, onClose }: Props) {
  const navigate = useNavigate()
  const createEvent = useMutation(api.events.createEvent)
  const generateDescription = useAction(api.ai.generateDescription)

  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
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

  // Validate dates
  const today = new Date().toISOString().split('T')[0]

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      setError('Please enter a title first to generate a description.')
      return
    }

    setGenerating(true)
    setError('')
    try {
      const description = await generateDescription({
        title: formData.title,
        category: formData.category
      })

      setFormData(prev => ({ ...prev, description }))
    } catch (err: any) {
      console.error(err)
      setError('Failed to generate description. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate date is not in the past
    const eventDate = new Date(formData.date)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    if (eventDate < todayDate) {
      setError('Event date cannot be in the past')
      setLoading(false)
      return
    }

    // Validate team event requirements
    if (formData.isTeamEvent && (!formData.teamSize || formData.teamSize < 2)) {
      setError('Team events must have a team size of at least 2')
      setLoading(false)
      return
    }

    try {
      const eventId = await createEvent({
        ...formData,
        organizerId,
        isTeamEvent: formData.isTeamEvent,
        teamSize: formData.isTeamEvent ? formData.teamSize : undefined,
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
              <div className="flex justify-between items-center mb-2">
                <label className="block font-bold">Description *</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generating || !formData.title}
                  className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {generating ? 'Generating...' : 'Auto-Generate with AI'}
                </button>
              </div>
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
                  min={today}
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
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

            {/* Team Event Toggle */}
            <div className="neo-brutal bg-blue-100 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTeamEvent}
                  onChange={(e) => setFormData({
                    ...formData,
                    isTeamEvent: e.target.checked,
                    teamSize: e.target.checked ? formData.teamSize : undefined
                  })}
                  className="mt-1 w-5 h-5 accent-black"
                />
                <div>
                  <span className="font-black">This is a Team Event</span>
                  <p className="text-sm font-semibold mt-1">
                    Enable this if participants must register as teams. Leave unchecked for individual registration (workshops, seminars, etc.)
                  </p>
                </div>
              </label>
            </div>

            {/* Team Size (only if team event) */}
            {formData.isTeamEvent && (
              <div>
                <label className="block font-bold mb-2">Team Size *</label>
                <input
                  type="number"
                  required={formData.isTeamEvent}
                  min="2"
                  value={formData.teamSize || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    teamSize: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., 4 for a team of 4"
                />
                <p className="text-sm font-semibold mt-2 text-gray-600">
                  Number of participants per team (including the team leader)
                </p>
              </div>
            )}

            <div>
              <label className="block font-bold mb-2">Requirements (Optional)</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Any prerequisites or requirements..."
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
