import { motion } from 'framer-motion';

const timeline = [
  {
    time: "08:30 AM",
    title: "The Morning Rush",
    description: "You're setting up the shop. The phone rings—it's a new customer wanting to book. Aiva answers instantly and schedules them in for 2 PM.",
    type: "call"
  },
  {
    time: "11:15 AM",
    title: "Mid-day Inquiry",
    description: "A customer messages on WhatsApp asking about pricing. Aiva replies in 2 seconds with the rate card and a booking link.",
    type: "whatsapp"
  },
  {
    time: "03:45 PM",
    title: "Handling the Unexpected",
    description: "You're deep in a session. Another client calls to reschedule. Aiva checks your calendar, finds a new slot, and updates everything automatically.",
    type: "call"
  },
  {
    time: "07:00 PM",
    title: "Closing Time",
    description: "You go home to rest. Aiva continues to answer late-night enquiries and books 3 more appointments while you sleep.",
    type: "system"
  }
];

export default function DayWithAivaSection() {
  return (
    <section id="how-it-works" className="py-32 relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            A day in the life <br />
            <span className="text-gradient">with Aiva.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent -translate-x-1/2"></div>

          <div className="space-y-24">
            {timeline.map((event, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10" style={{ background: 'var(--color-accent)', boxShadow: '0 0 20px var(--color-accent)' }}></div>
                
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
                      {event.time}
                    </span>
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                    <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                      {event.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
