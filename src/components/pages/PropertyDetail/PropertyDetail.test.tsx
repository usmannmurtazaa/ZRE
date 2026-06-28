import { render, screen, waitFor } from '@/test/utils/testUtils'
import { useParams } from 'react-router-dom'
import { usePropertyBySlug, useIncrementPropertyViews } from '@/hooks/useProperties'
import { useAreas } from '@/hooks/useAreas'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites'
import { PropertyDetail } from './PropertyDetail'
import { mockProperty } from '@/test/mocks/firestoreMocks'
import { vi } from 'vitest'

// Mock all hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
  }
})
vi.mock('@/hooks/useProperties', () => ({
  usePropertyBySlug: vi.fn(),
  useIncrementPropertyViews: vi.fn(),
}))
vi.mock('@/hooks/useAreas', () => ({
  useAreas: vi.fn(),
}))
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))
vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
  useToggleFavorite: vi.fn(),
}))

describe('PropertyDetail', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    ;(useParams as any).mockReturnValue({ slug: 'test-property' })
    ;(useIncrementPropertyViews as any).mockReturnValue({ mutate: mockMutate })
    ;(useAreas as any).mockReturnValue({ data: [], isLoading: false })
    ;(useAuth as any).mockReturnValue({ user: null })
    ;(useFavorites as any).mockReturnValue({ data: [], isLoading: false })
    ;(useToggleFavorite as any).mockReturnValue({ mutate: vi.fn() })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    ;(usePropertyBySlug as any).mockReturnValue({ data: null, isLoading: true })
    render(<PropertyDetail />)
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders property details when loaded', async () => {
    const propertyWithImages = {
      ...mockProperty,
      images: [{ url: 'test.jpg', alt: 'Test', isMain: true, order: 0 }],
    }
    ;(usePropertyBySlug as any).mockReturnValue({ data: propertyWithImages, isLoading: false })
    render(<PropertyDetail />)

    await waitFor(() => {
      expect(screen.getByText(mockProperty.title)).toBeInTheDocument()
      expect(screen.getByText(/Test Agent/i)).toBeInTheDocument()
      expect(screen.getByText(/Send Inquiry/i)).toBeInTheDocument()
    })
    // Check that incrementViews was called
    expect(mockMutate).toHaveBeenCalledWith(mockProperty.propertyId)
  })

  it('shows contact form for inquiries', async () => {
    const propertyWithImages = {
      ...mockProperty,
      images: [{ url: 'test.jpg', alt: 'Test', isMain: true, order: 0 }],
    }
    ;(usePropertyBySlug as any).mockReturnValue({ data: propertyWithImages, isLoading: false })
    render(<PropertyDetail />)

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Full Name/i)
      expect(nameInput).toBeInTheDocument()
      const emailInput = screen.getByLabelText(/Email/i)
      expect(emailInput).toBeInTheDocument()
      const phoneInput = screen.getByLabelText(/Phone Number/i)
      expect(phoneInput).toBeInTheDocument()
    })
  })
})
