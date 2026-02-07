import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UserCircle, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'

export default function RoleSelection() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const createAnonymousUser = useMutation(api.users.createAnonymousUser)

  const handleParticipant = async () => {
    try {
      setLoading(true)
      setError('')
      
      const userId = await createAnonymousUser({ name: 'Anonymous' })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      login({
        userId,
        role: 'participant',
        name: 'Anonymous'
      })
      
      navigate('/dashboard')
    } catch (err) {
      console.error('Error creating participant:', err)
      setError('Failed to create participant account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizer = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-5xl font-black text-center mb-12">Choose Your Role</h1>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="neo-brutal bg-red-100 p-4 mb-8 text-center"
          >
            <p className="font-bold text-red-800">{error}</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleParticipant}
            disabled={loading}
            className="neo-brutal-lg bg-blue-400 p-12 hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCircle className="w-24 h-24 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Participant</h2>
            <p className="text-lg font-semibold">
              Browse and register for events anonymously
            </p>
            {loading && <p className="mt-4 text-sm">Loading...</p>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOrganizer}
            disabled={loading}
            className="neo-brutal-lg bg-pink-400 p-12 hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all disabled:opacity-50"
          >
            <Briefcase className="w-24 h-24 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Organizer</h2>
            <p className="text-lg font-semibold">
              Create and manage campus events
            </p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
