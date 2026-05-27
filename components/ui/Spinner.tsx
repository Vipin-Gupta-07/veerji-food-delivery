import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'white' | 'gray';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
const colorMap = {
  orange: 'border-brand-orange/30 border-t-brand-orange',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-200 border-t-gray-500',
};

export default function Spinner({ size = 'md', color = 'orange', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeMap[size],
        colorMap[color],
        className
      )}
    />
  );
}

export function FullPageSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center shadow-orange-glow">
          <span className="font-display font-extrabold text-2xl text-white">VJ</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-saffron rounded-lg flex items-center justify-center text-xs animate-spin">
          🍢
        </div>
      </div>
      <Spinner size="md" color="orange" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
