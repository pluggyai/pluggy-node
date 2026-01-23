import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test from project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') })
