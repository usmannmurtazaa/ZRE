import { motion } from 'framer-motion'
import { useSettings, useUpdateSettings } from '@/hooks/useSettings'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { Seo } from '@/components/atoms/Seo'
import { Settings as SettingsIcon, Save, Building2, Phone, Mail, MapPin, Globe } from 'lucide-react'

// Validation schema for site settings
const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name is required'),
  tagline: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Invalid email').optional(),
  officeAddress: z.string().optional(),
  facebookUrl: z.string().url('Invalid URL').optional(),
  instagramUrl: z.string().url('Invalid URL').optional(),
  linkedinUrl: z.string().url('Invalid URL').optional(),
  whatsappNumber: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export const Settings = () => {
  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()
  const dispatch = useDispatch()

  // Convert settings array to form default values
  const defaultValues =
    settings?.reduce((acc: Record<string, any>, s: any) => ({ ...acc, [s.key]: s.value }), {}) || {}

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  })

  const onSubmit = (data: SettingsFormData) => {
    // Convert form data back to array of setting objects
    const updates = Object.entries(data).map(([key, value]) => ({
      key,
      value: value || '',
      type: typeof value === 'number' ? 'number' : 'string',
    }))

    updateSettings.mutate(updates as any, {
      onSuccess: () => {
        dispatch(showToast({ message: 'Settings saved successfully', type: 'success' }))
      },
      onError: () => {
        dispatch(showToast({ message: 'Failed to save settings', type: 'error' }))
      },
    })
  }

  return (
    <>
      <Seo title="Site Settings" description="Manage platform settings" noindex nofollow />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInSection}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-brand-600" />
            Site Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage global configuration for your real estate platform.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.form
            variants={itemFadeUp}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8"
            noValidate
          >
            {/* Branding Section */}
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand-600" />
                Branding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-neutral-700">
                    Site Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="siteName"
                    placeholder="Zain Real Estate"
                    {...register('siteName')}
                    className="transition-all duration-200"
                  />
                  {errors.siteName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      {errors.siteName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-neutral-700">
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    placeholder="Premium properties in Karachi"
                    {...register('tagline')}
                    className="transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand-600" />
                Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-neutral-700">
                    <Phone className="h-3.5 w-3.5 inline mr-1.5" />
                    Phone Number
                  </Label>
                  <Input
                    id="contactPhone"
                    placeholder="+92 300 1234567"
                    {...register('contactPhone')}
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-neutral-700">
                    <Mail className="h-3.5 w-3.5 inline mr-1.5" />
                    Email Address
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="zainrealestateagency@gmail.com"
                    {...register('contactEmail')}
                    className="transition-all duration-200"
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="officeAddress" className="text-neutral-700">
                    <MapPin className="h-3.5 w-3.5 inline mr-1.5" />
                    Office Address
                  </Label>
                  <Textarea
                    id="officeAddress"
                    placeholder="Plot 12-C, Main Boulevard, Karachi"
                    rows={2}
                    {...register('officeAddress')}
                    className="transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand-600" />
                Social Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl" className="text-neutral-700">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebookUrl"
                    placeholder="https://facebook.com/zainrealestate"
                    {...register('facebookUrl')}
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="text-neutral-700">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagramUrl"
                    placeholder="https://instagram.com/zainrealestate"
                    {...register('instagramUrl')}
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-neutral-700">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/company/zainrealestate"
                    {...register('linkedinUrl')}
                    className="transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="text-neutral-700">
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsappNumber"
                    placeholder="+92 300 1234567"
                    {...register('whatsappNumber')}
                    className="transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-neutral-100 flex items-center gap-4">
              <Button type="submit" disabled={!isDirty} className="min-w-[160px] gap-2" size="lg">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              {isDirty && (
                <p className="text-xs text-muted-foreground">You have unsaved changes.</p>
              )}
            </div>
          </motion.form>
        )}
      </motion.div>
    </>
  )
}

export default Settings
