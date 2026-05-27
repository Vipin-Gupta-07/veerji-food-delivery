import { Tag } from 'lucide-react';

interface OfferBadgeProps {
  text: string;
  variant?: 'green' | 'orange' | 'blue';
  className?: string;
}

const variantMap = {
  green: 'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function OfferBadge({ text, variant = 'green', className = '' }: OfferBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${variantMap[variant]} ${className}`}
    >
      <Tag size={11} />
      <span>{text}</span>
    </div>
  );
}
