import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const requireFromScript = createRequire(import.meta.url)
// Pin the patched runtime too: npm install does not apply Yarn patch resolutions.
const expected = '9031a290d77eb691f4f56ee499c0225b8871a9a7b0e31007f98a90dfc71e8651'
const actual = createHash('sha256')
  .update(readFileSync(requireFromScript.resolve('nostr-zap')))
  .digest('hex')

if (actual !== expected) {
  throw new Error(
    'Zap security patch is missing. Run: node .yarn/releases/yarn-3.6.1.cjs install --immutable'
  )
}
