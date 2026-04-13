import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Eternal — Your Complete Wedding Suite', template: '%s | Eternal' },
  description: 'Beautiful wedding websites, digital invitations, guest RSVP and photo sharing — all in one place.',
  openGraph: {
    title: 'Eternal Wedding Suite',
    description: 'Your complete wedding suite',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-ivory text-deep antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#C4826A', secondary: '#fff' } },
        }} />
      </body>
    </html>
  )
}
