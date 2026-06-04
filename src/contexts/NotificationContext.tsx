'use client'

/**
 * src/contexts/NotificationContext.tsx
 *
 * Provider pour les notifications temps réel.
 *
 * Responsabilités :
 *  - Charger les notifications initiales via GET /notifications (HTTP)
 *  - Ouvrir la connexion Socket.IO quand l'utilisateur se connecte
 *  - Pousser les nouvelles notifications dans notificationStore
 *  - Fermer le socket proprement à la déconnexion
 *
 * Doit être placé APRÈS AuthProvider dans app/layout.tsx.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import {
  createSocket,
  disconnectSocket,
  onNotification,
  onUnreadCount,
  joinUserRoom,
} from '@/lib/socket'
import api from '@/lib/api-client'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface NotificationContextValue {
  /** Recharge les notifications depuis l'API */
  refresh: () => Promise<void>
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null)

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { token, user, isAuthenticated } = useAuthStore()
  const { setNotifications, addNotification, setUnreadCount, setLoading, setError } =
    useNotificationStore()

  const hasFetchedRef  = useRef(false)
  // ── FIX: track whether WE created the socket this render ──────────────
  const socketActiveRef = useRef(false)

  // ── Chargement initial des notifications ─────────────────────────────────
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const res = await api.notifications.getAll({ limit: 50 })
      setNotifications(res.data, res.unreadCount)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement'
      setError(msg)
    }
  }, [isAuthenticated, setNotifications, setLoading, setError])

  // ── Disconnect when user logs out ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket()
      socketActiveRef.current = false
      hasFetchedRef.current   = false
    }
  }, [isAuthenticated])

  // ── WebSocket + initial HTTP fetch ────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token || !user) return

    // Initial HTTP fetch (once per session)
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      void refresh()
    }

    // ── FIX: avoid creating duplicate sockets in React StrictMode ──────
    // StrictMode unmounts+remounts effects in dev. We guard with a ref so
    // we only create one socket per authentication session.
    if (socketActiveRef.current) return
    socketActiveRef.current = true

    const socket = createSocket(token)

    // Silently swallow connection errors to avoid terminal spray
    // socket.io will handle retries automatically (reconnectionAttempts: 10)
    const handleConnectError = (err: Error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Socket] Connexion impossible (retry automatique):', err.message)
      }
    }
    socket.on('connect_error', handleConnectError)

    // Join private room on (re)connect
    const handleConnect = () => {
      joinUserRoom(user.id)
    }
    socket.on('connect', handleConnect)

    // If already connected, join immediately
    if (socket.connected) {
      joinUserRoom(user.id)
    }

    // Listen for incoming notifications
    const offNotification = onNotification((notif) => {
      addNotification(notif)
    })

    // ── FIX: cleanup removes listeners but does NOT disconnect the socket.
    // Disconnecting in cleanup causes the StrictMode double-mount to kill
    // the socket before the second mount has a chance to use it.
    // The socket is only disconnected in the isAuthenticated=false effect above.
    return () => {
      offNotification()
      offUnreadCount()
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleConnectError)
      socketActiveRef.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, user?.id])

  return (
    <NotificationContext.Provider value={{ refresh }}>
      {children}
    </NotificationContext.Provider>
  )
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      'useNotificationContext() doit être utilisé dans un <NotificationProvider>'
    )
  }
  return ctx
}
