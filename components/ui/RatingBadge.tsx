import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  showCount?: boolean;
  count?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function RatingBadge({
  rating,
  showCount = false,
  count,
  size = 'md',
  className = '',
}: RatingBadgeProps) {
  const isGood = rating >= 4.0;
  const isMid = rating >= 3.5 && rating < 4.0;

  const bgColor = isGood
    ? 'bg-green-50 text-green-700'
    : isMid
    ? 'bg-yellow-50 text-yellow-700'
    : 'bg-red-50 text-red-600';

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg font-bold ${
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'
      } ${bgColor} ${className}`}
    >
      <Star
        size={size === 'sm' ? 10 : 12}
        fill="currentColor"
        className="flex-shrink-0"
      />
      <span>{rating.toFixed(1)}</span>
      {showCount && count && (
        <span className="font-normal opacity-70">({count})</span>
      )}
    </div>
  );
}
