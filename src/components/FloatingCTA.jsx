import { motion, useScroll, useTransform } from 'framer-motion';

function CalendarIcon() {
  return (
    <svg className="floating-cta-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default function FloatingCTA({ label = 'Schedule a Call', href = '#' }) {
  // Fade-out when the user scrolls near the bottom (e.g. footer)
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
  const y       = useTransform(scrollYProgress, [0.88, 1], [0, 16]);

  return (
    <motion.div
      className="floating-cta-wrap"
      role="complementary"
      aria-label="Call to action"
      style={{ opacity, y }}
    >
      <motion.a
        href={href}
        className="floating-cta"
        id="cta-schedule"
        target="_blank"
        rel="noopener noreferrer"
        // Entrance — springs in late so it doesn't compete with hero
        initial={{ opacity: 0, y: 32, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        // Hover — lifts with a micro-spring
        whileHover={{ y: -3, scale: 1.05,
          transition: { type: 'spring', stiffness: 340, damping: 22 }
        }}
        whileTap={{ scale: 0.94,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
      >
        <CalendarIcon />
        {label}
      </motion.a>
    </motion.div>
  );
}
