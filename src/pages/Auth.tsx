import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'
import { Mail, Lock } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')

  const sendOTP = useMutation(api.auth.sendOTP)
  const verifyOTP = useMutation(api.auth.verifyOTP)
  const createOrganizerUser = useMutation(api.users.createOrganizerUser)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await sendOTP({ email })
      setGeneratedOtp(result.code || '')
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await verifyOTP({ email, code: otp })
      const userId = await createOrganizerUser({ email })
      
      login({
        userId,
        role: 'organizer',
        email
      })
      
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-brutal-lg bg-white p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-black mb-8 text-center">Organizer Sign In</h1>

        {error && (
          <div className="neo-brutal bg-red-100 p-4 mb-6">
            <p className="font-bold text-red-800">{error}</p>
          </div>
        )}

        {generatedOtp && (
          <div className="neo-brutal bg-green-100 p-4 mb-6">
            <p className="font-bold text-green-800">Your OTP: {generatedOtp}</p>
            <p className="text-sm text-green-700 mt-1">In production, this would be sent to your email</p>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block font-bold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="neo-brutal w-full pl-12 pr-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="neo-brutal bg-yellow-400 w-full py-3 font-black text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block font-bold mb-2">Enter OTP</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="neo-brutal w-full pl-12 pr-4 py-3 font-semibold text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="000000"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="neo-brutal bg-green-400 w-full py-3 font-black text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setStep('email')
                setOtp('')
                setError('')
              }}
              className="w-full text-center font-bold underline"
            >
              Back to Email
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
