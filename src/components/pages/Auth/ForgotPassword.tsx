import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { Seo } from '@/components/atoms/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export const ForgotPassword = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Check your inbox.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Forgot Password"
        description="Reset your Zain Real Estate account password"
        noindex
        nofollow
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 sm:px-6 lg:px-8 py-12">
        {/* Background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
          className="w-full max-w-md relative z-10"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md">
                <img
                  src="/favicon.png"
                  alt="Zain Real Estate"
                  className="h-8 w-8 rounded-lg object-contain shadow-sm"
                />
              </div>
              <span
                className="text-xl sm:text-2xl font-regular tracking-tight text-[#C6A972]"
                style={{ fontFamily: "'Alata', sans-serif" }}
              >
                Zain Real Estate
              </span>
            </Link>
          </motion.div>

          {/* Card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-border bg-card shadow-card p-8"
          >
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
              Reset your password
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            {/* Success message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 p-4 flex items-start gap-3"
                  role="status"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex items-start gap-3"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {!message && (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                      aria-describedby={error ? 'reset-error' : undefined}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 font-semibold text-sm"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send reset link
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* Back to sign in */}
            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPassword
