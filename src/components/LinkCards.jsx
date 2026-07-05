import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

// Gradient fallbacks for cards without a bgImage
const FALLBACKS = [
  'linear-gradient(135deg,#0d2018 0%,#163828 100%)',
  'linear-gradient(135deg,#111827 0%,#0d2018 100%)',
  'linear-gradient(135deg,#0a1628 0%,#0d2418 100%)',
];

function ArrowUpRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  );
}

function Card3D({ link, index }) {
  const cardRef = useRef(null);
  const hasBg = !!link.bgImage;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 24, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 24, stiffness: 200 });

  // Subtle 3D tilt — keeps card wide and usable
  const rotateX = useTransform(springY, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-4deg', '4deg']);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div className="card3d-perspective">
      <motion.a
        ref={cardRef}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        id={`link-${link.id}`}
        className="card3d"
        aria-label={link.title}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: hasBg ? undefined : FALLBACKS[index % FALLBACKS.length],
        }}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.975 }}
      >
        {/* Full-bleed background image */}
        {hasBg && (
          <motion.div
            className="card3d-bg"
            style={{ backgroundImage: `url("${encodeURI(link.bgImage)}")` }}
          />
        )}
        
        {/* Repeating leaf pattern for the booking card */}
        {!hasBg && link.id === 'booking' && (
          <div className="card3d-leaf-pattern" />
        )}

        {/* Gradient scrim — heavier at top and bottom for legibility */}
        <div className="card3d-scrim" />

        {/* ── Content shell ── translateZ pushes it in front */}
        <div className="card3d-shell" style={{ transform: 'translateZ(32px)' }}>

          {/* Custom Center Content for the Clover Layouts */}
          {link.layout === 'center-logo' && (
            <div className="card-center-logo">
              <span className="logo-cl">cl</span>
              <img src="/leaf.png" className="logo-leaf" alt="o" />
              <span className="logo-ver">ver.</span>
              <span className="logo-studio">studio</span>
            </div>
          )}

          {link.layout === 'center-icon' && (
            <div className="card-center-icon">
              <CameraIcon />
              <h3 className="card-center-title">{link.centerTitle}</h3>
            </div>
          )}

          {link.layout === 'bottom-right-title' && (
            <div className="card-bottom-right">
              <h3 className="card-br-title">{link.centerTitle}</h3>
            </div>
          )}

          {/* TOP ROW: standard title block or just the arrow for image-only */}
          {(!link.layout || link.layout === 'image-only') && (
            <div className="card3d-top" style={{ justifyContent: link.layout === 'image-only' ? 'flex-end' : 'space-between' }}>
              {!link.layout && (
                <div className="card3d-head">
                  <h3 className="card3d-title">{link.title}</h3>
                  {link.tag && <p className="card3d-subtitle">{link.tag}</p>}
                </div>
              )}
              <div className="card3d-arrow-btn" aria-hidden="true">
                <ArrowUpRight />
              </div>
            </div>
          )}

          {/* BOTTOM ROW: glass pill CTA */}
          <div className="card3d-bottom" style={{ marginTop: link.layout === 'image-only' ? 'auto' : 0 }}>
            <div className="card3d-cta-pill">
              <span className="card3d-cta-text">{link.description || 'Visit →'}</span>
            </div>
          </div>

        </div>
      </motion.a>
    </div>
  );
}

export default function LinkCards({ links }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="links-section" aria-label="Links">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-head-label">Links</span>
        <div className="section-head-line" />
      </motion.div>

      <div className="links-stack">
        {links.map((link, i) => (
          <Card3D key={link.id} link={link} index={i} />
        ))}
      </div>
    </section>
  );
}
