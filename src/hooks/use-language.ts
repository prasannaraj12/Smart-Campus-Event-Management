import { createContext, useContext, useState } from 'react'

type Language = 'en' | 'es' | 'fr' | 'hi' | 'ta'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.events': 'Events',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.title': 'CampusConnect',
    'landing.subtitle': 'Smart Campus Event Management',
    'landing.getStarted': 'Get Started',
    'landing.nextEvent': 'NEXT UPCOMING EVENT',
    'landing.eventCountdown': 'Event Countdown',
    'landing.announcements': 'Announcements',
    
    // Time Units
    'time.days': 'Days',
    'time.hours': 'Hours',
    'time.minutes': 'Minutes',
    'time.seconds': 'Seconds',
    
    // Features
    'feature.eventManagement': 'Event Management',
    'feature.eventManagement.desc': 'Create and organize campus events effortlessly',
    'feature.easyRegistration': 'Easy Registration',
    'feature.easyRegistration.desc': 'Anonymous sign-up for quick event participation',
    'feature.qrTickets': 'QR Tickets',
    'feature.qrTickets.desc': 'Digital tickets with QR codes for seamless check-in',
    'feature.trackAttendance': 'Track Attendance',
    'feature.trackAttendance.desc': 'Real-time attendance tracking and analytics',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.organizer': 'Organizer',
    'dashboard.participant': 'Participant',
    'dashboard.eventsCreated': 'Events Created',
    'dashboard.totalEvents': 'Total Events',
    'dashboard.upcomingEvents': 'Upcoming Events',
    'dashboard.registeredEvents': 'Registered Events',
    'dashboard.availableEvents': 'Available Events',
    'dashboard.eventsAttended': 'Events Attended',
    'dashboard.createEvent': 'Create Event',
    'dashboard.createAnnouncement': 'Create Announcement',
    'dashboard.scanQR': 'Scan QR Code',
    'dashboard.noEvents': 'No Events Found',
    
    // Event
    'event.register': 'Register Now',
    'event.registered': "You're Registered!",
    'event.full': 'Event Full',
    'event.yourTicket': 'Your Ticket',
    'event.downloadTicket': 'Download Ticket',
    'event.viewTicket': 'View Ticket',
    'event.cancelRegistration': 'Cancel Registration',
    'event.participants': 'Participants',
    'event.exportCSV': 'Export to CSV',
    'event.noRegistrations': 'No registrations yet',
    
    // Categories
    'category.all': 'All',
    'category.workshop': 'Workshop',
    'category.seminar': 'Seminar',
    'category.sports': 'Sports',
    'category.cultural': 'Cultural',
    'category.technical': 'Technical',
    'category.social': 'Social',
    
    // Common
    'common.loading': 'Loading...',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
  },
  
  es: {
    // Spanish translations
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.events': 'Eventos',
    'nav.logout': 'Cerrar sesión',
    'landing.title': 'CampusConnect',
    'landing.subtitle': 'Gestión Inteligente de Eventos del Campus',
    'landing.getStarted': 'Comenzar',
    'time.days': 'Días',
    'time.hours': 'Horas',
    'time.minutes': 'Minutos',
    'time.seconds': 'Segundos',
    'dashboard.welcome': 'Bienvenido',
    'dashboard.createEvent': 'Crear Evento',
    'event.register': 'Registrarse Ahora',
    'common.loading': 'Cargando...',
  },
  
  fr: {
    // French translations
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.events': 'Événements',
    'nav.logout': 'Se déconnecter',
    'landing.title': 'CampusConnect',
    'landing.subtitle': 'Gestion Intelligente des Événements du Campus',
    'landing.getStarted': 'Commencer',
    'time.days': 'Jours',
    'time.hours': 'Heures',
    'time.minutes': 'Minutes',
    'time.seconds': 'Secondes',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.createEvent': 'Créer un Événement',
    'event.register': "S'inscrire Maintenant",
    'common.loading': 'Chargement...',
  },
  
  hi: {
    // Hindi translations
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.events': 'इवेंट्स',
    'nav.logout': 'लॉगआउट',
    'landing.title': 'कैंपसकनेक्ट',
    'landing.subtitle': 'स्मार्ट कैंपस इवेंट प्रबंधन',
    'landing.getStarted': 'शुरू करें',
    'time.days': 'दिन',
    'time.hours': 'घंटे',
    'time.minutes': 'मिनट',
    'time.seconds': 'सेकंड',
    'dashboard.welcome': 'स्वागत है',
    'dashboard.createEvent': 'इवेंट बनाएं',
    'event.register': 'अभी रजिस्टर करें',
    'common.loading': 'लोड हो रहा है...',
  },
  
  ta: {
    // Tamil translations
    'nav.home': 'முகப்பு',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.events': 'நிகழ்வுகள்',
    'nav.logout': 'வெளியேறு',
    'landing.title': 'கேம்பஸ்கனெக்ட்',
    'landing.subtitle': 'ஸ்மார்ட் கேம்பஸ் நிகழ்வு மேலாண்மை',
    'landing.getStarted': 'தொடங்கு',
    'time.days': 'நாட்கள்',
    'time.hours': 'மணி',
    'time.minutes': 'நிமிடங்கள்',
    'time.seconds': 'விநாடிகள்',
    'dashboard.welcome': 'வரவேற்கிறோம்',
    'dashboard.createEvent': 'நிகழ்வை உருவாக்கு',
    'event.register': 'இப்போது பதிவு செய்',
    'common.loading': 'ஏற்றுகிறது...',
  },
}

export function useLanguageProvider() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved || 'en'
  })

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return { language, setLanguage: changeLanguage, t }
}
