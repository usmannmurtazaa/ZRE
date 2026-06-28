/**
 * Analytics Service
 *
 * Wraps Google Analytics 4 (via Firebase Analytics) event logging
 * for all key user interactions on the Zain Real Estate platform.
 *
 * The service is designed to be **fire-and-forget** – it never throws,
 * even when Analytics isn't initialised. Events are silently dropped
 * if the Analytics instance isn't available.
 *
 * @module analyticsService
 */

import { logEvent, type Analytics } from 'firebase/analytics'
import { analytics as analyticsPromise } from '@/config/firebase'

// ── Internal State ─────────────────────────────────────────────────────

/**
 * Resolved Analytics instance.
 * Initially null until the async initialisation completes.
 */
let analyticsInstance: Analytics | null = null

// Initialise asynchronously
analyticsPromise
  .then((instance) => {
    analyticsInstance = instance
  })
  .catch(() => {
    // Analytics not supported – silently ignore
  })

type EventParams = Record<string, unknown>

// ── Helper ─────────────────────────────────────────────────────────────

/**
 * Safely logs an event to GA4.
 * If Analytics hasn't loaded yet, the event is silently dropped.
 */
function trackEvent(eventName: string, params?: EventParams): void {
  if (!analyticsInstance) return

  try {
    logEvent(analyticsInstance, eventName, params)
  } catch {
    // Never crash the app because of analytics failures
  }
}

// ── Public API ─────────────────────────────────────────────────────────

export const analyticsService = {
  /**
   * Track a page view.
   * Should be called on every route change.
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    })
  },

  /**
   * Track a property search event.
   *
   * @param query - The search query string.
   * @param filters - Active filters object.
   */
  trackSearch(query: string, filters: Record<string, unknown>): void {
    trackEvent('search_performed', {
      search_query: query,
      filters,
    })
  },

  /**
   * Track a filter change on the properties listing page.
   */
  trackFilterApplied(filterType: string, value: unknown): void {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: String(value),
    })
  },

  /**
   * Track a property detail view.
   */
  trackPropertyView(propertyId: string, propertyTitle: string): void {
    trackEvent('property_view', {
      property_id: propertyId,
      property_title: propertyTitle,
    })
  },

  /**
   * Track a successful lead (inquiry) submission.
   */
  trackLeadSubmit(propertyId: string, source: string): void {
    trackEvent('lead_submitted', {
      property_id: propertyId,
      source,
    })
  },

  /**
   * Track when an agent marks a lead as contacted.
   */
  trackLeadContacted(leadId: string): void {
    trackEvent('lead_contacted', {
      lead_id: leadId,
    })
  },

  /**
   * Track a lead conversion (deal closed).
   */
  trackLeadConverted(leadId: string): void {
    trackEvent('lead_converted', {
      lead_id: leadId,
    })
  },

  /**
   * Track a favorite toggle (add / remove).
   */
  trackFavorite(propertyId: string, action: 'add' | 'remove'): void {
    trackEvent('favorite_toggle', {
      property_id: propertyId,
      action,
    })
  },

  /**
   * Track WhatsApp button click.
   */
  trackWhatsAppClick(propertyId?: string): void {
    trackEvent('whatsapp_click', {
      property_id: propertyId || 'site_contact',
    })
  },

  /**
   * Track phone number click.
   */
  trackPhoneClick(propertyId?: string): void {
    trackEvent('phone_click', {
      property_id: propertyId || 'site_contact',
    })
  },

  /**
   * Track a successful user registration (email or Google).
   */
  trackRegistration(method: 'email' | 'google'): void {
    trackEvent('registration', {
      method,
    })
  },

  /**
   * Track a successful login (email or Google).
   */
  trackLogin(method: 'email' | 'google'): void {
    trackEvent('login', {
      method,
    })
  },

  /**
   * Track a generic conversion (e.g., deal finalised).
   */
  trackConversion(propertyId: string, value?: number): void {
    trackEvent('conversion', {
      property_id: propertyId,
      value,
    })
  },

  /**
   * Track sharing of a property.
   */
  trackShare(propertyId: string, method: 'copy' | 'native' | 'social'): void {
    trackEvent('share_clicked', {
      property_id: propertyId,
      method,
    })
  },

  /**
   * Track image gallery interactions (e.g., swipe, lightbox open).
   */
  trackImageView(propertyId: string, imageIndex?: number): void {
    trackEvent('image_view', {
      property_id: propertyId,
      image_index: imageIndex ?? 0,
    })
  },

  /**
   * Track when a user logs out.
   */
  trackLogout(): void {
    trackEvent('logout')
  },

  /**
   * Track custom events (extensibility point).
   */
  trackCustomEvent(eventName: string, params?: EventParams): void {
    trackEvent(eventName, params)
  },
}

export default analyticsService
