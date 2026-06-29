import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      icon: "🌱",
      target: "Perfect for independent businesses",
      price: "₹4,999",
      period: " / month",
      description: "Designed for businesses handling up to ~150 customer conversations each month (around 5 customer calls a day).",
      features: [
        "Answers every customer call, 24/7",
        "Never miss a booking",
        "Appointment booking & rescheduling",
        "Answers customer questions instantly",
        "Natural, human-like conversations",
        "Calendar integration",
        "Missed-call recovery",
        "Designed for everyday business call volumes"
      ],
      idealFor: [
        "Salons",
        "Clinics",
        "Spas",
        "Home service businesses",
        "Small offices"
      ],
      promise: "When you’re busy serving a customer, Aiva answers the next call."
    },
    {
      name: "Professional",
      icon: "🚀",
      target: "Built for growing businesses",
      price: "₹8,999",
      period: " / month",
      description: "Designed for businesses handling up to ~350 customer conversations each month.",
      featuresTitle: "Everything in Starter, plus:",
      features: [
        "Multiple staff calendars",
        "Smarter appointment routing",
        "Customer call summaries",
        "Custom business knowledge",
        "Priority support",
        "Business analytics & booking insights",
        "Follow-up reminders",
        "Personalized greetings",
        "Better handling during busy hours"
      ],
      idealFor: [
        "Growing salons",
        "Dental clinics",
        "Beauty studios",
        "Fitness centres",
        "Service businesses with multiple employees"
      ],
      promise: "Your team focuses on customers. Aiva takes care of every incoming call.",
      highlighted: true
    },
    {
      name: "Enterprise",
      icon: "🏢",
      target: "For businesses that never want to miss an opportunity",
      price: "Custom",
      period: " Pricing",
      description: "Designed for businesses with high customer call volumes, multiple teams, or multiple locations.",
      featuresTitle: "Everything in Professional, plus:",
      features: [
        "Multi-location support",
        "Unlimited staff calendars",
        "Custom AI workflows",
        "CRM integration",
        "Custom reporting",
        "Dedicated onboarding",
        "Priority SLA support",
        "White-glove deployment",
        "Dedicated account manager",
        "Custom integrations"
      ],
      idealFor: [
        "Salon chains",
        "Hospital groups",
        "Large clinics",
        "Franchise businesses",
        "Enterprise service providers"
      ],
      promise: "Every branch. Every team. Every customer. Every call answered."
    }
  ];

  return (
    <section id="pricing" className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'var(--color-accent-light)' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px]" style={{ background: 'var(--color-accent-subtle)' }} />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, transparent <br />
            <span className="text-gradient">pricing for everyone.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Choose the plan that fits your business scale. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-2xl flex flex-col ${plan.highlighted ? 'glass border-2 shadow-2xl relative' : 'glass border'}`}
              style={{
                background: plan.highlighted ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                borderColor: plan.highlighted ? 'var(--color-accent)' : 'var(--color-border)',
                transform: plan.highlighted ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{plan.icon}</span>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <p className="text-sm font-medium mb-6" style={{ color: 'var(--color-accent)' }}>{plan.target}</p>
                
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>{plan.period}</span>
                </div>
                
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{plan.description}</p>
              </div>

              <div className="mb-8 flex-1">
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                  {plan.featuresTitle || "Included"}
                </h4>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--color-success)' }} />
                      <span style={{ color: 'var(--color-text-primary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                  Perfect for
                </h4>
                <ul className="space-y-2 list-disc list-inside text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  {plan.idealFor.map((item, iIndex) => (
                    <li key={iIndex}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-sm italic text-center font-medium" style={{ color: 'var(--color-text-primary)' }}>
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
