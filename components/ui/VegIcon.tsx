interface VegIconProps {
  isVeg: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-4 h-4', dot: 'w-2 h-2', text: 'text-xs' },
  md: { box: 'w-5 h-5', dot: 'w-2.5 h-2.5', text: 'text-sm' },
  lg: { box: 'w-6 h-6', dot: 'w-3 h-3', text: 'text-base' },
};

export default function VegIcon({ isVeg, size = 'md', showLabel = false, className = '' }: VegIconProps) {
  const s = sizeMap[size];
  const color = isVeg ? 'green' : 'red';
  const label = isVeg ? 'Veg' : 'Non-Veg';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className={`${s.box} rounded border-2 flex items-center justify-center flex-shrink-0`}
        style={{ borderColor: isVeg ? '#16a34a' : '#dc2626' }}
        title={label}
        aria-label={label}
      >
        <div
          className={`${s.dot} rounded-full`}
          style={{ backgroundColor: isVeg ? '#16a34a' : '#dc2626' }}
        />
      </div>
      {showLabel && (
        <span
          className={`${s.text} font-medium`}
          style={{ color: isVeg ? '#16a34a' : '#dc2626' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
