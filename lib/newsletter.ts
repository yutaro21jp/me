import { Buffer } from 'node:buffer'

const providerVariables = {
  buttondown: ['BUTTONDOWN_API_KEY'],
  resend: ['RESEND_API_KEY', 'RESEND_SEGMENT_ID'],
  mailchimp: ['MAILCHIMP_API_KEY', 'MAILCHIMP_API_SERVER', 'MAILCHIMP_AUDIENCE_ID'],
  convertkit: ['CONVERTKIT_API_KEY', 'CONVERTKIT_FORM_ID'],
  klaviyo: ['KLAVIYO_API_KEY', 'KLAVIYO_LIST_ID'],
  emailoctopus: ['EMAILOCTOPUS_API_KEY', 'EMAILOCTOPUS_LIST_ID'],
  beehiiv: ['BEEHIIV_API_KEY', 'BEEHIIV_PUBLICATION_ID'],
} as const

export type NewsletterProvider = keyof typeof providerVariables

function post(url: string, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
}

// null means the selected provider is unsupported or its configuration is incomplete.
export async function subscribeToNewsletter(
  email: string,
  provider: string
): Promise<Response | null> {
  if (!Object.hasOwn(providerVariables, provider)) return null

  const names = providerVariables[provider as NewsletterProvider]
  const settings: Record<string, string> = {}
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (!value) return null
    settings[name] = value
  }

  switch (provider) {
    case 'buttondown':
      return post(
        'https://api.buttondown.email/v1/subscribers',
        { email_address: email },
        { Authorization: `Token ${settings.BUTTONDOWN_API_KEY}` }
      )

    case 'resend': {
      const url = 'https://api.resend.com/contacts'
      const segmentId = settings.RESEND_SEGMENT_ID
      const headers = { Authorization: `Bearer ${settings.RESEND_API_KEY}` }
      // Omit unsubscribed so this request does not explicitly override a global opt-out.
      const response = await post(url, { email, segments: [{ id: segmentId }] }, headers)
      if (!response.ok) return response

      // Explicitly assign the segment for contacts that already exist, too.
      return fetch(
        `${url}/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
        {
          method: 'POST',
          headers,
          cache: 'no-store',
        }
      )
    }

    case 'mailchimp': {
      const server = settings.MAILCHIMP_API_SERVER
      // Only a Mailchimp data-center prefix may become part of the request host.
      if (!/^us\d+$/.test(server)) return null
      const credentials = Buffer.from(`newsletter:${settings.MAILCHIMP_API_KEY}`).toString('base64')
      return post(
        `https://${server}.api.mailchimp.com/3.0/lists/${encodeURIComponent(settings.MAILCHIMP_AUDIENCE_ID)}/members`,
        { email_address: email, status: 'pending' },
        { Authorization: `Basic ${credentials}` }
      )
    }

    case 'convertkit':
      return post(
        `https://api.convertkit.com/v3/forms/${encodeURIComponent(settings.CONVERTKIT_FORM_ID)}/subscribe`,
        { email, api_key: settings.CONVERTKIT_API_KEY }
      )

    case 'klaviyo':
      return post(
        'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
        {
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              custom_source: 'Website newsletter form',
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email,
                      subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                    },
                  },
                ],
              },
            },
            relationships: { list: { data: { type: 'list', id: settings.KLAVIYO_LIST_ID } } },
          },
        },
        {
          Authorization: `Klaviyo-API-Key ${settings.KLAVIYO_API_KEY}`,
          Accept: 'application/vnd.api+json',
          revision: '2026-10-15',
        }
      )

    case 'emailoctopus':
      return post(
        `https://emailoctopus.com/api/1.6/lists/${encodeURIComponent(settings.EMAILOCTOPUS_LIST_ID)}/contacts`,
        { email_address: email, api_key: settings.EMAILOCTOPUS_API_KEY }
      )

    case 'beehiiv':
      return post(
        `https://api.beehiiv.com/v2/publications/${encodeURIComponent(settings.BEEHIIV_PUBLICATION_ID)}/subscriptions`,
        { email, reactivate_existing: false, send_welcome_email: true },
        { Authorization: `Bearer ${settings.BEEHIIV_API_KEY}` }
      )
  }

  return null
}
