import { Component, type ErrorInfo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a graceful fallback UI instead of crashing the whole app.
 *
 * In development mode the error message is shown; in production a generic message appears.
 * The fallback UI is fully accessible and follows the brand's design language.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in all environments
    console.error('[ErrorBoundary] Caught an unhandled error:', error, errorInfo)

    // Optionally send error to monitoring service (e.g., Sentry) here
    // if (import.meta.env.PROD) { captureException(error, { extra: errorInfo }) }
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isProduction = import.meta.env.PROD
      const errorMessage = isProduction
        ? 'We encountered an unexpected issue. Our team has been notified.'
        : this.state.error?.message || 'An unexpected error occurred.'

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-white px-4 py-12"
            role="alert"
            aria-live="assertive"
          >
            {/* Decorative background pattern (subtle) */}
            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNjI2NjAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4aC0xMnYxMmgxMlYxOHpNNDggMzBoLTEydjEyaDEyVjMweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl rounded-2xl bg-white/90 backdrop-blur-lg p-8 shadow-card ring-1 ring-brand-500/5 sm:p-12"
            >
              <div className="flex flex-col items-center text-center">
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-light"
                >
                  <AlertTriangle className="h-10 w-10 text-error" aria-hidden="true" />
                </motion.div>

                <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  Something went wrong
                </h1>

                <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-600">
                  {errorMessage}
                </p>

                {!isProduction && this.state.error && (
                  <p className="mt-2 w-full max-w-md rounded-lg bg-neutral-50 p-3 text-left font-mono text-xs text-neutral-700 break-all">
                    {this.state.error.message}
                  </p>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={this.handleReload}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload page
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={this.handleGoHome}
                    className="w-full gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go to Home
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
