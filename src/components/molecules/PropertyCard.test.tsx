import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { PropertyCard } from './PropertyCard'

const mockProperty = {
  propertyId: 'prop-1',
  title: 'Test Property',
  slug: 'test-property',
  description: 'A test property for unit tests',
  type: 'residential' as const,
  subtype: 'plot' as const,
  status: 'for_sale' as const,
  price: 5000000,
  sizeSqYds: 120,
  features: ['corner'],
  address: '123 Test Street',
  area: 'Test Area',
  areaId: 'area-1',
  agentId: 'agent-1',
  agentName: 'Test Agent',
  contactPhone: '03001234567',
  contactEmail: 'test@example.com',
  images: [{ url: 'test.jpg', alt: 'Test', isMain: true, order: 0 }],
  isFeatured: false,
  isActive: true,
  views: 0,
  inquiries: 0,
  favorites: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
}

const featuredProp = { ...mockProperty, isFeatured: true }

describe('PropertyCard', () => {
  it('renders property details', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByRole('heading', { name: mockProperty.title })).toBeInTheDocument()
    expect(screen.getByText(mockProperty.area)).toBeInTheDocument()
    expect(screen.getByText(/5,000,000/)).toBeInTheDocument()

    // "120 sq yd" appears twice – use getAllByText to avoid the error
    const sizeElements = screen.getAllByText(/120 sq yd/i)
    expect(sizeElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows featured badge when featured', () => {
    render(<PropertyCard property={featuredProp} />)
    expect(screen.getByText(/featured/i)).toBeInTheDocument()
  })

  it('calls onSave when save button clicked', async () => {
    const onSave = vi.fn()
    render(<PropertyCard property={mockProperty} onSave={onSave} />)

    const saveButton = screen.getByLabelText(/save property/i)
    await userEvent.click(saveButton)
    expect(onSave).toHaveBeenCalledWith('prop-1')
  })
})
