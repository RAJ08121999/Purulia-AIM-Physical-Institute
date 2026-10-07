import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlightWord,
  subtitle,
  align = 'left',
  className
}) => {
  return (
    <div
      className={cn(
        'mb-10',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className="mb-3">
          <Badge variant="saffron" size="sm" pulse>
            {badge}
          </Badge>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight text-white">
        {highlightWord && title.includes(highlightWord) ? (
          <>
            {title.split(highlightWord)[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 underline decoration-amber-500/40 decoration-4 underline-offset-8">
              {highlightWord}
            </span>
            {title.split(highlightWord)[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-gray-400 font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'mt-4 flex items-center gap-2',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <span className="h-1 w-12 bg-amber-500 rounded-full" />
        <span className="h-1 w-3 bg-AIM-army rounded-full" />
      </div>
    </div>
  );
};
