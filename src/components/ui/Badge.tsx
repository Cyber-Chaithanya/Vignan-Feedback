import React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
        secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        outline: 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
