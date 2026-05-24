import { cn } from '@/lib/cn'

interface PageWrapperProps {
  children:   React.ReactNode
  className?: string
  /** Rétrécir à max-w-3xl (articles, formulaires) */
  narrow?:    boolean
  /** Supprimer le padding vertical */
  noPadding?: boolean
}

export function PageWrapper({ children, className, narrow, noPadding }: PageWrapperProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-7xl',
        !noPadding && 'py-8 sm:py-12',
        className,
      )}
    >
      {children}
    </main>
  )
}
