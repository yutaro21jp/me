import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { afterEach, beforeEach, test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { build } from 'esbuild'

const nodeRequire = createRequire(import.meta.url)
const { NextRequest } = nodeRequire('next/server')
const { outputFiles } = await build({
  entryPoints: ['app/api/newsletter/route.ts'],
  bundle: true,
  packages: 'external',
  external: ['@/data/siteMetadata'],
  platform: 'node',
  format: 'cjs',
  write: false,
})
const routeModule = { exports: {} }
const defaultProvider = nodeRequire('../data/siteMetadata.js').newsletter.provider
const metadata = { siteUrl: 'https://yutaro.me', newsletter: { provider: defaultProvider } }
runInNewContext(outputFiles[0].text, {
  require: (specifier) => (specifier === '@/data/siteMetadata' ? metadata : nodeRequire(specifier)),
  module: routeModule,
  exports: routeModule.exports,
  process,
  URL,
  TextDecoder,
  // Route requests always use the per-test mock; no credentials or live APIs are used.
  fetch: (...args) => global.fetch(...args),
})
const { POST } = routeModule.exports

const otherProviders = {
  mailchimp: {
    env: {
      MAILCHIMP_API_KEY: 'test-mailchimp-key',
      MAILCHIMP_API_SERVER: 'us1',
      MAILCHIMP_AUDIENCE_ID: 'test-audience',
    },
    url: 'https://us1.api.mailchimp.com/3.0/lists/test-audience/members',
    body: { email_address: 'reader@example.com', status: 'pending' },
    headers: {
      Authorization: `Basic ${Buffer.from('newsletter:test-mailchimp-key').toString('base64')}`,
    },
  },
  convertkit: {
    env: { CONVERTKIT_API_KEY: 'test-kit-key', CONVERTKIT_FORM_ID: 'test-form' },
    url: 'https://api.convertkit.com/v3/forms/test-form/subscribe',
    body: { email: 'reader@example.com', api_key: 'test-kit-key' },
  },
  klaviyo: {
    env: { KLAVIYO_API_KEY: 'test-klaviyo-key', KLAVIYO_LIST_ID: 'test-list' },
    url: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
    body: {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: 'Website newsletter form',
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email: 'reader@example.com',
                  subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                },
              },
            ],
          },
        },
        relationships: { list: { data: { type: 'list', id: 'test-list' } } },
      },
    },
    headers: { Authorization: 'Klaviyo-API-Key test-klaviyo-key', revision: '2026-10-15' },
    status: 202,
  },
  emailoctopus: {
    env: { EMAILOCTOPUS_API_KEY: 'test-octopus-key', EMAILOCTOPUS_LIST_ID: 'test-list' },
    url: 'https://emailoctopus.com/api/1.6/lists/test-list/contacts',
    body: { email_address: 'reader@example.com', api_key: 'test-octopus-key' },
  },
  beehiiv: {
    env: { BEEHIIV_API_KEY: 'test-beehiiv-key', BEEHIIV_PUBLICATION_ID: 'pub_test' },
    url: 'https://api.beehiiv.com/v2/publications/pub_test/subscriptions',
    body: { email: 'reader@example.com', reactivate_existing: false, send_welcome_email: true },
    headers: { Authorization: 'Bearer test-beehiiv-key' },
  },
}
const envKeys = [
  'NEWSLETTER_PROVIDER',
  'BUTTONDOWN_API_KEY',
  'RESEND_API_KEY',
  'RESEND_SEGMENT_ID',
  ...Object.values(otherProviders).flatMap(({ env }) => Object.keys(env)),
]
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]))
const segmentId = '00000000-0000-4000-8000-000000000001'
let requests
let upstream

beforeEach((t) => {
  for (const key of envKeys) delete process.env[key]
  process.env.BUTTONDOWN_API_KEY = 'test-buttondown-key'
  process.env.RESEND_API_KEY = 'test-resend-key'
  process.env.RESEND_SEGMENT_ID = segmentId
  metadata.newsletter.provider = defaultProvider
  requests = []
  upstream = []
  t.mock.method(global, 'fetch', async (url, options) => {
    requests.push({ url, ...options })
    const response = upstream.shift()
    if (response instanceof Error) throw response
    assert.ok(response, 'Unexpected provider request')
    return response
  })
})

afterEach(() => {
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key]
    else process.env[key] = originalEnv[key]
  }
})

