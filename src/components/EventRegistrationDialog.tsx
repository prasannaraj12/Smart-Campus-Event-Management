import { useState, useCallback } from 'react'
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
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDirtyChange = useCallback((isDirty: boolean) => {
    setIsFormDirty(isDirty)
  }, [])

  const handleCloseAttempt = () => {
    if (isFormDirty) {
      setShowConfirmation(true)
    } else {
      onClose()
    }
  }

  const confirmClose = () => {
    setShowConfirmation(false)
    onClose()
  }

  const cancelClose = () => {
    setShowConfirmation(false)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="neo-brutal-lg bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="neo-brutal bg-white p-6 max-w-sm mx-4"
              >
                <h3 className="text-xl font-black mb-3">Unsaved Changes</h3>
                <p className="text-gray-600 mb-6">
                  You have unsaved changes. Are you sure you want to exit?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelClose}
                    className="neo-brutal bg-gray-200 flex-1 py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    Stay
                  </button>
                  <button
                    onClick={confirmClose}
                    className="neo-brutal bg-red-400 flex-1 py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    Exit
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black">Register for Event</h2>
            <button
              onClick={handleCloseAttempt}
              className="neo-brutal-sm bg-red-400 p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group relative"
              title="Close"
            >
              <X className="w-6 h-6" />
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Close
              </span>
            </button>
          </div>

          <RegistrationForm
            event={event}
            userId={userId}
            onSuccess={onClose}
            onCancel={handleCloseAttempt}
            onDirtyChange={handleDirtyChange}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
