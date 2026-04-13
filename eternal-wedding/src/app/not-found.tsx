import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-8">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-light text-blush mb-4">404</p>
        <h1 className="font-display text-3xl font-light text-deep mb-3">Page not found</h1>
        <p className="text-slate text-sm leading-relaxed mb-8">
          This page doesn't exist, or the wedding you're looking for may not be published yet.
        </p>
        <Link href="/" className="btn-primary">Back to Eternal</Link>
      </div>
    </div>
  )
}
