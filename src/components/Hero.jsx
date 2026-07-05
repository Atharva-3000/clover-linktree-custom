import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Split text into per-character animated spans
function SplitText({ text, className, charDelay = 0.03, baseDelay = 0.2 }) {
  return (
    <span className={className} aria-label={text} style={{ display: 'block' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 20, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: baseDelay + i * charDelay,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ profile }) {
  const heroRef = useRef(null);

  // Scroll-driven parallax — hero gently floats up as you scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Avatar floats faster — stronger parallax
  const avatarY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const avatarScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.88]);

  return (
    <motion.section
      ref={heroRef}
      className="hero"
      style={{ y: heroY, opacity: heroOpacity }}
      aria-label="Profile"
    >
      <div className="hero-orb" aria-hidden="true" />

      {/* Avatar with scroll parallax */}
      <motion.div
        className="avatar-wrap"
        style={{ y: avatarY, scale: avatarScale }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img
          src={profile.avatarUrl}
          alt={`${profile.name} profile`}
          className="avatar-img"
        />
      </motion.div>

      {/* Name — character-by-character reveal */}
      <div style={{ perspective: '600px', overflow: 'hidden', paddingBottom: '2px' }}>
        <SplitText
          text={profile.name}
          className="hero-name"
          baseDelay={0.3}
          charDelay={0.035}
        />
      </div>

      {/* Bio — blur fade in */}
      <motion.p
        className="hero-bio"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.85 }}
      >
        {profile.bio}
      </motion.p>
    </motion.section>
  );
}
