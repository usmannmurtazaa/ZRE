import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { useArea, useCreateArea, useUpdateArea } from '@/hooks/useAreas'
import { showToast } from '@/store/slices/uiSlice'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/atoms/Seo'

const PROPERTY_TYPE_OPTIONS = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
] as const

const areaSchema = z.object({
  name: z.string().min(2, 'Area name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageURL: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  propertyTypes: z.array(z.string()).optional().default([]),
})

type AreaFormData = z.infer<typeof areaSchema>

export const AreaForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: existingArea, isLoading: areaLoading } = useArea(id)

  const createArea = useCreateArea()
  const updateArea = useUpdateArea()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageURL: '',
      isActive: true,
      propertyTypes: [],
    },
  })

  const selectedPropertyTypes = watch('propertyTypes') || []

  useEffect(() => {
    if (existingArea) {
      reset({
        name: existingArea.name || '',
        slug: existingArea.slug || '',
        description: existingArea.description || '',
        imageURL: existingArea.imageURL || '',
        isActive: existingArea.isActive ?? true,
        propertyTypes: existingArea.propertyTypes || [],
      })
    }
  }, [existingArea, reset])

  const onSubmit = async (data: AreaFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await updateArea.mutateAsync({ id, data: data as any })
        dispatch(showToast({ message: 'Area updated successfully', type: 'success' }))
      } else {
        await createArea.mutateAsync(data as any)
        dispatch(showToast({ message: 'Area created successfully', type: 'success' }))
      }
      navigate('/admin/areas')
    } catch (error) {
      console.error('Area submit error:', error)
      dispatch(showToast({ message: 'Failed to save area. Please try again.', type: 'error' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorEntries = Object.entries(errors)
  const hasErrors = errorEntries.length > 0

  return (
    <>
      <Seo
        title={isEditing ? 'Edit Area' : 'Add Area'}
        description="Admin area management"
        noindex
        nofollow
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/admin/areas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Areas
        </Link>

        {isEditing && areaLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8"
            noValidate
          >
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              {isEditing ? 'Edit Area' : 'Add New Area'}
            </h1>

            {hasErrors && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive mb-2">
                  {errorEntries.length} field{errorEntries.length > 1 ? 's' : ''} need attention:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-destructive/80">
                  {errorEntries.map(([field, err]: [string, any]) => (
                    <li key={field}>
                      <span className="font-medium">{field}</span>: {err?.message || 'Invalid'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" placeholder="e.g. Mehran Town" {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {String(errors.name.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-foreground">
                    Slug (optional)
                  </Label>
                  <Input id="slug" placeholder="mehran-town" {...register('slug')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the area..."
                  {...register('description')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageURL" className="text-foreground">
                  Cover Image URL
                </Label>
                <Input id="imageURL" placeholder="https://..." {...register('imageURL')} />
                {errors.imageURL && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {String(errors.imageURL.message)}
                  </p>
                )}
              </div>

              {/* Property Types (multi‑select) */}
              <div className="space-y-3">
                <Label className="text-foreground">Property Types</Label>
                <div className="flex flex-wrap gap-4">
                  {PROPERTY_TYPE_OPTIONS.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedPropertyTypes.includes(value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue('propertyTypes', [...selectedPropertyTypes, value])
                          } else {
                            setValue(
                              'propertyTypes',
                              selectedPropertyTypes.filter((t) => t !== value)
                            )
                          }
                        }}
                      />
                      <span className="text-sm text-foreground">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="rounded border-input"
                />
                <Label htmlFor="isActive" className="text-foreground">
                  Active
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[160px] gap-2"
                size="lg"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Area' : 'Create Area'}
              </Button>
              <Link to="/admin/areas">
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </motion.form>
        )}
      </div>
    </>
  )
}

export default AreaForm
