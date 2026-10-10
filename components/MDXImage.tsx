import type { ImgHTMLAttributes } from 'react'
import NextImage from 'next/image'

const basePath = process.env.BASE_PATH || ''

type MDXImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  width?: number | string
  height?: number | string
  fill?: boolean
}

function toNumber(value?: number | string): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

export default function MDXImage(props: MDXImageProps) {
  const { src = '', alt = '', width, height, fill, ...rest } = props
  const normalizedSrc = `${basePath}${src}`
  const numericWidth = toNumber(width)
  const numericHeight = toNumber(height)
  const hasDimensions = Number.isFinite(numericWidth) && Number.isFinite(numericHeight)

  if (fill || hasDimensions) {
    return (
      <NextImage
        src={normalizedSrc}
        alt={alt}
        width={numericWidth}
        height={numericHeight}
        fill={fill}
        {...rest}
      />
    )
  }

  return <img src={normalizedSrc} alt={alt} loading="lazy" decoding="async" {...rest} />
}
