import { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, X, Camera } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function QRScanner({ onClose }: Props) {
  const [manualInput, setManualInput] = useState('')

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      const input = manualInput.trim().toUpperCase();

      // Check if it's a short code (like REG-A1B2C3 or just A1B2C3)
      if (input.includes('REG-') || input.length <= 10) {
        // It's a short code - navigate to ticket page (Ticket.tsx handles code detection)
        window.location.href = `/ticket/${input}`;
      } else if (input.includes('/ticket/')) {
        // Extract registration ID from URL
        const regId = input.split('/ticket/')[1];
        window.location.href = `/ticket/${regId}`;
      } else {
        // Assume it's a registration ID
        window.location.href = `/ticket/${input}`;
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="neo-brutal-lg bg-white p-8 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="neo-brutal-sm bg-red-400 p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="neo-brutal bg-blue-100 p-6 mb-6 text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <p className="font-bold mb-2">Camera Scanner</p>
          <p className="text-sm font-semibold text-gray-700">
            Camera QR scanning will be implemented with a library like react-qr-reader.
            For now, use manual input below.
          </p>
        </div>

        <div className="neo-brutal bg-gray-50 p-6">
          <h3 className="font-black mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Manual Entry
          </h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm">
                Paste Registration ID or Ticket URL
              </label>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Registration ID or ticket URL"
                className="neo-brutal w-full px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!manualInput.trim()}
              className="neo-brutal bg-green-400 w-full py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              Mark Attendance
            </motion.button>
          </form>

          <div className="mt-4 p-3 bg-yellow-100 rounded">
            <p className="text-xs font-semibold text-gray-700">
              Tip: Ask participants to open their ticket and copy the URL or registration ID
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
