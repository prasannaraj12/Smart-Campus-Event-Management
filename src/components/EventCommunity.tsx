import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { MessageCircle, HelpCircle, Image, Plus, X, Sparkles, MessageSquare } from 'lucide-react'
import { useAuth } from '../hooks/use-auth'
import DiscussionThread from './DiscussionThread'
import PhotoGallery from './PhotoGallery'

interface Props {
  eventId: Id<"events">
}

type TabType = 'discussions' | 'questions' | 'photos'

export default function EventCommunity({ eventId }: Props) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('discussions')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const discussions = useQuery(
    api.discussions.getEventDiscussions,
    activeTab === 'discussions' ? { eventId, type: 'discussion' } : 'skip'
  )

  const questions = useQuery(
    api.discussions.getEventDiscussions,
    activeTab === 'questions' ? { eventId, type: 'question' } : 'skip'
  )

  const tabs = [
    { id: 'discussions' as TabType, label: 'Discussions', icon: MessageCircle, count: discussions?.length, color: 'blue' },
    { id: 'questions' as TabType, label: 'Q&A', icon: HelpCircle, count: questions?.length, color: 'green' },
    { id: 'photos' as TabType, label: 'Photos', icon: Image, color: 'purple' },
  ]

  const getTabColors = (tabId: string, isActive: boolean) => {
    const colors: Record<string, { active: string, inactive: string, icon: string }> = {
      discussions: { active: 'bg-blue-500 text-white', inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100', icon: 'bg-blue-100 text-blue-600' },
      questions: { active: 'bg-green-500 text-white', inactive: 'bg-green-50 text-green-600 hover:bg-green-100', icon: 'bg-green-100 text-green-600' },
      photos: { active: 'bg-purple-500 text-white', inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100', icon: 'bg-purple-100 text-purple-600' },
    }
    return isActive ? colors[tabId].active : colors[tabId].inactive
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Community</h2>
            <p className="text-sm text-gray-500">Discussions, Q&A, and Photos</p>
          </div>
        </div>

        {/* Create Button */}
        {user && activeTab !== 'photos' && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'discussions' ? 'Start Discussion' : 'Ask Question'}
          </button>
        )}
      </div>

      {/* Tab Navigation - Pill Style */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${getTabColors(tab.id, activeTab === tab.id)}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'discussions' && (
          <motion.div
            key="discussions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {discussions && discussions.length > 0 ? (
              discussions.map((discussion) => (
                <DiscussionThread
                  key={discussion._id}
                  discussion={discussion}
                />
              ))
            ) : (
              <EmptyState
                icon={MessageCircle}
                title="No discussions yet"
                description="Be the first to start a conversation about schedules, rules, or logistics."
                buttonText="Start Discussion"
                buttonColor="blue"
                onAction={user ? () => setShowCreateDialog(true) : undefined}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {questions && questions.length > 0 ? (
              questions.map((question) => (
                <DiscussionThread
                  key={question._id}
                  discussion={question}
                />
              ))
            ) : (
              <EmptyState
                icon={HelpCircle}
                title="No questions yet"
                description="Ask the organizers anything about the event, requirements, or logistics."
                buttonText="Ask Question"
                buttonColor="green"
                onAction={user ? () => setShowCreateDialog(true) : undefined}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'photos' && (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PhotoGallery eventId={eventId} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Dialog */}
      {showCreateDialog && user && (
        <CreateDiscussionDialog
          eventId={eventId}
          type={activeTab === 'questions' ? 'question' : 'discussion'}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </motion.div>
  )
}

// Empty State Component - Matches Dashboard Widget Style
function EmptyState({ icon: Icon, title, description, buttonText, buttonColor, onAction }: {
  icon: any
  title: string
  description: string
  buttonText: string
  buttonColor: 'blue' | 'green' | 'purple'
  onAction?: () => void
}) {
  const buttonStyles = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
  }

  const iconBgStyles = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
  }

  const iconStyles = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
  }

  return (
    <div className="bg-gray-50 rounded-xl p-8 text-center">
      <div className={`w-14 h-14 ${iconBgStyles[buttonColor]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-7 h-7 ${iconStyles[buttonColor]}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className={`px-5 py-2.5 ${buttonStyles[buttonColor]} text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

// Create Discussion Dialog with AI-Powered Q&A - Modern Style
function CreateDiscussionDialog({ eventId, type, onClose }: any) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // AI Suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [showAIBox, setShowAIBox] = useState(false)

  const createDiscussion = useMutation(api.discussions.createDiscussion)
  const generateAIAnswer = useAction(api.ai.generateQAAnswer)

  const isQuestion = type === 'question'

  // Get AI Suggestion for the question
  const handleGetAISuggestion = async () => {
    if (!title.trim()) return

    setLoadingAI(true)
    setShowAIBox(true)
    try {
      const result = await generateAIAnswer({
        eventId,
        userQuestion: title.trim(),
      })
      setAiSuggestion(result.answer)
    } catch (err) {
      console.error('AI suggestion failed:', err)
      setAiSuggestion("I'm having trouble generating a response. Please ask the organizer directly.")
    } finally {
      setLoadingAI(false)
    }
  }

  // Use AI answer as the message
  const handleUseAnswer = () => {
    if (aiSuggestion) {
      setMessage(aiSuggestion)
      setShowAIBox(false)
      setAiSuggestion(null)
    }
  }

  // Edit - prefill message and let user modify
  const handleEditAnswer = () => {
    if (aiSuggestion) {
      setMessage(aiSuggestion)
      setShowAIBox(false)
    }
  }

  // Ignore AI suggestion
  const handleIgnore = () => {
    setShowAIBox(false)
    setAiSuggestion(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user) return
    if (isQuestion && !title.trim()) return

    setLoading(true)
    try {
      await createDiscussion({
        eventId,
        userId: user.userId,
        userName: user.name || 'Anonymous',
        userRole: user.role,
        type,
        title: isQuestion ? title.trim() : undefined,
        message: message.trim(),
      })
      onClose()
    } catch (err) {
      console.error('Failed to create:', err)
      alert('Failed to create. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isQuestion ? 'bg-green-100' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
              {isQuestion ? (
                <HelpCircle className="w-5 h-5 text-green-600" />
              ) : (
                <MessageCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isQuestion ? 'Ask a Question' : 'Start Discussion'}
              </h2>
              <p className="text-sm text-gray-500">Share with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isQuestion && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What would you like to know?"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  maxLength={200}
                  required
                />
                {/* AI Suggestion Button */}
                <button
                  type="button"
                  onClick={handleGetAISuggestion}
                  disabled={!title.trim() || loadingAI}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                  title="Get AI suggested answer"
                >
                  <Sparkles className="w-4 h-4" />
                  {loadingAI ? 'Thinking...' : 'AI Help'}
                </button>
              </div>
            </div>
          )}

          {/* AI Suggestion Box - Modern Style */}
          {isQuestion && showAIBox && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm font-bold text-purple-700">Suggested Answer (AI)</p>
              </div>

              {loadingAI ? (
                <div className="flex items-center gap-3 text-gray-500 py-2">
                  <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm">Searching event details...</span>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{aiSuggestion}</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleUseAnswer}
                      className="px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Use Answer
                    </button>
                    <button
                      type="button"
                      onClick={handleEditAnswer}
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleIgnore}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    AI-generated from event details. You can use it, edit it, or ask your own question.
                  </p>
                </>
              )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isQuestion ? 'Details (optional)' : 'Message'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isQuestion ? 'Provide more context...' : 'Share your thoughts...'}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={5}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-400 mt-2 text-right">
              {message.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim() || (isQuestion && !title.trim())}
              className={`flex-1 py-3 ${isQuestion ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white font-semibold rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
