import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'
import EventCard from '../components/EventCard'
import CreateEventDialog from '../components/CreateEventDialog'
import { LogOut, Plus, Calendar, Users, TrendingUp } from 'lucide-react'

const categories = ['All', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Technical', 'Social']

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deletedEventIds, setDeletedEventIds] = useState<string[]>([])

  const events = useQuery(api.events.getAllEvents)
  const myEvents = useQuery(
    api.events.getEventsByOrganizer,
    user?.role === 'organizer' && user?.userId ? { organizerId: user.userId } : 'skip'
  )
  const myRegistrations = useQuery(
    api.registrations.myRegistrations,
    user?.userId ? { userId: user.userId } : 'skip'
  )

  useEffect(() => {
    if (!loading && !user) {
      navigate('/role-selection')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="neo-brutal-lg bg-white p-10">
          <p className="text-2xl font-black">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const filteredEvents =
    events
      ?.filter(
        (event: any) =>
          (selectedCategory === 'All' || event.category === selectedCategory) &&
          !deletedEventIds.includes(event._id)
      ) || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-black">CampusConnect</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="neo-brutal bg-red-400 px-6 py-3 font-bold inline-flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>

        {/* Welcome & Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-brutal-lg bg-white p-8 mb-8"
        >
          <h2 className="text-3xl font-black mb-6">
            Welcome, {user.role === 'organizer' ? 'Organizer' : 'Participant'}!
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {user.role === 'organizer' ? (
              <>
                <div className="neo-brutal bg-yellow-400 p-6">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">{myEvents?.length || 0}</p>
                  <p className="font-bold">Events Created</p>
                </div>
                <div className="neo-brutal bg-green-400 p-6">
                  <Users className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">{events?.length || 0}</p>
                  <p className="font-bold">Total Events</p>
                </div>
                <div className="neo-brutal bg-blue-400 p-6">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">
                    {myEvents?.filter((e: any) => new Date(e.date) >= new Date()).length || 0}
                  </p>
                  <p className="font-bold">Upcoming Events</p>
                </div>
              </>
            ) : (
              <>
                <div className="neo-brutal bg-pink-400 p-6">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">{myRegistrations?.length || 0}</p>
                  <p className="font-bold">Registered Events</p>
                </div>
                <div className="neo-brutal bg-purple-400 p-6">
                  <Users className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">{events?.length || 0}</p>
                  <p className="font-bold">Available Events</p>
                </div>
                <div className="neo-brutal bg-orange-400 p-6">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <p className="text-4xl font-black mb-1">
                    {myRegistrations?.filter((r: any) => r.attended).length || 0}
                  </p>
                  <p className="font-bold">Events Attended</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`neo-brutal px-6 py-3 font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-yellow-400 translate-x-1 translate-y-1 shadow-none'
                  : 'bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Create Event Button (Organizers Only) */}
        {user.role === 'organizer' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateDialog(true)}
            className="neo-brutal-lg bg-green-400 px-8 py-4 font-black text-xl mb-8 inline-flex items-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Plus className="w-6 h-6" />
            Create New Event
          </motion.button>
        )}

        {/* Events Grid */}
        {!events ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="neo-brutal bg-gray-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="neo-brutal-lg bg-white p-12 text-center"
          >
            <Calendar className="w-24 h-24 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'All' 
                ? 'No events available yet.' 
                : `No ${selectedCategory} events available.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map((event: any) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onDeleted={(id) =>
                    setDeletedEventIds((prev) =>
                      prev.includes(id) ? prev : [...prev, id]
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Create Event Dialog */}
      {showCreateDialog && user.userId && (
        <CreateEventDialog
          organizerId={user.userId}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  )
}
