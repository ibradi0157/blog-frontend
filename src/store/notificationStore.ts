/**
 * src/store/notificationStore.ts
 *
 * Store Zustand pour les notifications temps réel et persistées.
 *
 * Sources de données :
 *  1. Chargement initial : GET /notifications (HTTP)
 *  2. Temps réel : événements Socket.IO (injectés par NotificationContext)
 *
 * Usage :
 *   const { notifications, unreadCount, addNotification, markRead } =
 *     useNotificationStore()
 */

import { create } from 'zustand'
import type { Notification } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface NotificationState {
  notifications: Notification[]
  unreadCount:   number
  /** true pendant le chargement initial */
  isLoading:     boolean
  /** true si le chargement initial a eu lieu */
  isLoaded:      boolean
  /** Dernière erreur de chargement */
  error:         string | null
}

interface NotificationActions {
  /** Charge un lot de notifications (réponse HTTP initiale) */
  setNotifications: (notifs: Notification[], unreadCount: number) => void
  /**
   * Ajoute une notification en tête de liste (événement WebSocket).
   * Incrémente le compteur non lu si non lue.
   */
  addNotification:  (notif: Notification) => void
  /** Marque une notification comme lue */
  markRead:         (id: string) => void
  /** Marque toutes les notifications comme lues */
  markAllRead:      () => void
  /** Supprime une notification de la liste */
  remove:           (id: string) => void
  /** Vide complètement la liste */
  clear:            () => void
  /** Met à jour le compteur non-lu (WebSocket unread_count) */
  setUnreadCount:   (count: number) => void
  setLoading:       (loading: boolean) => void
  setError:         (error: string | null) => void
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()((set, get) => ({
  // État initial
  notifications: [],
  unreadCount:   0,
  isLoading:     false,
  isLoaded:      false,
  error:         null,

  // ── setNotifications ──────────────────────────────────────────────────
  setNotifications: (notifs, unreadCount) =>
    set({
      notifications: notifs,
      unreadCount,
      isLoaded: true,
      isLoading: false,
      error: null,
    }),

  // ── addNotification ───────────────────────────────────────────────────
  addNotification: (notif) => {
    const { notifications, unreadCount } = get()
    // Évite les doublons (reconnexion WebSocket)
    if (notifications.some((n) => n.id === notif.id)) return
    set({
      notifications: [notif, ...notifications],
      unreadCount:   notif.isRead ? unreadCount : unreadCount + 1,
    })
  },

  // ── markRead ──────────────────────────────────────────────────────────
  markRead: (id) => {
    const { notifications, unreadCount } = get()
    const target = notifications.find((n) => n.id === id)
    if (!target || target.isRead) return

    set({
      notifications: notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, unreadCount - 1),
    })
  },

  // ── markAllRead ───────────────────────────────────────────────────────
  markAllRead: () =>
    set({
      notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount:   0,
    }),

  // ── remove ────────────────────────────────────────────────────────────
  remove: (id) => {
    const { notifications, unreadCount } = get()
    const target = notifications.find((n) => n.id === id)
    set({
      notifications: notifications.filter((n) => n.id !== id),
      unreadCount:   target && !target.isRead
        ? Math.max(0, unreadCount - 1)
        : unreadCount,
    })
  },

  // ── clear ─────────────────────────────────────────────────────────────
  clear: () =>
    set({ notifications: [], unreadCount: 0, isLoaded: false }),

  setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError:   (error)   => set({ error, isLoading: false }),
}))

// ─────────────────────────────────────────────
// SÉLECTEURS
// ─────────────────────────────────────────────

/** Notifications non lues uniquement */
export const selectUnread = (s: NotificationState) =>
  s.notifications.filter((n) => !n.isRead)

/** Notifications des 7 derniers jours */
export const selectRecent = (s: NotificationState) => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1_000
  return s.notifications.filter(
    (n) => new Date(n.createdAt).getTime() > cutoff
  )
}
