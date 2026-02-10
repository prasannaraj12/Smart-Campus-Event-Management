import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '../../hooks/use-auth'
import { Id } from '../../../convex/_generated/dataModel'
import QRCode from 'react-qr-code'
import { UserPlus, Check, Download, FileDown, Users, CheckCircle, XCircle } from 'lucide-react'
import EventRegistrationDialog from '../EventRegistrationDialog'

interface Props {
  event: any
  isOrganizer: boolean
  myRegistration: any
  registrations: any[]
  participantCount: number
  showRegistrationDialog?: boolean
  setShowRegistrationDialog?: (show: boolean) => void
}

export default function EventSidebar({ event, isOrganizer, myRegistration, registrations, participantCount, showRegistrationDialog: externalShowDialog, setShowRegistrationDialog: externalSetShowDialog }: Props) {
  const { user } = useAuth()
  const [internalShowDialog, setInternalShowDialog] = useState(false)

  // Use external state if provided, otherwise use internal state
  const showRegistrationDialog = externalShowDialog !== undefined ? externalShowDialog : internalShowDialog
  const setShowRegistrationDialog = externalSetShowDialog || setInternalShowDialog

  const [loading, setLoading] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const cancelRegistration = useMutation(api.registrations.cancelRegistration)
  const markAttendance = useMutation(api.registrations.markAttendance)

  // Fetch attendance for this event
  const attendance = useQuery(
    api.registrations.getEventAttendance,
    { eventId: event._id }
  )

  // Get attendance for my registration
  const myAttendance = useQuery(
    api.registrations.getAttendance,
    myRegistration ? { registrationId: myRegistration._id } : "skip"
  )

  // Create attendance map for quick lookup
  const attendanceMap = new Map()
  attendance?.forEach((att: any) => {
    attendanceMap.set(att.registrationId, att)
  })

  const presentCount = attendance?.length || 0
  const absentCount = registrations.length - presentCount

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

  const handleMarkAttendance = async (registrationId: string) => {
    if (!user?.userId) return
    try {
      await markAttendance({
        registrationId: registrationId as Id<"registrations">,
        organizerId: user.userId as Id<"users">
      })
    } catch (err) {
      console.error('Failed to mark attendance:', err)
    }
  }

  const handleMarkAllPresent = async () => {
    setMarkingAll(true)
    try {
      for (const reg of registrations) {
        if (!attendanceMap.has(reg._id) && user?.userId) {
          await markAttendance({
            registrationId: reg._id,
            organizerId: user.userId as Id<"users">
          })
        }
      }
    } catch (err) {
      console.error('Failed to mark all:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const downloadQR = (registrationId: string) => {
    window.open(`/ticket/${registrationId}`, '_blank')
  }

  const handleExportCSV = () => {
    import('../../lib/utils').then(({ exportToCSV }) => {
      const data = registrations.map(r => ({
        ...r,
        eventName: event.title,
        attendance: attendanceMap.has(r._id) ? 'Present' : 'Absent',
        markedAt: attendanceMap.get(r._id)?.markedAt || ''
      }))
      exportToCSV(data, `${event.title}_attendance`)
    })
  }

  return (
    <div className="space-y-4">
      {/* Participant Registration View */}
      {!isOrganizer && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          {myRegistration ? (
            <>
              <div className="bg-green-100 rounded-xl p-4 mb-4 text-center">
                <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-bold text-green-800">You're Registered!</p>
              </div>

              {/* QR Code Ticket */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-center mb-3">Your Ticket</h3>
                <div className="bg-blue-50 rounded-lg p-3 mb-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Registration Code</p>
                  <p className="font-black text-2xl text-blue-600">{myRegistration.registrationCode}</p>
                </div>
                <div className="flex justify-center p-3">
                  <QRCode value={myRegistration.registrationCode} size={160} />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Show this code at the event</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadQR(myRegistration._id)}
                  className="bg-blue-500 text-white w-full mt-3 py-2 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  View Ticket
                </motion.button>
              </div>

              {/* Attendance Status */}
              {myAttendance && (
                <div className="bg-green-100 rounded-xl p-3 mb-4 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                  <p className="font-semibold text-green-800 text-sm">Attendance Marked</p>
                  <p className="text-xs text-green-600">{new Date(myAttendance.markedAt).toLocaleString()}</p>
                </div>
              )}

              <button
                onClick={handleCancelRegistration}
                disabled={loading}
                className="text-red-600 w-full py-2 font-semibold text-sm hover:underline disabled:opacity-50"
              >
                Cancel Registration
              </button>
            </>
          ) : participantCount >= event.maxParticipants ? (
            <div className="bg-red-100 rounded-xl p-6 text-center">
              <XCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
              <p className="font-bold text-red-800">Event Full</p>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRegistrationDialog(true)}
              className="bg-green-500 text-white w-full py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Register Now
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Organizer View - Attendance Manager */}
      {isOrganizer && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Attendance Manager</h3>
              <p className="text-sm text-gray-500">{registrations.length} registrations</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-green-600">{presentCount}</p>
              <p className="text-xs text-gray-600">Present</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-red-500">{absentCount}</p>
              <p className="text-xs text-gray-600">Absent</p>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleMarkAllPresent}
              disabled={markingAll || registrations.length === 0}
              className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3" />
              {markingAll ? 'Marking...' : 'Mark All'}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <FileDown className="w-3 h-3" />
              Export
            </button>
          </div>

          {/* Participants List */}
          {registrations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {registrations.map((reg) => {
                const hasAttendance = attendanceMap.has(reg._id)
                const attendanceRecord = attendanceMap.get(reg._id)

                return (
                  <div
                    key={reg._id}
                    className={`p-3 rounded-xl border ${hasAttendance ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{reg.participantName}</p>
                          {reg.isTeamLeader && (
                            <span className="bg-blue-500 text-white px-1.5 py-0.5 text-xs font-bold rounded">
                              LEAD
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{reg.participantEmail}</p>
                        {hasAttendance && (
                          <p className="text-xs text-green-600 mt-1">
                            Marked at {new Date(attendanceRecord.markedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      {/* Attendance Toggle */}
                      <button
                        onClick={() => !hasAttendance && handleMarkAttendance(reg._id)}
                        disabled={hasAttendance}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${hasAttendance
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-gray-200 hover:bg-green-400 hover:text-white'
                          }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
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
