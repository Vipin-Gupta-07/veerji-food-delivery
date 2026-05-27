export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      {/* Animated logo */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-orange rounded-2xl flex items-center justify-center shadow-orange-glow animate-bounce-sm">
          <span className="font-display font-extrabold text-3xl text-white">VJ</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand-saffron rounded-xl flex items-center justify-center text-sm animate-spin">
          🍢
        </div>
      </div>

      {/* Spinner */}
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-orange animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="text-gray-400 text-sm font-medium">Preparing your experience...</p>
    </div>
  );
}
