export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="flex flex-col items-center gap-6">
        {/* Gold spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-brand-gold/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-gold animate-spin" />
        </div>

        {/* Brand name with shimmer */}
        <div className="text-center">
          <p className="font-display text-xl font-bold text-brand-gold tracking-wide">
            VicktyKof
          </p>
          <p className="text-xs text-brand-muted mt-1">Chargement...</p>
        </div>
      </div>
    </div>
  );
}
