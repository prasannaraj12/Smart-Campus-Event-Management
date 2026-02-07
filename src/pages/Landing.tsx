import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, QrCode, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import EventCountdown from '../components/event-detail/EventCountdown'

export default function Landing() {
  const navigate = useNavigate()
  const events = useQuery(api.events.getAllEvents)

  const upcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null
    const now = new Date()

    const withDateTime = events
      .map((e: any) => {
        const dateTime = new Date(`${e.date}T${e.time || '00:00'}`)
        return { ...e, dateTime }
      })
      .filter((e: any) => !isNaN(e.dateTime.getTime()) && e.dateTime >= now)

    if (withDateTime.length === 0) return null

    withDateTime.sort(
      (a: any, b: any) => a.dateTime.getTime() - b.dateTime.getTime()
    )
    return withDateTime[0]
  }, [events])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-black mb-6 text-black">
            CampusConnect
          </h1>
          <p className="text-2xl font-bold text-black mb-8">
            Smart Campus Event Management
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/role-selection')}
            className="neo-brutal-lg bg-yellow-400 px-12 py-4 text-2xl font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Next Upcoming Event Countdown */}
        {upcomingEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neo-brutal-lg bg-white p-6 mb-16 max-w-3xl mx-auto"
          >
            <p className="text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide">
              Next Upcoming Event
            </p>
            <h2 className="text-2xl font-black mb-4">{upcomingEvent.title}</h2>
            <EventCountdown date={upcomingEvent.date} time={upcomingEvent.time} />
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Calendar, title: 'Event Management', desc: 'Create and organize campus events effortlessly' },
            { icon: Users, title: 'Easy Registration', desc: 'Anonymous sign-up for quick event participation' },
            { icon: QrCode, title: 'QR Tickets', desc: 'Digital tickets with QR codes for seamless check-in' },
            { icon: TrendingUp, title: 'Track Attendance', desc: 'Real-time attendance tracking and analytics' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="neo-brutal bg-white p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <feature.icon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
