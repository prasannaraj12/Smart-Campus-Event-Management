import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../hooks/use-auth'
import { Mail, Lock, Check, AlertCircle, Shield } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const sendOTP = useMutation(api.auth.sendOTP)
  const verifyOTP = useMutation(api.auth.verifyOTP)
  const createOrganizerUser = useMutation(api.users.createOrganizerUser)

  // Auto-focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(r => r - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Email validation
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value.length > 0) {
      setEmailValid(validateEmail(value))
    } else {
      setEmailValid(null)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValid) return

    setLoading(true)
    setError('')

    try {
      const result = await sendOTP({ email })
      setGeneratedOtp(result.code || '')
      setStep('otp')
      setResendTimer(30)
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    otpInputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) return

    setLoading(true)
    setError('')

    try {
      await verifyOTP({ email, code })
      const userId = await createOrganizerUser({ email })
      login({ userId, role: 'organizer', email })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    setError('')
    try {
      const result = await sendOTP({ email })
      setGeneratedOtp(result.code || '')
      setResendTimer(30)
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  const isOtpComplete = otp.every(d => d !== '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Organizer Login</h1>
          <p className="text-gray-500 text-sm">Secure access for event organizers</p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dev OTP Display */}
        {generatedOtp && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <p className="font-bold text-green-800 text-sm">Your OTP: <span className="font-mono">{generatedOtp}</span></p>
            <p className="text-xs text-green-600">In production, this would be emailed</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP}
              className="space-y-5"
            >
              {/* OTP Explanation */}
              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <Lock className="w-4 h-4 inline mr-1" />
                We'll send a one-time password (OTP) to verify your account.
              </div>

              {/* Email Input */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none ${emailValid === null ? 'border-gray-200 focus:border-indigo-500'
                        : emailValid ? 'border-green-400' : 'border-red-300'
                      }`}
                    placeholder="name@college.edu"
                  />
                  {emailValid !== null && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {emailValid ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                    </div>
                  )}
                </div>
                {emailValid === false && email && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={emailValid ? { scale: 1.01 } : {}}
                whileTap={emailValid ? { scale: 0.99 } : {}}
                type="submit"
                disabled={loading || !emailValid}
                className={`w-full py-3 rounded-xl font-bold transition-all ${emailValid ? 'bg-yellow-400 hover:bg-yellow-500 shadow-md' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              className="space-y-5"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to</p>
                <p className="font-bold text-gray-900">{email}</p>
              </div>

              {/* OTP Boxes */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpInputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 rounded-xl border-2 border-gray-200 text-center text-xl font-bold focus:border-indigo-500 focus:outline-none"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-center text-sm">
                {resendTimer > 0 ? (
                  <p className="text-gray-500">Resend in <span className="font-bold">{resendTimer}s</span></p>
                ) : (
                  <button type="button" onClick={handleResendOTP} className="text-indigo-600 font-semibold hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <motion.button
                whileHover={isOtpComplete ? { scale: 1.01 } : {}}
                whileTap={isOtpComplete ? { scale: 0.99 } : {}}
                type="submit"
                disabled={loading || !isOtpComplete}
                className={`w-full py-3 rounded-xl font-bold transition-all ${isOtpComplete ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </motion.button>

              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); setGeneratedOtp('') }}
                className="w-full text-center text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                ← Change email
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Divider & Role Switch */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Are you a participant?{' '}
          <button onClick={() => navigate('/role-selection')} className="text-indigo-600 font-semibold hover:underline">
            Participant Login
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Secure login • No password required
        </div>
      </motion.div>
    </div>
  )
}
