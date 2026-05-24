/**
 * src/lib/socket.ts
 *
 * Client Socket.IO pour les notifications temps réel.
 *
 * Architecture :
 *  - Instance singleton (une seule connexion par session browser)
 *  - Authentification via JWT passé en query param à la connexion
 *  - Reconnexion automatique avec backoff exponentiel
 *  - Typage fort des événements entrants/sortants
 *
 * Installation requise :
 *   pnpm add socket.io-client
 *
 * Usage (dans NotificationContext.tsx) :
 *   import { createSocket, disconnectSocket, onNotification } from '@/lib/socket'
 *
 *   const socket = createSocket(token)
 *   const cleanup = onNotification((notif) => dispatch(notif))
 *   return () => { cleanup(); disconnectSocket() }
 */

import { io, type Socket } from 'socket.io-client'
import { WS_URL } from '@/lib/constants'
import type { Notification } from '@/types/api'

// ─────────────────────────────────────────────
// TYPES D'ÉVÉNEMENTS
// ─────────────────────────────────────────────

/** Événements émis par le serveur → client */
interface ServerToClientEvents {
  /** Nouvelle notification reçue */
  notification: (payload: Notification) => void
  /** Confirmation de connexion */
  connected: (data: { userId: string }) => void
}

/** Événements émis par le client → serveur */
interface ClientToServerEvents {
  /** Rejoindre la room privée de l'utilisateur */
  join_room: (data: { userId: string }) => void
  /** Marquer une notification comme lue */
  mark_read: (data: { notificationId: string }) => void
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

// ─────────────────────────────────────────────
// SINGLETON
// ─────────────────────────────────────────────

let socketInstance: AppSocket | null = null

/**
 * Crée (ou retourne l'existante) la connexion Socket.IO authentifiée.
 * Le JWT est envoyé dans le query param `token` à la connexion.
 *
 * @param token  JWT Bearer de l'utilisateur connecté
 */
export function createSocket(token: string): AppSocket {
  // Réutilise l'instance si déjà connectée avec le même token
  if (socketInstance?.connected) {
    return socketInstance
  }

  // Déconnecte proprement une ancienne instance
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }

  socketInstance = io(WS_URL, {
    // Auth transmise au handshake (interceptée par JwtWsGuard côté NestJS)
    auth: { token },
    // Fallback en polling si le WebSocket n'est pas disponible
    transports: ['websocket', 'polling'],
    // Reconnexion automatique
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 30_000,
    // Timeout de connexion
    timeout: 10_000,
  }) as AppSocket

  // Logs en développement uniquement
  if (process.env.NODE_ENV === 'development') {
    socketInstance.on('connect', () => {
      console.log('[Socket] Connecté :', socketInstance?.id)
    })
    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Déconnecté :', reason)
    })
    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket] Erreur de connexion :', err.message)
    })
  }

  return socketInstance
}

/**
 * Déconnecte proprement le socket et efface l'instance.
 * À appeler dans le cleanup de NotificationContext.
 */
export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}

/**
 * Retourne l'instance courante sans en créer une nouvelle.
 * Retourne null si la connexion n'a pas encore été initialisée.
 */
export function getSocket(): AppSocket | null {
  return socketInstance
}

/**
 * Vérifie si le socket est actuellement connecté.
 */
export function isSocketConnected(): boolean {
  return socketInstance?.connected ?? false
}

// ─────────────────────────────────────────────
// HELPERS D'ÉVÉNEMENTS
// ─────────────────────────────────────────────

/**
 * Écoute les notifications entrantes.
 * Retourne une fonction de nettoyage à appeler dans le useEffect.
 *
 * @example
 *   const off = onNotification((notif) => addNotification(notif))
 *   return off // cleanup
 */
export function onNotification(
  handler: (notification: Notification) => void
): () => void {
  const socket = socketInstance
  if (!socket) return () => {}

  socket.on('notification', handler)
  return () => socket.off('notification', handler)
}

/**
 * Rejoint la room privée de l'utilisateur pour recevoir ses notifications.
 * À appeler juste après createSocket().
 *
 * @param userId  ID de l'utilisateur connecté
 */
export function joinUserRoom(userId: string): void {
  if (!socketInstance?.connected) return
  socketInstance.emit('join_room', { userId })
}

/**
 * Notifie le serveur qu'une notification a été lue.
 *
 * @param notificationId  ID de la notification
 */
export function emitMarkRead(notificationId: string): void {
  if (!socketInstance?.connected) return
  socketInstance.emit('mark_read', { notificationId })
}
