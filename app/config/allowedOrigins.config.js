require('dotenv').config()

// ALLOWED_ORIGINS is a comma-separated list. Entries may contain "*", which
// matches one DNS label segment (letters, digits, hyphens - never a dot), e.g.
//   https://demo-testing-johns-*-my-team.vercel.app
const entries = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const escapeRegex = (text) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&')

const exactOrigins = entries.filter((origin) => !origin.includes('*'))
const patternOrigins = entries
  .filter((origin) => origin.includes('*'))
  .map((origin) => new RegExp(`^${escapeRegex(origin).replace(/\*/g, '[a-z0-9-]+')}$`, 'i'))

const isAllowedOrigin = (origin) =>
  Boolean(origin) &&
  (exactOrigins.includes(origin) || patternOrigins.some((pattern) => pattern.test(origin)))

module.exports = { isAllowedOrigin }
