import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'
import EventCard from '../components/EventCard'
import CreateEventDialog from '../components/CreateEventDialog'
import CreateAnnouncementDialog from '../components/CreateAnnouncementDialog'
import AnnouncementCard from '../components/AnnouncementCard'
import QRScanner from '../components/QRScanner'
import RecommendedEvents from '../components/RecommendedEvents'
import { LogOut, Plus, Calendar, Users, TrendingUp, QrCode, Megaphone, ChevronDown, User, Settings, BarChart3, History } from 'lucide-react'

const categories = ['All', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Technical', 'Social', 'Hackathon']

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All'])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const eventsRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const events = useQuery(api.events.getAllEvents)
  const myEvents = useQuery(
    api.events.getEventsByOrganizer,
    user?.role === 'organizer' && user?.userId ? { organizerId: user.userId } : 'skip'
  )
  const myRegistrations = useQuery(
    api.registrations.myRegistrations,
    user?.userId ? { userId: user.userId } : 'skip'
  )
  const myAttendanceCount = useQuery(
    api.registrations.getMyAttendanceCount,
    user?.role === 'participant' && user?.userId ? { userId: user.userId } : 'skip'
  )
  const myAnnouncements = useQuery(
    api.announcements.getOrganizerAnnouncements,
    user?.role === 'organizer' && user?.userId ? { organizerId: user.userId } : 'skip'
  )
  const generalAnnouncements = useQuery(
    api.announcements.getGeneralAnnouncements,
    user?.role === 'participant' ? {} : 'skip'
  )

  useEffect(() => {
    if (!user) {
      navigate('/role-selection')
    }
  }, [user, navigate])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  // Loading state
  if (events === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  // Category filter logic (multi-select)
  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All'])
    } else {
      let newCategories = selectedCategories.filter(c => c !== 'All')
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter(c => c !== category)
        if (newCategories.length === 0) newCategories = ['All']
      } else {
        newCategories.push(category)
      }
      setSelectedCategories(newCategories)
    }
  }

  const filteredEvents = events?.filter((event: any) =>
    selectedCategories.includes('All') || selectedCategories.includes(event.category)
  ) || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Get user's first name for personalization
  const userName = user.name?.split(' ')[0] || (user.role === 'organizer' ? 'Organizer' : 'Participant')

  // Get today's date for greeting context
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Clean Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1
            className="text-2xl font-black text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => navigate('/')}
          >
            CampusConnect
          </h1>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-700 hidden sm:block">{userName}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user.name || userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome & Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          {/* Personalized Welcome */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900">
              {greeting}, {userName}! 👋
            </h2>
            <p className="text-gray-500 mt-1">
              {user.role === 'organizer'
                ? "Manage your events and track registrations"
                : "Here's what's happening on campus today"}
            </p>
          </div>

          {/* Stats Cards - Clickable with shadows */}
          <div className="grid md:grid-cols-3 gap-4">
            {user.role === 'organizer' ? (
              <>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-yellow-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{myEvents?.length || 0}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Events Created</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {myEvents?.length === 0 ? "Create your first event" : `${myEvents?.filter((e: any) => new Date(e.date) >= new Date()).length || 0} upcoming`}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  onClick={scrollToEvents}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{events?.length || 0}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Total Events</p>
                  <p className="text-xs text-gray-500 mt-1">Click to browse all</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-blue-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">
                        {myEvents?.filter((e: any) => new Date(e.date) >= new Date()).length || 0}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Upcoming Events</p>
                  <p className="text-xs text-gray-500 mt-1">Events you're organizing</p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-pink-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-pink-400 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{myRegistrations?.length || 0}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Registered Events</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {myRegistrations?.length === 0 ? "You haven't registered yet" : "View your registrations"}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  onClick={scrollToEvents}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{events?.length || 0}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Available Events</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {events?.length || 0} events open for registration
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-orange-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">{myAttendanceCount || 0}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">Events Attended</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {myAttendanceCount === 0 ? "Attend your first event!" : "Great participation!"}
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Participant Actions */}
        {user.role === 'participant' && (
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/my-history')}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <History className="w-5 h-5" />
              My History
            </motion.button>
          </div>
        )}

        {/* AI-Powered Recommendations (Participants Only) */}
        {user.role === 'participant' && user.userId && (
          <RecommendedEvents userId={user.userId} />
        )}

        {/* Category Filter - Toggle Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const isActive = selectedCategories.includes(category) || (category === 'All' && selectedCategories.includes('All'))
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                  }`}
              >
                {isActive && category !== 'All' && <span className="mr-1 font-bold">•</span>}
                {category}
              </motion.button>
            )
          })}
        </div>

        {/* Create Event Button (Organizers Only) */}
        {user.role === 'organizer' && (
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAnnouncementDialog(true)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Megaphone className="w-5 h-5" />
              Announcement
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQRScanner(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <QrCode className="w-5 h-5" />
              Scan QR
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analytics')}
              className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </motion.button>
          </div>
        )}

        {/* Events Grid */}
        <div ref={eventsRef}>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Events Found</h3>
              <p className="text-gray-500 mb-6">
                {selectedCategories.includes('All')
                  ? 'No events available yet. Check back soon!'
                  : `No ${selectedCategories.join(' or ')} events right now. Check back soon!`}
              </p>
              {!selectedCategories.includes('All') && (
                <button
                  onClick={() => setSelectedCategories(['All'])}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  View All Events
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filteredEvents.map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Your Announcements Section (Organizers Only) */}
      {user.role === 'organizer' && (
        <div className="container mx-auto px-4 pb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Your Announcements</h2>
          {!myAnnouncements ? (
            <div className="bg-gray-100 rounded-xl h-32 animate-pulse" />
          ) : myAnnouncements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <Megaphone className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No announcements created yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                  showDelete={true}
                  organizerId={user.userId as any}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* General Announcements Section (Participants) */}
      {user.role === 'participant' && generalAnnouncements && generalAnnouncements.length > 0 && (
        <div className="container mx-auto px-4 pb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Announcements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {generalAnnouncements.slice(0, 4).map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                showDelete={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Event Dialog */}
      {showCreateDialog && user.userId && (
        <CreateEventDialog
          organizerId={user.userId}
          onClose={() => setShowCreateDialog(false)}
        />
      )}

      {/* Create Announcement Dialog */}
      {showAnnouncementDialog && user.userId && (
        <CreateAnnouncementDialog
          organizerId={user.userId}
          onClose={() => setShowAnnouncementDialog(false)}
        />
      )}

      {/* QR Scanner Dialog */}
      {showQRScanner && (
        <QRScanner onClose={() => setShowQRScanner(false)} />
      )}
    </div>
  )
}
