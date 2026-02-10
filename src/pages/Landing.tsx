import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, QrCode, TrendingUp, MapPin, Clock, Search, ChevronDown, Megaphone, AlertCircle, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getCategoryColor, getDaysUntilEvent } from '../lib/utils'
import { useAuth } from '../hooks/use-auth'
import SettingsMenu from '../components/SettingsMenu'

const CATEGORIES = ['All', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Technical', 'Social']
const DATE_FILTERS = ['All', 'Today', 'This Week', 'This Month']

export default function Landing() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const events = useQuery(api.events.getAllEvents)
  const createAnonymousUser = useMutation(api.users.createAnonymousUser)
  const announcements = useQuery(api.announcements.getGeneralAnnouncements)
  const [loadingParticipant, setLoadingParticipant] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [showMoreEvents, setShowMoreEvents] = useState(false)

  // Get upcoming events sorted by date with filtering
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return []
    const now = new Date()

    let filtered = events
      .map((e: any) => {
        const dateTime = new Date(`${e.date}T${e.time || '00:00'}`)
        return { ...e, dateTime }
      })
      .filter((e: any) => !isNaN(e.dateTime.getTime()) && e.dateTime >= now)

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((e: any) =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((e: any) => e.category === categoryFilter)
    }

    // Apply date filter
    if (dateFilter !== 'All') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dateFilter === 'Today') {
        filtered = filtered.filter((e: any) => {
          const eventDate = new Date(e.date)
          eventDate.setHours(0, 0, 0, 0)
          return eventDate.getTime() === today.getTime()
        })
      } else if (dateFilter === 'This Week') {
        const weekEnd = new Date(today)
        weekEnd.setDate(weekEnd.getDate() + 7)
        filtered = filtered.filter((e: any) => {
          const eventDate = new Date(e.date)
          return eventDate >= today && eventDate <= weekEnd
        })
      } else if (dateFilter === 'This Month') {
        const monthEnd = new Date(today)
        monthEnd.setMonth(monthEnd.getMonth() + 1)
        filtered = filtered.filter((e: any) => {
          const eventDate = new Date(e.date)
          return eventDate >= today && eventDate <= monthEnd
        })
      }
    }

    filtered.sort((a: any, b: any) => a.dateTime.getTime() - b.dateTime.getTime())
    return filtered
  }, [events, searchQuery, categoryFilter, dateFilter])

  // Limit displayed events
  const displayedEvents = showMoreEvents ? filteredEvents : filteredEvents.slice(0, 6)

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get event badges
  const getEventBadges = (event: any) => {
    const badges = []
    const daysUntil = getDaysUntilEvent(event.date)
    const createdDaysAgo = Math.floor((Date.now() - event._creationTime) / (1000 * 60 * 60 * 24))

    if (daysUntil === 0) {
      badges.push({ text: 'Today', color: 'bg-red-500 text-white' })
    }
    if (createdDaysAgo <= 3) {
      badges.push({ text: 'New', color: 'bg-blue-500 text-white' })
    }
    // Note: capacity check would need registration count - showing placeholder
    return badges
  }

  // Get capacity percentage (placeholder - would need actual registration count)
  const getCapacityInfo = (event: any) => {
    // Simulated registration count - in real app, fetch from backend
    const registered = Math.floor(Math.random() * event.maxParticipants * 0.9)
    const percentage = (registered / event.maxParticipants) * 100
    let color = 'bg-green-500'
    if (percentage >= 80) color = 'bg-red-500'
    else if (percentage >= 50) color = 'bg-yellow-500'

    return { registered, max: event.maxParticipants, percentage, color }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        {/* Settings Button - Top Right */}
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="neo-brutal bg-white dark:bg-gray-800 p-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            title="Settings"
          >
            <Settings className="w-6 h-6 dark:text-white" />
          </motion.button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          {/* Animated CampusConnect Title with Gradient */}
          <div className="text-6xl md:text-7xl font-black mb-4 overflow-hidden">
            {'CampusConnect'.split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.6, 0.01, 0.05, 0.95]
                }}
                whileHover={{
                  scale: 1.2,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="inline-block cursor-pointer"
                style={{ 
                  transformOrigin: 'center',
                  display: 'inline-block',
                  marginRight: letter === ' ' ? '0.5rem' : '0',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'gradient-shift 3s ease infinite',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-xl font-bold text-gray-700 mb-2"
          >
            Smart Campus Event Management
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-600 mb-8"
          >
            Create, manage, and attend campus events effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              disabled={loadingParticipant}
              onClick={async () => {
                setLoadingParticipant(true)
                try {
                  const userId = await createAnonymousUser({ name: 'Anonymous' })
                  login({ userId, role: 'participant', name: 'Anonymous' })
                  navigate('/dashboard')
                } catch (err) {
                  console.error('Error:', err)
                } finally {
                  setLoadingParticipant(false)
                }
              }}
              className="neo-brutal bg-yellow-400 px-8 py-3 text-lg font-bold transition-all disabled:opacity-50"
            >
              {loadingParticipant ? 'Loading...' : 'Explore Events'}
            </motion.button>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => navigate('/auth?role=organizer')}
              className="neo-brutal bg-white px-8 py-3 text-lg font-bold border-2 border-black transition-all"
            >
              Login as Organizer
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-6xl mx-auto"
        >
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium w-full pl-12 pr-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none font-semibold"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none font-bold bg-white cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'Category' : cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none font-bold bg-white cursor-pointer"
              >
                {DATE_FILTERS.map(filter => (
                  <option key={filter} value={filter}>{filter === 'All' ? 'Date' : filter}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-black mb-6 text-center">Upcoming Events</h2>

          {displayedEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEvents.map((event: any, index: number) => {
                  const badges = getEventBadges(event)
                  const capacity = getCapacityInfo(event)
                  const daysUntil = getDaysUntilEvent(event.date)

                  return (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                      whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(0,0,0,0.12)" }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
                    >
                      {/* Category Header - Thinner */}
                      <div className={`${getCategoryColor(event.category)} px-4 py-1.5 font-bold text-xs uppercase tracking-wide flex items-center justify-between`}>
                        <span>{event.category}</span>
                        {/* Badges */}
                        <div className="flex gap-1">
                          {badges.map((badge, i) => (
                            <span
                              key={i}
                              className={`${badge.color} px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.text === 'NEW' ? 'animate-pulse-subtle' : ''}`}
                            >
                              {badge.text}
                            </span>
                          ))}
                          {capacity.percentage >= 80 && (
                            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ALMOST FULL
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-2xl font-black mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Event Details - Muted icons */}
                        <div className="space-y-1.5 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{formatDate(event.date)}</span>
                            {daysUntil <= 3 && daysUntil >= 0 && (
                              <span className="text-xs text-red-500 font-bold">
                                {daysUntil === 0 ? 'Today!' : `${daysUntil}d left`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-600">
                              <Users className="w-3 h-3 inline mr-1" />
                              {capacity.registered} / {capacity.max} seats filled
                            </span>
                            <span className="font-bold text-gray-500">{Math.round(capacity.percentage)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${capacity.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: "easeOut" }}
                              className={`h-full ${capacity.color} rounded-full`}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async (e) => {
                              e.stopPropagation()
                              // Create anonymous participant and go to event page
                              setLoadingParticipant(true)
                              try {
                                const userId = await createAnonymousUser({ name: 'Anonymous' })
                                login({ userId, role: 'participant', name: 'Anonymous' })
                                navigate(`/event/${event._id}`)
                              } catch (err) {
                                console.error('Error:', err)
                              } finally {
                                setLoadingParticipant(false)
                              }
                            }}
                            disabled={loadingParticipant}
                            className="w-full bg-yellow-400 py-3 rounded-lg font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                          >
                            Register Now →
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Show More Button */}
              {filteredEvents.length > 6 && !showMoreEvents && (
                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMoreEvents(true)}
                    className="neo-brutal bg-white px-8 py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    Show More Events ↓
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200"
            >
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-black mb-2 text-gray-700">No Upcoming Events</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || categoryFilter !== 'All' || dateFilter !== 'All'
                  ? "No events match your filters. Try adjusting your search."
                  : "Check back soon or create one!"}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('All')
                  setDateFilter('All')
                }}
                className="neo-brutal bg-yellow-400 px-6 py-2 font-bold text-sm"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {[
            { icon: Calendar, title: 'Event Management', desc: 'Create and organize campus events effortlessly', color: 'bg-blue-100' },
            { icon: Users, title: 'Easy Registration', desc: 'Quick sign-up for event participation', color: 'bg-green-100' },
            { icon: QrCode, title: 'QR Tickets', desc: 'Digital tickets with QR codes for check-in', color: 'bg-purple-100' },
            { icon: TrendingUp, title: 'Track Attendance', desc: 'Real-time tracking and analytics', color: 'bg-orange-100' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Announcements Section */}
        {announcements && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-black mb-4 text-center">Announcements</h2>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement: any, index: number) => {
                const isImportant = announcement.priority === 'important'
                return (
                  <motion.div
                    key={announcement._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-4 border-2 ${isImportant
                      ? 'bg-red-50 border-red-300'
                      : 'bg-yellow-50 border-yellow-300'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isImportant ? 'bg-red-200' : 'bg-yellow-200'}`}>
                        {isImportant ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Megaphone className="w-5 h-5 text-yellow-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                          {isImportant && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                              IMPORTANT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{announcement.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-black mb-3">CampusConnect</h3>
              <p className="text-gray-400 text-sm">
                Smart Campus Event Management Platform
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => navigate('/role-selection')} className="hover:text-white transition-colors">
                    Browse Events
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth?role=organizer')} className="hover:text-white transition-colors">
                    Organizer Login
                  </button>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold mb-3">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">About CampusConnect</span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">How it Works</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:support@campusconnect.com" className="hover:text-white transition-colors">
                    support@campusconnect.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2026 CampusConnect. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Settings Menu */}
      {showSettings && (
        <SettingsMenu onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
