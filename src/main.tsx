import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { store } from './store/store'
import { queryClient } from './utils/queryClient'
import ErrorBoundary from '@/components/atoms/ErrorBoundary'
import App from './App'
import { reportWebVitals, sendToAnalytics } from './lib/performance/vitals'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)

// Report Web Vitals to Google Analytics (production only)
reportWebVitals(sendToAnalytics)
