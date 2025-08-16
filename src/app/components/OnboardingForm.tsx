'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, type OnboardingFormData } from '../lib/validation'
import { useState, useEffect } from 'react'
import { 
  FiUser, 
  FiMail, 
  FiDollarSign, 
  FiCalendar,
  FiCheck,
  FiAlertCircle,
  FiSend,
  FiLoader
} from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'
import { 
  HiOutlineStar, 
  HiOutlineCode, 
  HiOutlineDeviceMobile 
} from 'react-icons/hi'
import { FaPaintBrush } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES_OPTIONS = [
  { 
    value: 'UI/UX', 
    label: 'UI/UX Design', 
    icon: FaPaintBrush,
    description: 'Craft intuitive user interfaces and seamless experiences'
  },
  { 
    value: 'Branding', 
    label: 'Branding', 
    icon: HiOutlineStar,
    description: 'Build memorable brand identities and visual systems'
  },
  { 
    value: 'Web Dev', 
    label: 'Web Development', 
    icon: HiOutlineCode,
    description: 'Develop robust, scalable web applications'
  },
  { 
    value: 'Mobile App', 
    label: 'Mobile App Development', 
    icon: HiOutlineDeviceMobile,
    description: 'Create native and cross-platform mobile solutions'
  },
] as const

function FormInput({
  id,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  register,
  errors,
  registerOptions = {},
  ...props
}: {
  id: string
  name: keyof OnboardingFormData
  type?: string
  placeholder?: string
  icon: any
  register: any
  errors: any
  registerOptions?: any
  [key: string]: any
}) {
  return (
    <div className="input-group">
      <div className="input-box">
        <input
          {...register(name, registerOptions)}
          id={id}
          type={type}
          placeholder={placeholder}
          className={`glass-input ${errors[name] ? 'error' : ''} ${type === 'date' ? 'date-input' : ''}`}
          aria-invalid={errors[name] ? 'true' : 'false'}
          aria-describedby={errors[name] ? `${id}-error` : undefined}
          {...props}
        />
        <div className="icon" onClick={() => document.getElementById(id)?.focus()}>
          {errors[name] ? (
            <FiAlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Icon className="w-5 h-5 text-white/60 cursor-pointer" />
          )}
        </div>
      </div>
      {errors[name] && (
        <div id={`${id}-error`} className="error-message">
          <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{errors[name].message}</p>
        </div>
      )}
    </div>
  )
}

function ServiceCard({
  service,
  register,
  isSelected,
}: {
  service: (typeof SERVICES_OPTIONS)[number]
  register: any
  isSelected: boolean
}) {
  const IconComponent = service.icon
  return (
    <motion.label
      key={service.value}
      className="service-card cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <input
        {...register('services')}
        type="checkbox"
        value={service.value}
        className="sr-only peer"
      />
      <div className={`service-card-content ${isSelected ? 'selected' : ''}`}>
        <div className={`selection-indicator ${isSelected ? 'selected' : ''}`}>
          {isSelected && <FiCheck className="w-3 h-3 text-white" />}
        </div>
        <div className="service-content">
          <motion.div 
            className={`service-icon ${isSelected ? 'selected' : ''}`}
            animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
          <div className="service-text">
            <h4 className={`service-title ${isSelected ? 'selected' : ''}`}>
              {service.label}
            </h4>
            <p className={`service-description ${isSelected ? 'selected' : ''}`}>
              {service.description}
            </p>
          </div>
        </div>
      </div>
    </motion.label>
  )
}

export default function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
    data?: OnboardingFormData
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      services: [],
      acceptTerms: false,
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const serviceParam = urlParams.get('service')
      
      if (serviceParam && SERVICES_OPTIONS.some(opt => opt.value === serviceParam)) {
        setValue('services', [serviceParam as any])
      }
    }
  }, [setValue])

  const today = new Date().toISOString().split('T')[0]

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ONBOARD_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Form submitted successfully!',
          data,
        })
        reset()
      } else {
        const errorText = await response.text()
        setSubmitStatus({
          type: 'error',
          message: `Submission failed: ${response.status} ${response.statusText}${
            errorText ? ` - ${errorText}` : ''
          }`,
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error: Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedServices = watch('services')

  return (
    <div className="glass-container">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <FiSend className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Let's Build Something Amazing
        </h1>
        <p className="text-white/80 text-lg">
          Share your project details and we'll help bring your vision to life
        </p>
      </motion.div>

      <motion.div 
        className="glass-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${
                submitStatus.type === 'success'
                  ? 'bg-green-500/10 border-green-400/30'
                  : 'bg-red-500/10 border-red-400/30'
              }`}
              role="alert"
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 mt-0.5 ${
                  submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submitStatus.type === 'success' ? 
                    <FiCheck className="w-5 h-5" /> : 
                    <FiAlertCircle className="w-5 h-5" />
                  }
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${
                    submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {submitStatus.message}
                  </p>
                  {submitStatus.type === 'success' && submitStatus.data && (
                    <p className="mt-2 text-sm text-white/60">
                      <strong>Details:</strong> {submitStatus.data.fullName} from{' '}
                      {submitStatus.data.companyName} • Services: {submitStatus.data.services.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            id="fullName"
            name="fullName"
            placeholder="Full Name *"
            icon={FiUser}
            register={register}
            errors={errors}
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Email Address *"
            icon={FiMail}
            register={register}
            errors={errors}
          />

          <FormInput
            id="companyName"
            name="companyName"
            placeholder="Company Name *"
            icon={FaBuilding}
            register={register}
            errors={errors}
          />

          <div className="mb-6">
            <fieldset>
              <legend className="block text-sm font-medium text-white mb-4">
                Services You're Interested In *
              </legend>
              <div className="services-grid">
                {SERVICES_OPTIONS.map((service) => (
                  <ServiceCard
                    key={service.value}
                    service={service}
                    register={register}
                    isSelected={watchedServices?.includes(service.value)}
                  />
                ))}
              </div>
              {errors.services && (
                <div className="mt-4 error-message">
                  <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errors.services.message}</p>
                </div>
              )}
            </fieldset>
          </div>

          <FormInput
            id="budgetUsd"
            name="budgetUsd"
            type="number"
            placeholder="Budget (USD) - Optional"
            icon={FiDollarSign}
            register={register}
            errors={errors}
            min="100"
            max="1000000"
            step="1"
            registerOptions={{
              setValueAs: (value: string) => (value === '' ? undefined : parseInt(value, 10))
            }}
          />

          <FormInput
            id="projectStartDate"
            name="projectStartDate"
            type="date"
            placeholder="Project Start Date *"
            icon={FiCalendar}
            register={register}
            errors={errors}
            min={today}
          />

          <div className="remember-forgot">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                className="accent-white mr-2"
              />
              <span className="text-sm text-white">
                I accept the{' '}
                <a href="#" className="text-white hover:underline">
                  terms and conditions
                </a>{' '}
                *
              </span>
            </label>
            {errors.acceptTerms && (
              <div className="mt-2 error-message">
                <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{errors.acceptTerms.message}</p>
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="glass-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <FiLoader className="w-5 h-5 animate-spin mr-3" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FiSend className="w-5 h-5 mr-3" />
                Submit Project Request
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}