import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = '🍽️',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center px-4 ${className}`}>
      <div className="text-6xl mb-4 animate-bounce-sm">{icon}</div>
      <h3 className="font-display font-bold text-xl text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">{description}</p>
      )}
      {(actionLabel && actionHref) ? (
        <Link href={actionHref} className="btn-primary text-sm py-2.5">
          {actionLabel}
        </Link>
      ) : (actionLabel && onAction) ? (
        <button onClick={onAction} className="btn-primary text-sm py-2.5">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
