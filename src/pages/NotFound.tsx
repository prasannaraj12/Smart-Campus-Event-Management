import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="neo-brutal-lg bg-white p-12 text-center max-w-lg"
      >
        <h1 className="text-9xl font-black mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="neo-brutal bg-blue-400 px-8 py-4 font-bold text-lg inline-flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Home className="w-5 h-5" />
          Go Home
        </motion.button>
      </motion.div>
    </div>
  )
}
