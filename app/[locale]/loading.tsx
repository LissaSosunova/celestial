export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-serif italic text-xl text-gold">Loading...</p>
    </div>
  );
}