export type ValidationError = {
  code: string
  message: string
  parameter: string
}

export type ValidationResult = {
  parameters: Record<string, string>
  errors: ValidationError[]
}
