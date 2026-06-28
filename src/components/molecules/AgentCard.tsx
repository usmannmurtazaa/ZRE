import { motion } from 'framer-motion'
import { User, Agent } from '@/types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MessageCircle, Award, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/helpers/cn'

interface AgentCardProps {
  agent: User & Partial<Agent>
  className?: string
  variant?: 'default' | 'compact'
}

const springTransition = { type: 'spring', stiffness: 300, damping: 20 }

export const AgentCard = ({ agent, className, variant = 'default' }: AgentCardProps) => {
  const initials =
    agent.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2) || 'A'

  const isCompact = variant === 'compact'

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group relative rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-card hover:border-brand-200/50',
        isCompact ? 'p-4' : 'p-6',
        className
      )}
      aria-label={`Agent: ${agent.displayName}`}
      itemScope
      itemType="https://schema.org/RealEstateAgent"
    >
      {/* Featured badge */}
      {agent.isFeatured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2.5 right-4 z-10"
        >
          <Badge className="bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 border-brand-200/50 backdrop-blur-sm font-medium text-xs tracking-wide">
            <Award className="w-3.5 h-3.5 mr-1" />
            Top Agent
          </Badge>
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar with subtle ring */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={springTransition}
          className="relative shrink-0"
        >
          <Avatar className="h-20 w-20 border-2 border-neutral-100 ring-2 ring-transparent group-hover:ring-brand-500/20 transition-all duration-300">
            <AvatarImage src={agent.photoURL || undefined} alt={agent.displayName ?? undefined} />
            <AvatarFallback className="bg-brand-50 text-brand-700 font-serif text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4
            className="font-serif text-xl font-semibold text-neutral-900 leading-tight mb-1"
            itemProp="name"
          >
            {agent.displayName}
          </h4>

          {agent.experienceYears !== undefined && agent.experienceYears > 0 && (
            <p className="text-sm text-neutral-500 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-500/60" />
              {agent.experienceYears}+ years of trust
            </p>
          )}

          {agent.bio && !isCompact && (
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {agent.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[90px] border-neutral-200 bg-neutral-50 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-neutral-700 transition-all duration-200 group/btn"
          asChild
        >
          <a
            href={`tel:${agent.phoneNumber || SITE_CONFIG.phone}`}
            aria-label={`Call ${agent.displayName}`}
            className="items-center"
          >
            <Phone className="w-4 h-4 mr-2 text-brand-500 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Call</span>
          </a>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[90px] border-neutral-200 bg-neutral-50 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-neutral-700 transition-all duration-200 group/btn"
          asChild
        >
          <a
            href={`mailto:${agent.email || SITE_CONFIG.email}`}
            aria-label={`Email ${agent.displayName}`}
            className="items-center"
          >
            <Mail className="w-4 h-4 mr-2 text-brand-500 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Email</span>
          </a>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[90px] border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-800 transition-all duration-200 group/btn"
          asChild
        >
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${agent.displayName} on WhatsApp`}
            className="items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-emerald-600 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>
        </Button>
      </div>

      {/* Optional social links or additional CTA */}
      {agent.socialLinks && Object.keys(agent.socialLinks).length > 0 && !isCompact && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex gap-3">
            {Object.entries(agent.socialLinks).map(([platform, url]) =>
              url ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-brand-600 transition-colors"
                  aria-label={platform}
                >
                  {/* You could render icons based on platform if needed */}
                </a>
              ) : null
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-brand-600 hover:text-brand-800"
            asChild
          >
            <a href={`/agents/${agent.uid || ''}`}>
              View Profile <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      )}
    </motion.article>
  )
}

export default AgentCard
