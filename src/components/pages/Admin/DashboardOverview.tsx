import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  CheckCircle,
  TrendingUp,
  Star,
  MapPin,
  MessageSquare,
  Inbox,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { formatPrice } from '@/lib/helpers/currency'

const itemFadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function AnimatedNumber({ value }: { value: number }) {
  // Minimal implementation – use framer-motion useMotionValue and animate if desired
  return <span>{value}</span>
}

interface Props {
  filteredProperties: any[]
  activeProperties: number
  soldProperties: number
  featuredProperties: number
  allAreas: any[]
  filteredLeads: any[]
  leadsToday: number
  thisMonthLeads: number
  portfolioValue: number
  avgPrice: number
  period: string
}

export default function DashboardOverview(props: Props) {
  const {
    filteredProperties,
    activeProperties,
    soldProperties,
    featuredProperties,
    allAreas,
    filteredLeads,
    leadsToday,
    thisMonthLeads,
    portfolioValue,
    avgPrice,
    period,
  } = props

  const cards = [
    {
      title: 'Total Properties',
      value: filteredProperties.length,
      icon: <Home className="h-5 w-5" />,
      desc: `${activeProperties} active`,
      link: '/admin/properties',
    },
    {
      title: 'Active',
      value: activeProperties,
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      desc: 'Currently listed',
      link: '/admin/properties',
    },
    {
      title: 'Sold',
      value: soldProperties,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      desc: `${period === 'all' ? 'All time' : period}`,
      link: '/admin/properties',
    },
    {
      title: 'Featured',
      value: featuredProperties,
      icon: <Star className="h-5 w-5 text-amber-500" />,
      desc: 'Highlighted',
      link: '/admin/properties',
    },
    {
      title: 'Total Areas',
      value: allAreas.length,
      icon: <MapPin className="h-5 w-5" />,
      desc: 'Covered locations',
      link: '/admin/areas',
    },
    {
      title: 'Total Leads',
      value: filteredLeads.length,
      icon: <MessageSquare className="h-5 w-5" />,
      desc: `${leadsToday} today`,
      link: '/admin/leads',
    },
    {
      title: 'New Today',
      value: leadsToday,
      icon: <Inbox className="h-5 w-5 text-purple-500" />,
      desc: 'Fresh inquiries',
      link: '/admin/leads',
    },
    {
      title: 'This Month',
      value: thisMonthLeads,
      icon: <Calendar className="h-5 w-5" />,
      desc: 'Leads this month',
      link: '/admin/leads',
    },
    {
      title: 'Portfolio Value',
      value: portfolioValue,
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
      desc: 'Total value',
      link: '/admin/properties',
      isCurrency: true,
    },
    {
      title: 'Avg. Price',
      value: avgPrice,
      icon: <DollarSign className="h-5 w-5" />,
      desc: 'Active properties',
      link: '/admin/properties',
      isCurrency: true,
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={itemFadeUp}>
          <Link to={card.link}>
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="p-1.5 rounded-full bg-muted group-hover:bg-primary/10 transition">
                  {card.icon}
                </div>
              </div>
              <div className="text-xl font-bold text-foreground">
                {card.isCurrency ? (
                  formatPrice(card.value as number)
                ) : (
                  <AnimatedNumber value={card.value as number} />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
