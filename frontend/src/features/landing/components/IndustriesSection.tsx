import { motion } from 'framer-motion';

const industries = [
  {
    name: "Salons & Spas",
    description: "Manage bookings for multiple stylists, handle service inquiries, and send appointment reminders automatically.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Clinics",
    description: "Handle patient queries with empathy, schedule consultations, and provide post-care instructions securely.",
    image: "/clinic-reception.png"
  },
  {
    name: "Gyms & Studios",
    description: "Book trial classes, answer membership questions, and follow up with leads immediately.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Home Services",
    description: "Capture leads while you're on the job. Aiva takes down requirements and schedules your visits.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800"
  }
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for businesses <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>that run on relationships.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[3/2]"
            >
              <div className="absolute inset-0">
                <img 
                  src={industry.image} 
                  alt={industry.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <h3 className="text-3xl font-bold text-white mb-4">{industry.name}</h3>
                <p className="text-lg text-white/80 max-w-lg">
                  {industry.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
