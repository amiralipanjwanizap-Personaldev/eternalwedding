import { notFound } from 'next/navigation'
import { getWeddingBySlug } from '@/lib/data'
import { WeddingPublicPage } from '@/components/wedding/WeddingPublicPage'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wedding = await getWeddingBySlug(params.slug)
  if (!wedding) return { title: 'Wedding' }
  return {
    title: `${wedding.partner1_name} & ${wedding.partner2_name}`,
    description: wedding.story ?? `Join us for our special day`,
    openGraph: {
      title: `${wedding.partner1_name} & ${wedding.partner2_name}`,
      description: wedding.story ?? `Join us for our special day`,
      images: wedding.cover_image_url ? [wedding.cover_image_url] : [],
    },
  }
}

export default async function WeddingPage({ params }: Props) {
  const wedding = await getWeddingBySlug(params.slug)
  if (!wedding) notFound()

  return <WeddingPublicPage wedding={wedding} />
}
