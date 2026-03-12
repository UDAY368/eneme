'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const CONTACTS = [
  {
    icon: Phone,
    title: 'Phone',
    primary: '+91 8341929712',
    secondary: 'Available 24/7 for urgent projects',
  },
  {
    icon: Mail,
    title: 'Email',
    primary: 'info@enemmestudios.com',
    secondary: 'We respond within 2 hours',
  },
  {
    icon: MapPin,
    title: 'Studio',
    primary: '201, pancharatan residency, shiridi Sai nagar colony, manikonda, 500089',
    secondary: '',
  },
  {
    icon: Clock,
    title: 'Hours',
    primary: 'Mon-Fri: 9AM-8PM',
    secondary: 'Sat-Sun: 10AM-6PM | Extended hours for productions',
  },
];

export default function GetInTouch() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="get-in-touch" className="py-24 bg-cinema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6"><span className="text-cinema-white">GET IN</span> <span className="text-cinema-gold">TOUCH</span></h2>
          <p className="text-cinema-secondary max-w-2xl mx-auto text-lg">
            Ready to create your cinematic masterpiece? Let&apos;s craft something timeless together
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACTS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 text-center group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <div className="mb-4 w-fit mx-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                <item.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-cinema-white">{item.primary}</p>
              {item.secondary && <p className="text-cinema-muted text-sm mt-1">{item.secondary}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
