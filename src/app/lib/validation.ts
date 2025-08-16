import { z } from 'zod'

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be no more than 80 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Full name can only contain letters, spaces, apostrophes, and hyphens'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be no more than 100 characters'),
  services: z
    .array(z.enum(['UI/UX', 'Branding', 'Web Dev', 'Mobile App']))
    .min(1, 'Please select at least one service'),
  budgetUsd: z
    .number()
    .int('Budget must be a whole number')
    .min(100, 'Budget must be at least $100')
    .max(1000000, 'Budget must be no more than $1,000,000')
    .optional()
    .or(z.literal('')),
  projectStartDate: z
    .string()
    .min(1, 'Project start date is required')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Project start date must be today or later'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>