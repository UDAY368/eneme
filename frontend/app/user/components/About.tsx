'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Award, Hammer, Target, Sparkles, Camera, Palette, Scissors, ClipboardCheck } from 'lucide-react';

const STORY = `At Enemme Studios, we honor the golden age of cinema while embracing modern innovation. Our passion for visual storytelling is rooted in the timeless traditions of classic filmmaking, where every frame was crafted with meticulous attention to detail and artistic vision.

From the vintage charm of classic Hollywood to contemporary digital mastery, we bridge eras to create compelling content that resonates across generations. Our commitment to cinematic excellence drives us to deliver exceptional results that stand the test of time.`;

const ABOUT_CARDS = [
  { title: 'Award-Winning', description: 'Recognized excellence in cinematic storytelling with vintage craftsmanship', icon: Award },
  { title: 'Master Craftsmen', description: 'Seasoned artisans with decades of experience in classic film techniques', icon: Hammer },
  { title: 'Results-Driven', description: 'Strategic approach rooted in the timeless principles of effective storytelling', icon: Target },
  { title: 'Timeless Innovation', description: 'Blending classic techniques with modern technology for superior results', icon: Sparkles },
];

const TEAM = [
  { role: 'Director of Photography', title: 'Visual Storytelling Expert', desc: 'Master of light and shadow with 15+ years in cinematography', icon: Camera },
  { role: 'Creative Director', title: 'Concept Development', desc: 'Visionary leader bringing stories to life through innovative concepts', icon: Palette },
  { role: 'Post-Production Lead', title: 'Technical Excellence', desc: 'Award-winning editor with expertise in color grading and sound design', icon: Scissors },
  { role: 'Producer', title: 'Project Management', desc: 'Ensuring seamless execution from pre-production to final delivery', icon: ClipboardCheck },
];

const VALUES = [
  { title: 'Cinematic Excellence', desc: 'Every project is crafted with the precision and artistry of classic cinema', icon: Award },
  { title: 'Timeless Quality', desc: 'Creating content that stands the test of time with enduring appeal', icon: Sparkles },
  { title: 'Client Success', desc: 'Your vision is our mission, delivered with uncompromising dedication', icon: Target },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 bg-cinema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6"><span className="text-cinema-white">ABOUT</span> <span className="text-cinema-gold">ENEMME</span></h2>
          <p className="text-cinema-secondary max-w-2xl mx-auto text-lg mb-4">
            Honoring the golden age of cinema while embracing modern innovation
          </p>
        </motion.div>

        {/* Two column: Image + Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80"
              alt="Film production"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl mb-6 text-cinema-gold">Our Story</h3>
            <p className="text-cinema-secondary leading-relaxed whitespace-pre-line">{STORY}</p>
          </div>
        </motion.div>

        {/* About cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {ABOUT_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4 }}
              className="bg-cinema-card border border-cinema rounded-lg p-6 group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
            >
              <div className="mb-4 w-fit transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                <card.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2">{card.title}</h4>
              <p className="text-cinema-muted text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="mb-24"
        >
          <h3 className="font-display font-bold text-3xl text-center mb-4"><span className="text-cinema-white">Our</span> <span className="text-cinema-gold">Team Members</span></h3>
          <p className="text-cinema-secondary text-center mb-12">Meet the master craftsmen behind every cinematic masterpiece</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4 }}
                className="bg-cinema-card border border-cinema rounded-lg p-6 text-center group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
              >
                <div className="mb-4 w-fit mx-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                  <member.icon className="h-12 w-12 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
                </div>
                <h4 className="font-display font-bold text-lg mb-1">{member.role}</h4>
                <p className="text-cinema-gold text-sm mb-2">{member.title}</p>
                <p className="text-cinema-muted text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <h3 className="font-display font-bold text-3xl text-center mb-12"><span className="text-cinema-white">Our</span> <span className="text-cinema-gold">Values</span></h3>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4 }}
                className="bg-cinema-card border border-cinema rounded-lg p-6 text-center group relative overflow-visible transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
              >
                <div className="mb-4 w-fit mx-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[-8px] group-hover:translate-y-[-8px] group-hover:scale-110">
                  <v.icon className="h-10 w-10 text-cinema-gold drop-shadow-[0_0_8px_rgba(200,169,106,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(200,169,106,0.5)]" />
                </div>
                <h4 className="font-display font-bold text-lg mb-2">{v.title}</h4>
                <p className="text-cinema-muted text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
