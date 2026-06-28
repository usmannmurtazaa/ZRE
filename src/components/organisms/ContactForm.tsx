import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { createLeadSchema } from '@/lib/validators/leadSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { useCreateLead } from '@/hooks/useLeads'
import { cn } from '@/lib/helpers/cn'
import { Loader2, AlertCircle, ShieldCheck, Send } from 'lucide-react'

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
  agentId?: string
  agentName?: string
  className?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  message?: string
}

export const ContactForm = ({
  propertyId,
  propertyTitle,
  agentId,
  agentName,
  className,
}: ContactFormProps) => {
  const dispatch = useDispatch()
  const createLead = useCreateLead()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      createLeadSchema.pick({ name: true, email: true, phone: true, message: true })
    ),
    mode: 'onBlur',
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await createLead.mutateAsync({
        propertyId: propertyId || '',
        propertyTitle: propertyTitle || 'General Inquiry',
        agentId: agentId || '',
        agentName: agentName || 'Zain Real Estate Team',
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: propertyId ? 'listing' : 'contact',
      })
      dispatch(
        showToast({
          message: 'Your inquiry has been sent. We will contact you shortly.',
          type: 'success',
        })
      )
      reset()
    } catch {
      dispatch(
        showToast({
          message: 'Failed to send inquiry. Please try again.',
          type: 'error',
        })
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'relative w-full rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card transition-shadow hover:shadow-md',
        className
      )}
      noValidate
    >
      {/* Heading */}
      <div className="mb-7">
        <h3 className="font-serif text-xl font-semibold text-foreground">Send an Inquiry</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          Fill out the form below and our expert agents will get back to you within 24 hours.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Muhammad Ali"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(
              'transition-all duration-200 focus-visible:ring-ring',
              errors.name && 'border-destructive focus-visible:ring-destructive/20'
            )}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                id="name-error"
                className="text-sm text-destructive flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ali@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(
              'transition-all duration-200 focus-visible:ring-ring',
              errors.email && 'border-destructive focus-visible:ring-destructive/20'
            )}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                id="email-error"
                className="text-sm text-destructive flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+92 300 1234567"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={cn(
              'transition-all duration-200 focus-visible:ring-ring',
              errors.phone && 'border-destructive focus-visible:ring-destructive/20'
            )}
          />
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                id="phone-error"
                className="text-sm text-destructive flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message (optional) */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground font-medium">
            Message <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="message"
            placeholder="I'm interested in this property. Please tell me more..."
            rows={4}
            {...register('message')}
            className="transition-all duration-200 focus-visible:ring-ring resize-none"
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive flex items-center gap-1.5"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.message.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Trust note */}
      <div className="mt-5 flex items-center gap-2 px-1">
        <ShieldCheck className="h-4 w-4 text-gold-500" />
        <span className="text-xs text-muted-foreground">
          Your information is secure and will never be shared.
        </span>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="mt-5 w-full gap-2" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Inquiry
          </>
        )}
      </Button>
    </motion.form>
  )
}

export default ContactForm
