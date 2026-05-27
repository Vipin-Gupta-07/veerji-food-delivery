import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center text-center px-4 pt-20">
      {/* Animated emoji */}
      <div className="text-8xl mb-6 animate-bounce">🍢</div>

      <div className="relative mb-4">
        <span className="font-display font-extrabold text-[120px] leading-none text-brand-orange/10 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <h1 className="font-display font-extrabold text-4xl text-brand-dark">Page Not Found</h1>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-lg mb-2 max-w-sm">
        Looks like this page went missing — just like the last piece of chaap! 😄
      </p>
      <p className="text-gray-400 text-sm mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primary flex items-center gap-2">
          🏠 Go Home
        </Link>
        <Link href="/restaurant" className="btn-outline flex items-center gap-2">
          🍽️ Browse Menu
        </Link>
      </div>
    </div>
  );
}
