import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from 'firebase/auth'
import { useUpdateUser } from '@/hooks/useUsers'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { User, Phone, Mail, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { Seo } from '@/components/atoms/Seo'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
})

export const Profile = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { mutate: updateUser } = useUpdateUser()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      phoneNumber: user?.phoneNumber || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSaving(true)
    try {
      if (user) {
        await updateProfile(user, { displayName: data.displayName })
      }
      await updateUser({ uid: user?.uid || '', data })
      dispatch(showToast({ message: 'Profile updated successfully', type: 'success' }))
      reset(data) // mark form as pristine after successful save
    } catch {
      dispatch(showToast({ message: 'Failed to update profile. Please try again.', type: 'error' }))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Seo title="Profile" description="Manage your account details" noindex nofollow />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto px-4 py-8 sm:py-12"
      >
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">Keep your personal information up to date.</p>
        </div>

        {/* Profile Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex items-center gap-5"
        >
          <div className="relative inline-flex">
            <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center border-4 border-white shadow-md shadow-brand-500/10">
              <User className="h-10 w-10 text-brand-600" />
            </div>
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <CheckCircle className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-serif font-semibold text-neutral-900">
              {user?.displayName || 'User'}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 opacity-70" />
              {user?.email || 'No email'}
            </p>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-8 bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8"
          noValidate
        >
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-neutral-700 font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="displayName"
                placeholder="Your full name"
                className="pl-10"
                {...register('displayName')}
                aria-invalid={!!errors.displayName}
                aria-describedby={errors.displayName ? 'name-error' : undefined}
              />
            </div>
            <AnimatePresence>
              {errors.displayName && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  id="name-error"
                  className="text-sm text-destructive flex items-center gap-1.5"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.displayName.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-neutral-700 font-medium">
              Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phoneNumber"
                placeholder="+92 300 1234567"
                className="pl-10"
                {...register('phoneNumber')}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label className="text-neutral-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={user?.email || ''}
                disabled
                className="pl-10 bg-neutral-50 text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support for email changes.
            </p>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-neutral-100">
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              className={cn(
                'gap-2 min-w-[160px] transition-all duration-200',
                !isDirty && 'opacity-50'
              )}
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            {isDirty && (
              <p className="mt-3 text-xs text-muted-foreground">You have unsaved changes.</p>
            )}
          </div>
        </motion.form>
      </motion.div>
    </>
  )
}

export default Profile
