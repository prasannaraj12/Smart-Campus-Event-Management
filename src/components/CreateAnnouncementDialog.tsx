import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { X, Megaphone } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'

interface Props {
  organizerId: Id<"users">
  onClose: () => void
}

/* const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'All'] */

export default function CreateAnnouncementDialog({ organizerId, onClose }: Props) {
  const createAnnouncement = useMutation(api.announcements.createAnnouncement)
  const myEvents = useQuery(api.events.getEventsByOrganizer, { organizerId })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    // department: 'All', 
    eventId: '' as string,
    priority: 'normal' as 'normal' | 'important',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createAnnouncement({
        title: formData.title,
        message: formData.message,
        // department: formData.department,
        eventId: formData.eventId ? (formData.eventId as Id<"events">) : undefined,
        priority: formData.priority,
        organizerId,
      })

      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create announcement')
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
            <div className="flex items-center gap-3">
              <div className="neo-brutal bg-yellow-400 p-3">
                <Megaphone className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black">Create Announcement</h2>
            </div>
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
              <label className="block font-bold mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Important Update"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Message *</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Enter your announcement message..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Department Removed */}

              <div>
                <label className="block font-bold mb-2">Priority *</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Link to Event (Optional)</label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">General Announcement (No Event)</option>
                {myEvents?.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <p className="text-sm font-semibold mt-2 text-gray-600">
                {formData.eventId
                  ? 'Event-specific: Will show on event detail page'
                  : 'General: Will show on landing page'}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="neo-brutal bg-green-400 w-full py-4 font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
