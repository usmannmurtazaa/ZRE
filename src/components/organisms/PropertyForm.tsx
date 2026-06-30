import { useState, useRef } from 'react'
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
import { PROPERTY_TYPES, PROPERTY_STATUSES, FEATURES, SITE_CONFIG } from '@/lib/constants'
import { useCreateProperty, useUpdateProperty } from '@/hooks/useProperties'
import { storageService } from '@/services/storageService'
import { showToast } from '@/store/slices/uiSlice'
import { Loader2, AlertCircle, Upload, X, Video } from 'lucide-react'

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultPhone =
    user?.phoneNumber?.replace(/[^0-9+]/g, '') ||
    SITE_CONFIG.phone.replace(/[^0-9+]/g, '') ||
    '03001234567'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      ...(initialData || {}),
      type: initialData?.type || 'residential',
      subtype: initialData?.subtype || 'plot',
      status: initialData?.status || 'for_sale',
      features: initialData?.features || [],
      agentId: initialData?.agentId || user?.uid || '',
      contactPhone: initialData?.contactPhone || defaultPhone,
      contactEmail: initialData?.contactEmail || user?.email || SITE_CONFIG.email,
      videoUrl: initialData?.videoUrl || '',
    },
    mode: 'onTouched',
  })

  const selectedFeatures = watch('features') || []
  const selectedAreaName = watch('area')

  const selectedArea = areas?.find((a) => a.name === selectedAreaName)
  if (selectedArea?.areaId) {
    setValue('areaId', selectedArea.areaId)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setSelectedFiles((prev) => [...prev, ...files])
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: any) => {
    console.log('✅ onSubmit called with data:', data)
    setIsSubmitting(true)
    try {
      let imageUrls: any[] = []
      if (selectedFiles.length > 0) {
        setUploadingImages(true)
        const uploadPromises = selectedFiles.map(async (file, index) => {
          const url = await storageService.uploadPropertyImage(
            data.title || 'temp',
            file,
            (progress) => {
              console.log(`Upload progress for image ${index + 1}: ${progress}%`)
            }
          )
          return { url, alt: file.name, isMain: index === 0, order: index }
        })
        imageUrls = await Promise.all(uploadPromises)
        setUploadingImages(false)
      }
      if (initialData?.images && selectedFiles.length === 0) {
        imageUrls = initialData.images
      }
      const payload = {
        ...data,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        ...(initialData && !selectedFiles.length && initialData.images
          ? { images: initialData.images }
          : {}),
      }
      if (!payload.videoUrl) delete payload.videoUrl
      if (initialData) {
        await updateProperty.mutateAsync({ id: initialData.propertyId, data: payload })
        dispatch(showToast({ message: 'Property updated successfully', type: 'success' }))
      } else {
        await createProperty.mutateAsync(payload)
        dispatch(showToast({ message: 'Property created successfully', type: 'success' }))
      }
      onSuccess?.()
    } catch (error) {
      console.error('❌ Submit error:', error)
      dispatch(showToast({ message: 'Failed to save property. Please try again.', type: 'error' }))
    } finally {
      setIsSubmitting(false)
      setUploadingImages(false)
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
      <input type="hidden" {...register('areaId')} />
      <input type="hidden" {...register('agentId')} />
      <input type="hidden" {...register('contactPhone')} />
      <input type="hidden" {...register('contactEmail')} />

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

      {/* Basic Information */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Luxury 500 Sq Yd Plot in DHA"
              {...register('title')}
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
            <Label htmlFor="price" className="text-foreground">
              Price (PKR) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 25000000"
              {...register('price', { valueAsNumber: true })}
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
          <Label htmlFor="description" className="text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the property..."
            {...register('description')}
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {String(errors.description.message)}
            </p>
          )}
        </div>
      </div>

      {/* Images Upload */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Images</h3>
        <div className="space-y-3">
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {previews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-xs font-medium">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {selectedFiles.length > 0
                ? `Add More Images (${selectedFiles.length} selected)`
                : 'Upload Images'}
            </Button>
            {selectedFiles.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, WebP. Max size: 10 MB per image.
          </p>
        </div>
      </div>

      {/* Video URL (optional) */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Video (Optional)</h3>
        <div className="space-y-2">
          <Label htmlFor="videoUrl" className="text-foreground">
            Video URL
          </Label>
          <div className="relative">
            <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
            <Input
              id="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              className="pl-10"
              {...register('videoUrl')}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Add a YouTube, Vimeo, or other video link to showcase the property.
          </p>
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-5">
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">
              Property Type <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('type', val as any)}
              defaultValue={watch('type')}
            >
              <SelectTrigger id="type">
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
          <div className="space-y-2">
            <Label htmlFor="subtype" className="text-foreground">
              Subtype <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('subtype', val as any)}
              defaultValue={watch('subtype')}
            >
              <SelectTrigger id="subtype">
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
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue('status', val as any)}
              defaultValue={watch('status')}
            >
              <SelectTrigger id="status">
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
        <h3 className="font-serif text-xl font-semibold text-card-foreground">
          Location &amp; Size
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area" className="text-foreground">
              Area <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(val) => setValue('area', val)} defaultValue={watch('area')}>
              <SelectTrigger id="area">
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
            <Label htmlFor="sizeSqYds" className="text-foreground">
              Size (Sq Yds) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sizeSqYds"
              type="number"
              placeholder="e.g. 500"
              {...register('sizeSqYds', { valueAsNumber: true })}
            />
            {errors.sizeSqYds && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {String(errors.sizeSqYds.message)}
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address" className="text-foreground">
              Address
            </Label>
            <Input id="address" placeholder="Full address" {...register('address')} />
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
        <h3 className="font-serif text-xl font-semibold text-card-foreground">Features</h3>
        <fieldset className="border border-border rounded-xl p-5 bg-muted/50">
          <legend className="px-2 text-sm font-medium text-muted-foreground">
            Select applicable features
          </legend>
          <div className="flex flex-wrap gap-3">
            {FEATURES.map((feature) => (
              <label
                key={feature}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border hover:border-brand-300 hover:bg-brand-50/30 dark:hover:border-gold-500/40 dark:hover:bg-gold-500/10 cursor-pointer transition-colors duration-150"
              >
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) setValue('features', [...selectedFeatures, feature])
                    else
                      setValue(
                        'features',
                        selectedFeatures.filter((f: string) => f !== feature)
                      )
                  }}
                  className="border-input data-[state=checked]:bg-brand-500 data-[state=checked]:text-white"
                />
                <span className="text-sm text-foreground group-hover:text-brand-800 dark:group-hover:text-gold-400 font-medium">
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
        <Button
          type="submit"
          disabled={isSubmitting || uploadingImages}
          className="min-w-[160px] gap-2"
          size="lg"
        >
          {isSubmitting || uploadingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting || uploadingImages
            ? 'Saving...'
            : initialData
              ? 'Update Property'
              : 'Create Property'}
        </Button>
        {!isSubmitting && !uploadingImages && (
          <p className="text-xs text-muted-foreground">
            All fields marked <span className="text-destructive">*</span> are required
          </p>
        )}
      </div>
    </motion.form>
  )
}

export default PropertyForm
