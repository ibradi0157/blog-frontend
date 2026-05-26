import Image from 'next/image'
import { cn } from '@/lib/cn'

interface AvatarUser {
  email:       string
  username?:   string | null
  displayName?: string
  avatarUrl?:  string | null
}

interface UserAvatarProps {
  user:       AvatarUser
  size?:      'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: { container: 'w-6 h-6',   text: 'text-[10px]' },
  sm: { container: 'w-8 h-8',   text: 'text-xs'     },
  md: { container: 'w-10 h-10', text: 'text-sm'     },
  lg: { container: 'w-14 h-14', text: 'text-base'   },
  xl: { container: 'w-20 h-20', text: 'text-xl'     },
}

const PALETTE = [
  '#5B8CFF','#FF6B6B','#4ADE80','#FFA928','#A78BFA',
  '#34D399','#F472B6','#60A5FA','#FBBF24','#2DD4BF',
]

function getInitials(str: string) {
  return str.slice(0, 2).toUpperCase()
}

function getBgColor(str: string) {
  let hash = 0
  for (const c of str) hash = (hash * 31 + c.charCodeAt(0)) | 0
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const { container, text } = sizes[size]
  const displayName = user.username ?? user.displayName ?? user.email ?? 'User'
  const bg = getBgColor(displayName)

  if (user.avatarUrl) {
    return (
      <span className={cn('relative inline-block rounded-full overflow-hidden shrink-0', container, className)}>
        <Image
          src={user.avatarUrl}
          alt={displayName}
          fill
          sizes="80px"
          className="object-cover"
        />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0', container, text, className)}
      style={{ backgroundColor: bg }}
      aria-label={displayName}
    >
      {getInitials(displayName)}
    </span>
  )
}
