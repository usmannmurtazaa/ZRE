import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

// ── Constants ──────────────────────────────────────────────────────────────
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1_000_000 // Very long delay; auto-dismiss is handled by the Toast component

// ── Types ─────────────────────────────────────────────────────────────────
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | { type: ActionType['UPDATE_TOAST']; toast: Partial<ToasterToast> }
  | { type: ActionType['DISMISS_TOAST']; toastId?: ToasterToast['id'] }
  | { type: ActionType['REMOVE_TOAST']; toastId?: ToasterToast['id'] }

interface State {
  toasts: ToasterToast[]
}

// ── State management ──────────────────────────────────────────────────────
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      }
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Core toast function.
 * Pass an `id` to update an existing toast; otherwise a new toast is created.
 */
function toast(props: ToastOptions): {
  id: string
  dismiss: () => void
  update: (props: ToastOptions) => void
} {
  const id = genId()

  const update = (updatedProps: ToastOptions) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...updatedProps, id } as Partial<ToasterToast>,
    })

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
      duration: props.duration ?? 5000,
    } as ToasterToast,
  })

  return { id, dismiss, update }
}

// ── Convenience methods ──────────────────────────────────────────────────
toast.success = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) =>
  toast({ title, variant: 'success', ...options })

toast.error = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) =>
  toast({ title, variant: 'destructive', ...options })

toast.warning = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) =>
  toast({ title, variant: 'warning', ...options })

toast.info = (title: string, options?: Omit<ToastOptions, 'title' | 'variant'>) =>
  toast({ title, variant: 'info', ...options })

// ── Hook ──────────────────────────────────────────────────────────────────
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
