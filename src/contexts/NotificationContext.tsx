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
  const { setNotifications, addNotification, setLoading, setError } =
    useNotificationStore()

  // Ref pour éviter les doubles fetch en StrictMode
  const hasFetchedRef = useRef(false)

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

  // ── Connexion WebSocket + écoute notifications ────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token || !user) {
      disconnectSocket()
      hasFetchedRef.current = false
      return
    }

    // Chargement HTTP initial (une seule fois par session)
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      void refresh()
    }

    // Connexion WebSocket
    const socket = createSocket(token)

    // Rejoindre la room privée dès la connexion
    socket.on('connect', () => {
      joinUserRoom(user.id)
    })

    // Si déjà connecté, rejoindre directement
    if (socket.connected) {
      joinUserRoom(user.id)
    }

    // Écoute des notifications entrantes
    const offNotification = onNotification((notif) => {
      addNotification(notif)
    })

    return () => {
      offNotification()
      disconnectSocket()
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
