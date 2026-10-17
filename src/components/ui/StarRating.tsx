import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-transform',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClass,
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}
