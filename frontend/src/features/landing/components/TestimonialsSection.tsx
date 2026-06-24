import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Aiva has completely transformed our salon. We used to miss at least 3-4 calls a day when all stylists were busy. Now, those missed calls turn into booked appointments.",
    author: "Priya Sharma",
    role: "Owner, Elegance Salon",
    rating: 5
  },
  {
    quote: "The WhatsApp integration is a game-changer. Our patients appreciate getting instant answers to their common queries without having to wait on hold.",
    author: "Dr. Rahul Verma",
    role: "Lead Dentist, Smile Care Clinic",
    rating: 5
  },
  {
    quote: "I run my fitness studio solo. Having Aiva is literally like having a full-time receptionist for a fraction of the cost. It handles all my trial bookings.",
    author: "Anita Desai",
    role: "Founder, Core Fitness",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by business <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>owners everywhere.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-[var(--color-border)] flex flex-col justify-between glass"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-lg italic mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
