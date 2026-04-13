export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-10 bg-blush/30 rounded w-64 mb-3" />
      <div className="h-4 bg-blush/20 rounded w-48 mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-blush p-6 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-blush p-6 h-40" />
        ))}
      </div>
    </div>
  )
}