function request(payload = { email: 'reader@example.com' }, options = {}) {
  return new NextRequest('https://yutaro.me/api/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://yutaro.me',
      ...options.headers,
    },
    body: options.body ?? JSON.stringify(payload),
  })
}

function useResend() {
  process.env.NEWSLETTER_PROVIDER = 'resend'
  process.env.RESEND_API_KEY = 'test-resend-key'
  process.env.RESEND_SEGMENT_ID = segmentId
}

function useProvider(provider) {
  if (provider === 'resend') useResend()
  else {
    process.env.NEWSLETTER_PROVIDER = provider
    Object.assign(process.env, otherProviders[provider]?.env)
  }
}

for (const [provider, fixture] of Object.entries(otherProviders)) {
  test(`${provider} sends the documented signup request using only that provider`, async () => {
    useProvider(provider)
    upstream.push(Response.json({ id: 'subscriber' }, { status: fixture.status || 201 }))
    const response = await POST(request())
    assert.equal(response.status, 201)
    assert.equal(requests.length, 1)
    assert.equal(requests[0].url, fixture.url)
    assert.deepEqual(JSON.parse(requests[0].body), fixture.body)
    assert.equal(requests[0].method, 'POST')
    assert.equal(requests[0].cache, 'no-store')
    for (const [header, value] of Object.entries(fixture.headers || {})) {
      assert.equal(requests[0].headers[header], value)
    }
  })

  for (const key of Object.keys(fixture.env)) {
    test(`${provider} rejects missing ${key} without external requests`, async () => {
      useProvider(provider)
      delete process.env[key]
      assert.equal((await POST(request())).status, 503)
      assert.equal(requests.length, 0)
    })
  }
}

for (const provider of ['buttondown', 'resend', ...Object.keys(otherProviders)]) {
  test(`siteMetadata can select ${provider} when the provider environment variable is unset`, async () => {
    useProvider(provider)
    delete process.env.NEWSLETTER_PROVIDER
    metadata.newsletter.provider = provider
    upstream.push(Response.json({ id: 'subscriber' }), Response.json({ id: 'subscriber' }))
    assert.equal((await POST(request())).status, 201)
    assert.equal(requests.length, provider === 'resend' ? 2 : 1)
    const expectedUrl =
      provider === 'resend'
        ? 'https://api.resend.com/contacts'
        : provider === 'buttondown'
          ? 'https://api.buttondown.email/v1/subscribers'
          : otherProviders[provider].url
    assert.equal(requests[0].url, expectedUrl)
  })
}

test('the environment variable takes precedence over siteMetadata', async () => {
  metadata.newsletter.provider = 'mailchimp'
  useResend()
  upstream.push(Response.json({ id: 'contact' }), Response.json({ id: 'contact' }))
  assert.equal((await POST(request())).status, 201)
  assert.equal(requests[0].url, 'https://api.resend.com/contacts')
})

test('form payloads cannot change the configured provider', async () => {
  upstream.push(Response.json({ id: 'subscriber' }), Response.json({ id: 'subscriber' }))
  assert.equal(
    (await POST(request({ email: 'reader@example.com', provider: 'buttondown' }))).status,
    201
  )
  assert.equal(requests.length, 2)
  assert.equal(requests[0].url, 'https://api.resend.com/contacts')
})

test('invalid Mailchimp server prefixes are rejected before sending credentials', async () => {
  useProvider('mailchimp')
  process.env.MAILCHIMP_API_SERVER = 'evil.example/'
  assert.equal((await POST(request())).status, 503)
  assert.equal(requests.length, 0)
})

test('defaults to Resend, even when Buttondown credentials are configured', async () => {
  assert.equal(defaultProvider, 'resend')
  upstream.push(Response.json({ id: 'subscriber' }), Response.json({ id: 'subscriber' }))
  const response = await POST(request({ email: ' reader@example.com ' }))
  assert.equal(response.status, 201)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(requests.length, 2)
  assert.equal(requests[0].url, 'https://api.resend.com/contacts')
  assert.equal(requests[0].headers.Authorization, 'Bearer test-resend-key')
  assert.deepEqual(JSON.parse(requests[0].body), {
    email: 'reader@example.com',
    segments: [{ id: segmentId }],
  })
})

test('blank provider keeps Resend as the default', async () => {
  process.env.NEWSLETTER_PROVIDER = '   '
  upstream.push(Response.json({ id: 'subscriber' }), Response.json({ id: 'subscriber' }))
  assert.equal((await POST(request())).status, 201)
  assert.equal(requests[0].url, 'https://api.resend.com/contacts')
})

