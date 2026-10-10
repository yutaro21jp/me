import { NextRequest, NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'

const BUTTONDOWN_SUBSCRIBERS_URL = 'https://api.buttondown.email/v1/subscribers'
const MAX_BODY_BYTES = 4 * 1024
const MAX_EMAIL_LENGTH = 254
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type NewsletterPayload = {
  email?: unknown
  website?: unknown
}

class PayloadTooLargeError extends Error {}

function json(body: Record<string, string>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function isTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    const requestOrigin = new URL(request.url).origin
    const siteOrigin = new URL(siteMetadata.siteUrl).origin
    return origin === requestOrigin || origin === siteOrigin
  } catch {
    return false
  }
}

async function readLimitedJson(request: NextRequest): Promise<NewsletterPayload> {
  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError()
  }

  const reader = request.body?.getReader()
  if (!reader) return {}

  const chunks: Uint8Array[] = []
  let totalBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    totalBytes += value.byteLength
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel()
      throw new PayloadTooLargeError()
    }
    chunks.push(value)
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  const parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body))
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as NewsletterPayload)
    : {}
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return json({ error: 'Request origin is not allowed.' }, 403)
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase()
  if (contentType !== 'application/json') {
    return json({ error: 'Content-Type must be application/json.' }, 415)
  }

  let payload: NewsletterPayload
  try {
    payload = await readLimitedJson(request)
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json({ error: 'Request body is too large.' }, 413)
    }
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  // Botがハニーポットを埋めた場合は、外部APIを呼ばず成功に見せる。
  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ message: 'Successfully subscribed to the newsletter.' }, 201)
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'A valid email address is required.' }, 400)
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    return json({ error: 'Newsletter service is temporarily unavailable.' }, 503)
  }

  try {
    const response = await fetch(BUTTONDOWN_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status < 500 ? 400 : 502
      return json({ error: 'Unable to subscribe this address.' }, status)
    }

    return json({ message: 'Successfully subscribed to the newsletter.' }, 201)
  } catch {
    return json({ error: 'Newsletter service is temporarily unavailable.' }, 502)
  }
}
