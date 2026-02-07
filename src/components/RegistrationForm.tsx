import { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

type Props = {
  event: any
  userId: Id<'users'>
  onSuccess: () => void
}

function buildSchema(teamSize?: number) {
  const hasTeams = typeof teamSize === 'number' && teamSize >= 2
  const base = z.object({
    participantName: z.string().min(2, 'Name is required'),
    participantEmail: z.string().email('Enter a valid email'),
    participantPhone: z.string().min(8, 'Enter a valid phone number'),
    college: z.string().min(2, 'College is required'),
    year: z.string().min(1, 'Year is required'),
    teamName: z.string().optional(),
    teamMembers: z
      .array(
        z.object({
          name: z.string().min(2, 'Member name is required'),
          email: z.string().email('Enter a valid email'),
        })
      )
      .optional(),
  })

  if (!hasTeams) return base

  const membersRequired = Math.max(0, (teamSize ?? 2) - 1)
  return base.superRefine((val, ctx) => {
    if (!val.teamName || val.teamName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Team name is required',
        path: ['teamName'],
      })
    }
    const members = val.teamMembers ?? []
    if (members.length !== membersRequired) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please add exactly ${membersRequired} team member${membersRequired === 1 ? '' : 's'}`,
        path: ['teamMembers'],
      })
    }
  })
}

export default function RegistrationForm({ event, userId, onSuccess }: Props) {
  const registerMutation = useMutation(api.registrations.register)
  const [submitError, setSubmitError] = useState('')
  const teamSize: number | undefined = event?.teamSize

  const schema = useMemo(() => buildSchema(teamSize), [teamSize])
  type FormValues = z.infer<typeof schema>

  const membersRequired = typeof teamSize === 'number' && teamSize >= 2 ? teamSize - 1 : 0

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      participantName: '',
      participantEmail: '',
      participantPhone: '',
      college: '',
      year: '',
      teamName: '',
      teamMembers: membersRequired
        ? Array.from({ length: membersRequired }).map(() => ({ name: '', email: '' }))
        : [],
    } as any,
  })

  const { fields } = useFieldArray({
    control,
    name: 'teamMembers' as any,
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitError('')
    try {
      await registerMutation({
        eventId: event._id,
        userId,
        participantName: values.participantName,
        participantEmail: values.participantEmail,
        participantPhone: values.participantPhone,
        college: values.college,
        year: values.year,
        teamName: values.teamName?.trim() ? values.teamName.trim() : undefined,
        teamMembers:
          values.teamMembers && values.teamMembers.length
            ? values.teamMembers.map((m) => ({ name: m.name.trim(), email: m.email.trim() }))
            : undefined,
      })
      onSuccess()
    } catch (err: any) {
      console.error('Registration failed:', err)
      setSubmitError(err?.message || 'Failed to register')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="neo-brutal bg-red-100 p-4">
          <p className="font-bold text-red-800">{submitError}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold mb-2">Full Name *</label>
          <input
            {...register('participantName')}
            className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Your name"
          />
          {errors.participantName && (
            <p className="mt-2 text-sm font-bold text-red-700">{String(errors.participantName.message)}</p>
          )}
        </div>

        <div>
          <label className="block font-bold mb-2">Email *</label>
          <input
            {...register('participantEmail')}
            type="email"
            className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="you@email.com"
          />
          {errors.participantEmail && (
            <p className="mt-2 text-sm font-bold text-red-700">{String(errors.participantEmail.message)}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold mb-2">Phone *</label>
          <input
            {...register('participantPhone')}
            className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Phone number"
          />
          {errors.participantPhone && (
            <p className="mt-2 text-sm font-bold text-red-700">{String(errors.participantPhone.message)}</p>
          )}
        </div>

        <div>
          <label className="block font-bold mb-2">College *</label>
          <input
            {...register('college')}
            className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Your college"
          />
          {errors.college && (
            <p className="mt-2 text-sm font-bold text-red-700">{String(errors.college.message)}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2">Year *</label>
        <select
          {...register('year')}
          className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Select year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        {errors.year && <p className="mt-2 text-sm font-bold text-red-700">{String(errors.year.message)}</p>}
      </div>

      {membersRequired > 0 && (
        <div className="neo-brutal bg-yellow-100 p-4">
          <p className="font-black">Team event</p>
          <p className="font-semibold">
            Team size: {teamSize}. Add {membersRequired} teammate{membersRequired === 1 ? '' : 's'} below (you are the
            leader).
          </p>
        </div>
      )}

      {membersRequired > 0 && (
        <>
          <div>
            <label className="block font-bold mb-2">Team Name *</label>
            <input
              {...register('teamName')}
              className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Team NeoBrutal"
            />
            {errors.teamName && (
              <p className="mt-2 text-sm font-bold text-red-700">{String(errors.teamName.message)}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black">Team Members</h3>
            {fields.map((field, idx) => (
              <div key={field.id} className="neo-brutal bg-white p-4">
                <p className="font-black mb-3">Member {idx + 1}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Name *</label>
                    <input
                      {...register(`teamMembers.${idx}.name` as any)}
                      className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Member name"
                    />
                    {errors.teamMembers?.[idx]?.name && (
                      <p className="mt-2 text-sm font-bold text-red-700">
                        {String(errors.teamMembers[idx]?.name?.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Email *</label>
                    <input
                      {...register(`teamMembers.${idx}.email` as any)}
                      type="email"
                      className="neo-brutal w-full px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="member@email.com"
                    />
                    {errors.teamMembers?.[idx]?.email && (
                      <p className="mt-2 text-sm font-bold text-red-700">
                        {String(errors.teamMembers[idx]?.email?.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {errors.teamMembers && typeof errors.teamMembers?.message === 'string' && (
              <p className="text-sm font-bold text-red-700">{String(errors.teamMembers.message)}</p>
            )}
          </div>
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="neo-brutal bg-green-400 w-full py-4 font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Registering...' : 'Confirm Registration'}
      </motion.button>
    </form>
  )
}
