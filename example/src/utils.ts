export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const PLUGGY_BANK_CONNECTOR = 0
export const PLUGGY_BANK_CREDENTIALS = {
  user: 'user-ok',
  password: 'password-ok',
}
