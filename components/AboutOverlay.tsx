import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Instagram, Linkedin, ArrowRight } from 'lucide-react';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-stone-950 text-stone-50 flex flex-col overflow-hidden"
        >
          {/* Header within Overlay */}
          <div className="flex justify-between items-center p-8 md:p-12">
            <div className="text-xl tracking-widest font-bold uppercase">Sinnyun</div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-full transition-colors group"
            >
              <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-12 overflow-y-auto">
            <div className="md:w-1/2 flex flex-col justify-center space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-8xl font-serif leading-tight"
              >
                Creating digital <br />
                <span className="italic text-stone-400">silence</span> amidst <br />
                the noise.
              </motion.h2>
            </div>

            <div className="md:w-1/2 flex flex-col justify-center space-y-12">
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="space-y-6 text-lg md:text-xl font-light text-stone-300 max-w-xl"
              >
                <p>
                  I am Sinnyun, a multidisciplinary designer based in Tokyo. My work bridges the gap between brutalist architecture principles and ephemeral digital experiences.
                </p>
                <p>
                  With over 10 years of experience in visual design, photography, and interactive media, I strive to strip away the unnecessary, leaving only pure emotion and function.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-sm uppercase tracking-widest text-stone-500">Contact</h3>
                <a href="mailto:hello@sinnyun.design" className="flex items-center gap-4 text-2xl hover:text-stone-400 transition-colors group">
                  <Mail className="group-hover:scale-110 transition-transform" /> hello@sinnyun.design
                </a>
                <div className="flex gap-6 pt-4">
                  <a href="#" className="hover:text-stone-400 transition-colors"><Instagram size={28} /></a>
                  <a href="#" className="hover:text-stone-400 transition-colors"><Linkedin size={28} /></a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8"
              >
                 <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-4">Selected Clients</h3>
                 <ul className="grid grid-cols-2 gap-2 text-stone-400">
                    <li>Mori Art Museum</li>
                    <li>Sony Design</li>
                    <li>Issey Miyake</li>
                    <li>Uniqlo</li>
                 </ul>
              </motion.div>
            </div>
          </div>
          
          {/* Footer Decorative */}
          <div className="p-8 md:p-12 text-stone-800 text-[10vw] leading-none font-serif opacity-20 select-none pointer-events-none absolute bottom-[-2vw] right-0">
            PORTFOLIO
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutOverlay;
