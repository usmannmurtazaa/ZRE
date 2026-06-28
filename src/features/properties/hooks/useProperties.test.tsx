import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProperties } from '@/hooks/useProperties'
import { propertyService } from '@/services/propertyService'
import { vi } from 'vitest'

vi.mock('@/services/propertyService', () => ({
  propertyService: {
    getAll: vi.fn(),
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useProperties', () => {
  it('fetches properties successfully', async () => {
    const mockData = { items: [], total: 0, page: 1, limit: 20, totalPages: 0 }
    ;(propertyService.getAll as any).mockResolvedValue(mockData)

    const { result } = renderHook(() => useProperties({}), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
  })
})
