import { render, screen, waitFor } from '@/test/utils/testUtils'
import { Home } from './Home'
import { useFeaturedProperties } from '@/hooks/useProperties'
import { useAreas } from '@/hooks/useAreas'
import { vi } from 'vitest'

vi.mock('@/hooks/useProperties')
vi.mock('@/hooks/useAreas')

describe('Home Page', () => {
  it('renders hero section', async () => {
    ;(useFeaturedProperties as any).mockReturnValue({ data: [], isLoading: false })
    ;(useAreas as any).mockReturnValue({ data: [], isLoading: false })

    render(<Home />)
    expect(screen.getByText(/Secure Your Future/i)).toBeInTheDocument()
    expect(screen.getByText(/Explore Properties/i)).toBeInTheDocument()
  })

  it('shows loading skeletons while fetching data', () => {
    ;(useFeaturedProperties as any).mockReturnValue({ data: null, isLoading: true })
    ;(useAreas as any).mockReturnValue({ data: null, isLoading: true })

    render(<Home />)
    // Check that at least one skeleton is present
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays featured properties when available', async () => {
    const mockProperties = [
      {
        propertyId: '1',
        title: 'Featured 1',
        price: 1000000,
        area: 'Test',
        slug: 'featured-1',
        status: 'for_sale',
        sizeSqYds: 100,
        images: [{ url: 'test.jpg', alt: 'Test', isMain: true, order: 0 }],
        description: 'Test description',
        type: 'residential',
        subtype: 'plot',
        features: [],
        address: '123 Test St',
        areaId: 'area-1',
        agentId: 'agent-1',
        agentName: 'Test Agent',
        contactPhone: '+92-300-1234567',
        contactEmail: 'test@example.com',
        isFeatured: true,
        isActive: true,
        views: 0,
        inquiries: 0,
        favorites: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
    ]
    ;(useFeaturedProperties as any).mockReturnValue({ data: mockProperties, isLoading: false })
    ;(useAreas as any).mockReturnValue({ data: [], isLoading: false })

    render(<Home />)
    await waitFor(() => {
      expect(screen.getByText('Featured 1')).toBeInTheDocument()
    })
  })
})
