import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateArea, useUpdateArea } from '@/hooks/useAreas'
import { showToast } from '@/store/slices/uiSlice'
import { Loader2, AlertCircle } from 'lucide-react'

const areaSchema = z.object({
  name: z.string().min(2, 'Area name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageURL: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

interface AreaFormProps {
  initialData?: any
  onSuccess?: () => void
}

export const AreaForm = ({ initialData, onSuccess }: AreaFormProps) => {
  const dispatch = useDispatch()
  const createArea = useCreateArea()
  const updateArea = useUpdateArea()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(areaSchema),
    defaultValues: initialData || {
      isActive: true,
    },
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (initialData) {
        await updateArea.mutateAsync({ id: initialData.areaId, data })
        dispatch(showToast({ message: 'Area updated successfully', type: 'success' }))
      } else {
        await createArea.mutateAsync(data)
        dispatch(showToast({ message: 'Area created successfully', type: 'success' }))
      }
      onSuccess?.()
    } catch (error) {
      console.error('Submit error:', error)
      dispatch(showToast({ message: 'Failed to save area', type: 'error' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorEntries = Object.entries(errors)
  const hasErrors = errorEntries.length > 0

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8"
      noValidate
    >
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
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Area Details</h3>

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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            defaultChecked={initialData?.isActive ?? true}
            {...register('isActive')}
            className="rounded border-input"
          />
          <Label htmlFor="isActive" className="text-foreground">
            Active
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] gap-2" size="lg">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : initialData ? 'Update Area' : 'Create Area'}
        </Button>
      </div>
    </motion.form>
  )
}

export default AreaForm
