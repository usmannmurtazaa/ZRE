import { render, screen, fireEvent } from '@/test/utils/testUtils'
import { PropertyCard } from './PropertyCard'
import { mockProperty } from '@/test/mocks/firestoreMocks'
import type { Property } from '@/types'

// Ensure correct types for testing
const propertyWithImages = {
  ...mockProperty,
  type: 'residential' as const,
  subtype: 'plot' as const,
  status: 'for_sale' as const,
  images: [{ url: 'test.jpg', alt: 'Test', isMain: true, order: 0 }],
} as unknown as Property

describe('PropertyCard', () => {
  it('renders property details', () => {
    render(<PropertyCard property={propertyWithImages} />)
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument()
    expect(screen.getByText(mockProperty.area)).toBeInTheDocument()
    expect(screen.getByText(/5,000,000/)).toBeInTheDocument()
    expect(screen.getByText('120 sq yd')).toBeInTheDocument()
  })

  it('shows featured badge when featured', () => {
    const featuredProp = { ...propertyWithImages, isFeatured: true } as unknown as Property
    render(<PropertyCard property={featuredProp} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('calls onSave when save button clicked', () => {
    const onSave = vi.fn()
    render(<PropertyCard property={propertyWithImages} onSave={onSave} />)
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    expect(onSave).toHaveBeenCalledWith(mockProperty.propertyId)
  })
})
