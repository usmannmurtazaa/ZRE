import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/testUtils'
import { PropertyDetail } from './PropertyDetail'
import React from 'react'

// Mock Framer Motion to avoid jsdom errors
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => {
      return React.forwardRef(({ children, ...rest }: any, ref: any) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...htmlProps } = rest
        const Tag = 'div'
        return React.createElement(Tag, { ...htmlProps, ref }, children)
      })
    },
  }),
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('@/hooks/useProperties', () => ({
  usePropertyBySlug: vi.fn(),
  useIncrementPropertyViews: vi.fn(() => ({ mutate: vi.fn() })),
}))

vi.mock('@/hooks/useAreas', () => ({
  useAreas: vi.fn(() => ({ data: [], isLoading: false })),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null })),
}))

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: vi.fn(() => ({ data: [] })),
  useToggleFavorite: vi.fn(() => ({ mutate: vi.fn() })),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: () => ({ slug: 'test-property' }) }
})

const mockProperty = {
  propertyId: 'prop-1',
  title: 'Test Property',
  slug: 'test-property',
  description: 'A beautiful test property',
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

describe('PropertyDetail', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state', async () => {
    const { usePropertyBySlug } = await import('@/hooks/useProperties')
    ;(usePropertyBySlug as any).mockReturnValue({ data: undefined, isLoading: true })

    render(<PropertyDetail />)
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders property details when loaded', async () => {
    const { usePropertyBySlug } = await import('@/hooks/useProperties')
    ;(usePropertyBySlug as any).mockReturnValue({ data: mockProperty, isLoading: false })

    render(<PropertyDetail />)

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1, name: mockProperty.title })
      expect(heading).toBeInTheDocument()
      expect(screen.getByText(/Test Agent/i)).toBeInTheDocument()
      expect(screen.getByText(/Test Area/i)).toBeInTheDocument()
    })
  })

  it('shows contact form for inquiries', async () => {
    const { usePropertyBySlug } = await import('@/hooks/useProperties')
    ;(usePropertyBySlug as any).mockReturnValue({ data: mockProperty, isLoading: false })

    render(<PropertyDetail />)

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Full Name/i)
      expect(nameInput).toBeInTheDocument()

      const emailInput = screen.getByPlaceholderText(/ali@example.com/i)
      expect(emailInput).toBeInTheDocument()
    })
  })
})