import { motion } from 'framer-motion'
import { Megaphone, AlertCircle, Trash2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'

interface Props {
  announcement: any
  showDelete?: boolean
  organizerId?: Id<"users">
}

export default function AnnouncementCard({ announcement, showDelete = false, organizerId }: Props) {
  const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!organizerId || !confirm('Delete this announcement?')) return

    setDeleting(true)
    try {
      await deleteAnnouncement({
        announcementId: announcement._id,
        organizerId,
      })
    } catch (err) {
      console.error('Failed to delete:', err)
      alert('Failed to delete announcement')
    } finally {
      setDeleting(false)
    }
  }

  const isImportant = announcement.priority === 'important'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`neo-brutal ${isImportant ? 'bg-red-100 border-red-500' : 'bg-yellow-100'
        } p-6 relative`}
    >
      {/* Delete Button */}
      {showDelete && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-4 right-4 neo-brutal-sm bg-red-400 p-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}

      <div className="flex items-start gap-4">
        <div className={`neo-brutal ${isImportant ? 'bg-red-400' : 'bg-yellow-400'} p-3 flex-shrink-0`}>
          {isImportant ? (
            <AlertCircle className="w-6 h-6" />
          ) : (
            <Megaphone className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-black">{announcement.title}</h3>
            {isImportant && (
              <span className="neo-brutal-sm bg-red-400 px-2 py-1 text-xs font-bold">
                IMPORTANT
              </span>
            )}
          </div>

          <p className="font-semibold text-gray-800 mb-3">{announcement.message}</p>

          <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
            {/* <span>📍 {announcement.department}</span> */}
            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
            {announcement.eventId && (
              <span className="neo-brutal-sm bg-blue-400 px-2 py-1 text-xs">
                Event-Specific
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
