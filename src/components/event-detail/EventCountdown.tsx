import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  date: string
  time: string
}

export default function EventCountdown({ date, time }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = new Date(`${date}T${time}`)
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
  }, [date, time])

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
      className="neo-brutal-lg bg-gradient-to-r from-purple-400 to-pink-400 p-8"
    >
      <h2 className="text-3xl font-black text-center mb-6">Event Countdown</h2>
      <div className="grid grid-cols-4 gap-4">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="neo-brutal bg-white p-6 text-center">
            <motion.div
              key={unit.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black mb-2"
            >
              {unit.value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-sm font-bold">{unit.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
