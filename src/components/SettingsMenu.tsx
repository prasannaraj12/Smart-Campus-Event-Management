import { motion, AnimatePresence } from 'framer-motion'
import { X, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '../hooks/use-theme'
import { useLanguage } from '../hooks/use-language'

interface Props {
  onClose: () => void
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
]

export default function SettingsMenu({ onClose }: Props) {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="neo-brutal-lg bg-white dark:bg-gray-800 p-8 max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="neo-brutal-sm bg-red-400 p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2 dark:text-white">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Theme
              </h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleTheme}
                className={`neo-brutal w-full py-4 font-bold text-lg transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-yellow-400'
                }`}
              >
                {theme === 'light' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Moon className="w-5 h-5" />
                    Switch to Dark Mode
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sun className="w-5 h-5" />
                    Switch to Light Mode
                  </span>
                )}
              </motion.button>
            </div>

            {/* Language Selection */}
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2 dark:text-white">
                <Globe className="w-5 h-5" />
                Language
              </h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`neo-brutal w-full py-3 font-bold text-left px-4 transition-all ${
                      language === lang.code
                        ? 'bg-blue-400 translate-x-1 translate-y-1 shadow-none'
                        : 'bg-white dark:bg-gray-700 dark:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <span className="ml-auto text-sm">✓</span>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="neo-brutal bg-green-400 w-full py-3 font-bold mt-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
