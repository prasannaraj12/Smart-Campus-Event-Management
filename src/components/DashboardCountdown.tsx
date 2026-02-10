import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { getCategoryColor } from '../lib/utils'

interface Props {
  event: any
}

export default function DashboardCountdown({ event }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = new Date(`${event.date}T${event.time}`)
      const now = new Date()
      const difference = eventDateTime.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [event.date, event.time])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-brutal-lg bg-white p-8 mb-8"
    >
      {/* Header Section */}
      <div className="mb-6">
        <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
          NEXT UPCOMING EVENT
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-4xl md:text-5xl font-black uppercase">{event.title}</h2>
          <div className={`${getCategoryColor(event.category)} px-4 py-2 font-black text-sm`}>
            {event.category}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span className="font-bold">{new Date(event.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-bold">{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span className="font-bold">{event.location}</span>
        </div>
      </div>

      {/* Countdown Section with Gradient Background */}
      <div className="neo-brutal-lg bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 p-8">
        <h3 className="text-3xl font-black text-center mb-8">Event Countdown</h3>
        
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="neo-brutal-lg bg-white p-6 md:p-8 text-center"
            >
              <motion.div
                key={unit.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-2"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-sm md:text-base font-bold uppercase tracking-wide">
                {unit.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
