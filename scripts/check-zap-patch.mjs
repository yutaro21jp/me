import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const requireFromScript = createRequire(import.meta.url)
// Pin the patched runtime too: npm install does not apply Yarn patch resolutions.
const expected = '0079b32c9c716202760017efe12ca4287df49acda5880e7c7b5d7d0d1bc94ab9'
const actual = createHash('sha256')
  .update(readFileSync(requireFromScript.resolve('nostr-zap')))
  .digest('hex')

if (actual !== expected) {
  throw new Error(
    'Zap security patch is missing. Run: node .yarn/releases/yarn-3.6.1.cjs install --immutable'
  )
}
