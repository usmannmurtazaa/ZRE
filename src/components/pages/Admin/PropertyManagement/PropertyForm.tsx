import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { propertySchema } from '@/lib/validators/propertySchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useAreas } from '@/hooks/useAreas'
import { useAuth } from '@/hooks/useAuth'
import { PROPERTY_TYPES, PROPERTY_STATUSES, FEATURES } from '@/lib/constants'
import { useCreateProperty, useUpdateProperty } from '@/hooks/useProperties'
import { showToast } from '@/store/slices/uiSlice'
import { Loader2, AlertCircle } from 'lucide-react'

interface PropertyFormProps {
  initialData?: any
  onSuccess?: () => void
}

export const PropertyForm = ({ initialData, onSuccess }: PropertyFormProps) => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { data: areas } = useAreas()
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      type: 'residential',
      subtype: 'plot',
      status: 'for_sale',
      features: [],
    },
    mode: 'onBlur',
  })

  const selectedFeatures = watch('features') || []

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (initialData) {
        await updateProperty.mutateAsync({ id: initialData.propertyId, data })
        dispatch(showToast({ message: 'Property updated successfully', type: 'success' }))
      } else {
        await createProperty.mutateAsync({
          ...data,
          agentId: user?.uid || '',
          contactPhone: user?.phoneNumber || '',
          contactEmail: user?.email || '',
        })
        dispatch(showToast({ message: 'Property created successfully', type: 'success' }))
      }
      onSuccess?.()
    } catch {
      dispatch(showToast({ message: 'Failed to save property. Please try again.', type: 'error' }))
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
      className="space-y-8 bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8"
      noValidate
    >
      {/* Basic Information */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-neutral-900">Basic Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-neutral-700">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Luxury 500 Sq Yd Plot in DHA"
              {...register('title')}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className="transition-all duration-200 focus-visible:ring-2"
            />
            {errors.title && (
              <p
                id="title-error"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.title.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-neutral-700">
              Price (PKR) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 25000000"
              {...register('price', { valueAsNumber: true })}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? 'price-error' : undefined}
              className="transition-all duration-200"
            />
            {errors.price && (
              <p
                id="price-error"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.price.message)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-neutral-700">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the property, its features, and unique selling points..."
            {...register('description')}
            rows={4}
            className="transition-all duration-200"
          />
          {errors.description && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {String(errors.description.message)}
            </p>
          )}
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-neutral-900">Classification</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-neutral-700">
              Property Type <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('type', val as any)}
              defaultValue={watch('type')}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.type.message)}
              </p>
            )}
          </div>

          {/* Subtype */}
          <div className="space-y-2">
            <Label htmlFor="subtype" className="text-neutral-700">
              Subtype <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('subtype', val as any)}
              defaultValue={watch('subtype')}
            >
              <SelectTrigger id="subtype" className="w-full">
                <SelectValue placeholder="Select subtype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="factory">Factory</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
            {errors.subtype && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.subtype.message)}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-neutral-700">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('status', val as any)}
              defaultValue={watch('status')}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.status.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location & Size */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-neutral-900">Location &amp; Size</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area" className="text-neutral-700">
              Area <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(val) => setValue('area', val)} defaultValue={watch('area')}>
              <SelectTrigger id="area" className="w-full">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas?.map((a) => (
                  <SelectItem key={a.areaId} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.area.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizeSqYds" className="text-neutral-700">
              Size (Sq Yds) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sizeSqYds"
              type="number"
              placeholder="e.g. 500"
              {...register('sizeSqYds', { valueAsNumber: true })}
              className="transition-all duration-200"
            />
            {errors.sizeSqYds && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.sizeSqYds.message)}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address" className="text-neutral-700">
              Address
            </Label>
            <Input
              id="address"
              placeholder="Full address"
              {...register('address')}
              className="transition-all duration-200"
            />
            {errors.address && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.address.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-neutral-900">Features</h3>
        <fieldset className="border rounded-xl p-5 bg-neutral-50/80">
          <legend className="px-2 text-sm font-medium text-neutral-600">
            Select applicable features
          </legend>
          <div className="flex flex-wrap gap-3">
            {FEATURES.map((feature) => (
              <label
                key={feature}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer transition-colors duration-150"
              >
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('features', [...selectedFeatures, feature])
                    } else {
                      setValue(
                        'features',
                        selectedFeatures.filter((f: string) => f !== feature)
                      )
                    }
                  }}
                  className="border-neutral-300 text-brand-600"
                />
                <span className="text-sm text-neutral-700 group-hover:text-brand-800 font-medium">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {errors.features && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {String(errors.features.message)}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] gap-2" size="lg">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
        </Button>
        {!isSubmitting && (
          <p className="text-xs text-muted-foreground">
            All fields marked <span className="text-destructive">*</span> are required
          </p>
        )}
      </div>
    </motion.form>
  )
}

export default PropertyForm
