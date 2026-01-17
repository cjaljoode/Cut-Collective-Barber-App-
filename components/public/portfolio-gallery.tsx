"use client"

import { motion } from "framer-motion"

interface PortfolioGalleryProps {
  images: string[]
}

export function PortfolioGallery({ images }: PortfolioGalleryProps) {
  if (images.length === 0) {
    return (
      <p className="text-zinc-500 italic">
        No portfolio images available yet.
      </p>
    )
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((src, index) => (
        <motion.div
          key={`${src}-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="break-inside-avoid rounded-none overflow-hidden border border-zinc-800 bg-zinc-900/50"
        >
          {/* Placeholder for image since portfolio_url may be external */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Portfolio"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      ))}
    </div>
  )
}
