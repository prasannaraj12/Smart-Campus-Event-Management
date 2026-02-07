import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'
import RegistrationForm from './RegistrationForm'

interface Props {
  event: any
  userId: Id<"users">
  onClose: () => void
}

export default function EventRegistrationDialog({ event, userId, onClose }: Props) {
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
            <h2 className="text-3xl font-black">Register for Event</h2>
            <button
              onClick={onClose}
              className="neo-brutal-sm bg-red-400 p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <RegistrationForm
            event={event}
            userId={userId}
            onSuccess={onClose}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
