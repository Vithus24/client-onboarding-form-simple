import { onboardingSchema } from '../lib/validation'

describe('Onboarding Form Validation', () => {
  const validData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    companyName: 'Acme Corp',
    services: ['UI/UX'],
    budgetUsd: 5000,
    projectStartDate: '2025-12-01',
    acceptTerms: true,
  }

  test('validates correct data', () => {
    const result = onboardingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  test('rejects invalid full name', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      fullName: 'A', // Too short
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('at least 2 characters')
  })

  test('rejects invalid email', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('valid email')
  })

  test('rejects empty services array', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      services: [],
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('at least one service')
  })

  test('rejects budget outside range', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      budgetUsd: 50, // Too low
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('at least $100')
  })

  test('rejects past dates', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      projectStartDate: '2020-01-01', // Past date
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('today or later')
  })

  test('rejects unchecked terms', () => {
    const result = onboardingSchema.safeParse({
      ...validData,
      acceptTerms: false,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('accept the terms')
  })

  test('allows optional budget to be undefined', () => {
    const { budgetUsd, ...dataWithoutBudget } = validData
    const result = onboardingSchema.safeParse(dataWithoutBudget)
    expect(result.success).toBe(true)
  })
})