test('Resend creates a contact and ensures segment membership without overriding opt-out', async () => {
  useResend()
  process.env.NEWSLETTER_PROVIDER = ' Resend '
  upstream.push(Response.json({ id: 'contact' }), Response.json({ id: 'contact' }))
  const response = await POST(request({ email: 'reader+news@example.com' }))
  assert.equal(response.status, 201)
  assert.equal(requests.length, 2)
  assert.equal(requests[0].url, 'https://api.resend.com/contacts')
  assert.deepEqual(JSON.parse(requests[0].body), {
    email: 'reader+news@example.com',
    segments: [{ id: segmentId }],
  })
  assert.equal(
    requests[1].url,
    `https://api.resend.com/contacts/reader%2Bnews%40example.com/segments/${segmentId}`
  )
  for (const call of requests) {
    assert.equal(call.method, 'POST')
    assert.equal(call.headers.Authorization, 'Bearer test-resend-key')
    assert.equal(call.cache, 'no-store')
  }
  assert.equal(requests[1].body, undefined)
})

for (const [name, configure] of [
  [
    'missing Buttondown key',
    () => {
      useProvider('buttondown')
      delete process.env.BUTTONDOWN_API_KEY
    },
  ],
  [
    'missing Resend key',
    () => {
      useResend()
      delete process.env.RESEND_API_KEY
    },
  ],
  [
    'missing Resend segment',
    () => {
      useResend()
      delete process.env.RESEND_SEGMENT_ID
    },
  ],
  [
    'blank Resend segment',
    () => {
      useResend()
      process.env.RESEND_SEGMENT_ID = ' '
    },
  ],
  [
    'unsupported provider',
    () => {
      useResend()
      process.env.NEWSLETTER_PROVIDER = 'unknown'
    },
  ],
]) {
  test(`${name} fails without contacting any provider`, async () => {
    configure()
    const response = await POST(request())
    assert.equal(response.status, 503)
    assert.equal(requests.length, 0)
  })
}

for (const provider of ['buttondown', 'resend', ...Object.keys(otherProviders)]) {
  for (const [upstreamStatus, expectedStatus] of [
    [429, 429],
    [422, 400],
    [500, 502],
  ]) {
    test(`${provider} maps upstream ${upstreamStatus} to ${expectedStatus}`, async () => {
      useProvider(provider)
      upstream.push(Response.json({ error: 'private provider error' }, { status: upstreamStatus }))
      const response = await POST(request())
      assert.equal(response.status, expectedStatus)
      assert.equal(requests.length, 1)
      assert.equal((await response.text()).includes('private provider error'), false)
    })
  }
}

test('Resend does not report success or fall back to Buttondown when segment assignment fails', async () => {
  useResend()
  upstream.push(Response.json({ id: 'existing-contact' }), Response.json({}, { status: 500 }))
  assert.equal((await POST(request())).status, 502)
  assert.equal(requests.length, 2)
  assert.ok(requests.every(({ url }) => url.startsWith('https://api.resend.com/')))
})

test('network failures produce a generic error without falling back to another provider', async () => {
  useResend()
  upstream.push(new Error('private network details'))
  const response = await POST(request())
  assert.equal(response.status, 502)
  assert.equal(requests.length, 1)
  assert.equal((await response.text()).includes('private network details'), false)
})

for (const [name, makeRequest, status] of [
  [
    'cross-origin request',
    () => request(undefined, { headers: { Origin: 'https://other.example' } }),
    403,
  ],
  [
    'unsupported content type',
    () => request(undefined, { headers: { 'Content-Type': 'text/plain' } }),
    415,
  ],
  ['invalid JSON', () => request(undefined, { body: '{' }), 400],
  ['invalid email', () => request({ email: 'invalid' }), 400],
  [
    'declared oversized body',
    () => request(undefined, { headers: { 'Content-Length': '5000' } }),
    413,
  ],
  ['streamed oversized body', () => request({ email: 'x'.repeat(5000) }), 413],
  ['honeypot', () => request({ email: 'invalid', website: 'spam.example' }), 201],
]) {
  test(`${name} never reaches an external API`, async () => {
    useResend()
    assert.equal((await POST(makeRequest())).status, status)
    assert.equal(requests.length, 0)
  })
}
