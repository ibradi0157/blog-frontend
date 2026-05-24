import { Globe, Twitter, Github, Linkedin, Youtube, Instagram } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SocialLinksProps {
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const SOCIAL_CONFIG = [
  { key: 'website', icon: Globe, label: 'Site web', color: 'hover:text-[var(--text-primary)]' },
  { key: 'twitter', icon: Twitter, label: 'Twitter / X', color: 'hover:text-sky-400' },
  { key: 'github', icon: Github, label: 'GitHub', color: 'hover:text-[var(--text-primary)]' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-500' },
  { key: 'youtube', icon: Youtube, label: 'YouTube', color: 'hover:text-red-500' },
  { key: 'instagram', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-500' },
] as const;

export function SocialLinks({ className, size = 'md', ...links }: SocialLinksProps) {
  const iconSize = size === 'sm' ? 15 : 18;

  const activeSocials = SOCIAL_CONFIG.filter(({ key }) => links[key as keyof typeof links]);

  if (activeSocials.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {activeSocials.map(({ key, icon: Icon, label, color }) => {
        const href = links[key as keyof typeof links]!;
        const url = href.startsWith('http') ? href : `https://${href}`;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={cn('text-[var(--text-muted)] transition-colors', color)}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}