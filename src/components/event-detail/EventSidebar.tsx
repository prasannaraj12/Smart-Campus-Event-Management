import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '../../hooks/use-auth'
import { Id } from '../../../convex/_generated/dataModel'
import QRCode from 'react-qr-code'
import { UserPlus, X, Check, Download } from 'lucide-react'
import EventRegistrationDialog from '../EventRegistrationDialog'

interface Props {
  event: any
  isOrganizer: boolean
  myRegistration: any
  registrations: any[]
  participantCount: number
}

export default function EventSidebar({ event, isOrganizer, myRegistration, registrations, participantCount }: Props) {
  const { user } = useAuth()
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRegistration = useMutation(api.registrations.cancelRegistration)
  const markAttendance = useMutation(api.registrations.markAttendance)

  const handleCancelRegistration = async () => {
    if (!user?.userId || !confirm('Are you sure you want to cancel your registration?')) return

    setLoading(true)
    try {
      await cancelRegistration({
        eventId: event._id,
        userId: user.userId,
      })
    } catch (err) {
      console.error('Failed to cancel registration:', err)
      alert('Failed to cancel registration')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAttendance = async (registrationId: Id<"registrations">, currentStatus: boolean) => {
    setLoading(true)
    try {
      await markAttendance({
        registrationId,
        attended: !currentStatus,
      })
    } catch (err) {
      console.error('Failed to mark attendance:', err)
      alert('Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `ticket-${event._id}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="space-y-6">
      {/* Registration Status / Actions */}
      {!isOrganizer && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neo-brutal-lg bg-white p-6"
        >
          {myRegistration ? (
            <>
              <div className="neo-brutal bg-green-400 p-4 mb-6 text-center">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-black text-lg">You're Registered!</p>
              </div>

              {/* QR Code Ticket */}
              <div className="neo-brutal bg-white p-4 mb-6">
                <h3 className="font-black text-center mb-4">Your Ticket</h3>
                <div className="bg-white p-4">
                  <QRCode
                    id="qr-code"
                    value={JSON.stringify({
                      registrationId: myRegistration._id,
                      eventId: event._id,
                      participantName: myRegistration.participantName,
                    })}
                    size={200}
                    className="mx-auto"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadQR}
                  className="neo-brutal-sm bg-blue-400 w-full mt-4 py-2 font-bold inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Ticket
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelRegistration}
                disabled={loading}
                className="neo-brutal bg-red-400 w-full py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
              >
                Cancel Registration
              </motion.button>
            </>
          ) : participantCount >= event.maxParticipants ? (
            <div className="neo-brutal bg-red-400 p-6 text-center">
              <X className="w-12 h-12 mx-auto mb-2" />
              <p className="font-black text-lg">Event Full</p>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRegistrationDialog(true)}
              className="neo-brutal-lg bg-green-400 w-full py-4 font-black text-xl inline-flex items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <UserPlus className="w-6 h-6" />
              Register Now
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Organizer View - Participants List */}
      {isOrganizer && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neo-brutal-lg bg-white p-6"
        >
          <h3 className="text-2xl font-black mb-6">
            Participants ({participantCount})
          </h3>

          {registrations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No registrations yet</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {registrations.map((reg) => (
                <div key={reg._id} className="neo-brutal bg-gray-50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{reg.participantName}</p>
                      <p className="text-sm text-gray-600">{reg.participantEmail}</p>
                      <p className="text-sm text-gray-600">{reg.college} - Year {reg.year}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleAttendance(reg._id, reg.attended)}
                      disabled={loading}
                      className={`neo-brutal-sm p-2 ${
                        reg.attended ? 'bg-green-400' : 'bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                  {reg.teamName && (
                    <div className="mt-2 pt-2 border-t-2 border-black">
                      <p className="text-sm font-bold">Team: {reg.teamName}</p>
                      {reg.teamMembers?.map((member: any, i: number) => (
                        <p key={i} className="text-xs text-gray-600">
                          {member.name} ({member.email})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Registration Dialog */}
      {showRegistrationDialog && user?.userId && (
        <EventRegistrationDialog
          event={event}
          userId={user.userId}
          onClose={() => setShowRegistrationDialog(false)}
        />
      )}
    </div>
  )
}
