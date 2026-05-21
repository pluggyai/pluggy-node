import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test from project root.
// `quiet: true` suppresses the runtime banner dotenv@17 prints by
// default — keeps Jest output clean.
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test'), quiet: true })
