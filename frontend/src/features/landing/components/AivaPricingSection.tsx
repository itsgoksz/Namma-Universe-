import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: '🌱',
    target: 'Perfect for independent businesses',
    price: '₹4,999',
    period: '/ month',
    description: 'Designed for businesses handling up to ~150 customer conversations each month (around 5 customer calls a day).',
    featuresHeader: 'Included',
    features: [
      'Answers every customer call, 24/7',
      'Never miss a booking',
      'Appointment booking & rescheduling',
      'Answers customer questions instantly',
      'Natural, human-like conversations',
      'Calendar integration',
      'Missed-call recovery',
      'Designed for everyday business call volumes',
    ],
    perfectFor: [
      'Salons',
      'Clinics',
      'Spas',
      'Home service businesses',
      'Small offices',
    ],
    promise: 'When you’re busy serving a customer, Aiva answers the next call.',
  },
  {
    name: 'Professional',
    icon: '🚀',
    target: 'Built for growing businesses',
    price: '₹8,999',
    period: '/ month',
    description: 'Designed for businesses handling up to ~350 customer conversations each month.',
    featuresHeader: 'Everything in Starter, plus:',
    features: [
      'Multiple staff calendars',
      'Smarter appointment routing',
      'Customer call summaries',
      'Custom business knowledge',
      'Priority support',
      'Business analytics & booking insights',
      'Follow-up reminders',
      'Personalized greetings',
      'Better handling during busy hours',
    ],
    perfectFor: [
      'Growing salons',
      'Dental clinics',
      'Beauty studios',
      'Fitness centres',
      'Service businesses with multiple employees',
    ],
    promise: 'Your team focuses on customers. Aiva takes care of every incoming call.',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    icon: '🏢',
    target: 'For businesses that never want to miss an opportunity',
    price: 'Custom Pricing',
    period: '',
    description: 'Designed for businesses with high customer call volumes, multiple teams, or multiple locations.',
    featuresHeader: 'Everything in Professional, plus:',
    features: [
      'Multi-location support',
      'Unlimited staff calendars',
      'Custom AI workflows',
      'CRM integration',
      'Custom reporting',
      'Dedicated onboarding',
      'Priority SLA support',
      'White-glove deployment',
      'Dedicated account manager',
      'Custom integrations',
    ],
    perfectFor: [
      'Salon chains',
      'Hospital groups',
      'Large clinics',
      'Franchise businesses',
      'Enterprise service providers',
    ],
    promise: 'Scale operations while preserving a highly personal touch at every location.',
  },
];

export default function AivaPricingSection() {
  return (
    <section className="py-24 relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
            Choose the right Aiva for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-3xl p-8 lg:p-10 border transition-all duration-300 hover:transform hover:-translate-y-2`}
              style={{
                backgroundColor: plan.isPopular ? 'rgba(166, 107, 142, 0.03)' : 'var(--color-bg-secondary)',
                borderColor: plan.isPopular ? 'rgba(166, 107, 142, 0.4)' : 'var(--color-border)',
                boxShadow: plan.isPopular ? '0 10px 40px -10px rgba(166, 107, 142, 0.2)' : 'none'
              }}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: '#A66B8E', color: '#FFF' }}>
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm min-h-[40px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {plan.target}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{plan.period}</span>}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-grow">
                <p className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  {plan.featuresHeader}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#A66B8E' }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Perfect for:
                </p>
                <ul className="space-y-2 mb-8">
                  {plan.perfectFor.map((item, pIndex) => (
                    <li key={pIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  A simple promise
                </p>
                <p className="text-sm font-medium leading-relaxed italic" style={{ color: 'var(--color-text-secondary)' }}>
                  "{plan.promise}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
