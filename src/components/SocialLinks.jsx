import { useRef } from 'react';
import { useAnimate, motion, useInView } from 'framer-motion';
import {
  FaXTwitter, FaInstagram, FaGithub, FaLinkedinIn,
  FaYoutube, FaTiktok, FaSpotify, FaDiscord,
  FaTelegram, FaWhatsapp
} from 'react-icons/fa6';

// ── Clip-path constants ─────────────────────────────────────
const NO_CLIP           = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
const BOTTOM_RIGHT_CLIP = 'polygon(0 0, 100% 0, 0 0, 0% 100%)';
const TOP_RIGHT_CLIP    = 'polygon(0 0, 0 100%, 100% 100%, 0% 100%)';
const BOTTOM_LEFT_CLIP  = 'polygon(100% 100%, 100% 0, 100% 100%, 0 100%)';
const TOP_LEFT_CLIP     = 'polygon(0 0, 100% 0, 100% 100%, 100% 0)';

const ENTRANCE = {
  left:   [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right:  [TOP_LEFT_CLIP,     NO_CLIP],
  top:    [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
};
const EXIT = {
  left:   [NO_CLIP, TOP_RIGHT_CLIP],
  right:  [NO_CLIP, BOTTOM_LEFT_CLIP],
  top:    [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
};

// ── Brand palette ────────────────────────────────────────────
// idle:  brand bg + white icon
// hover: white bg + brand-colored icon  (full color reversal)
const BRANDS = {
  twitter:   {
    bg:      '#000000',
    overlay: '#ffffff',
    iconColor: '#000000',
    Icon:    FaXTwitter,
  },
  instagram: {
    bg:      'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    overlay: '#ffffff',
    iconColor: '#d6249f',
    Icon:    FaInstagram,
  },
  github: {
    bg:      '#24292e',
    overlay: '#ffffff',
    iconColor: '#24292e',
    Icon:    FaGithub,
  },
  linkedin: {
    bg:      '#0077b5',
    overlay: '#ffffff',
    iconColor: '#0077b5',
    Icon:    FaLinkedinIn,
  },
  youtube: {
    bg:      '#FF0000',
    overlay: '#ffffff',
    iconColor: '#FF0000',
    Icon:    FaYoutube,
  },
  tiktok: {
    bg:      '#010101',
    overlay: '#ffffff',
    iconColor: '#010101',
    Icon:    FaTiktok,
  },
  spotify: {
    bg:      '#1DB954',
    overlay: '#ffffff',
    iconColor: '#1DB954',
    Icon:    FaSpotify,
  },
  discord: {
    bg:      '#5865F2',
    overlay: '#ffffff',
    iconColor: '#5865F2',
    Icon:    FaDiscord,
  },
  telegram: {
    bg:      '#26A5E4',
    overlay: '#ffffff',
    iconColor: '#26A5E4',
    Icon:    FaTelegram,
  },
  whatsapp: {
    bg:      '#25D366',
    overlay: '#ffffff',
    iconColor: '#25D366',
    Icon:    FaWhatsapp,
  },
};

// ── Single grid cell ─────────────────────────────────────────
function LinkBox({ social, rowIndex }) {
  const [scope, animate] = useAnimate();
  const brand = BRANDS[social.platform];
  if (!brand) return null;
  const { bg, overlay, iconColor, Icon } = brand;

  const getNearestSide = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    return [
      { side: 'left',   proximity: Math.abs(box.left   - e.clientX) },
      { side: 'right',  proximity: Math.abs(box.right  - e.clientX) },
      { side: 'top',    proximity: Math.abs(box.top    - e.clientY) },
      { side: 'bottom', proximity: Math.abs(box.bottom - e.clientY) },
    ].sort((a, b) => a.proximity - b.proximity)[0].side;
  };

  const handleEnter = (e) => {
    animate(scope.current, { clipPath: ENTRANCE[getNearestSide(e)] }, {
      duration: 0.32, ease: [0.16, 1, 0.3, 1],
    });
  };

  const handleLeave = (e) => {
    animate(scope.current, { clipPath: EXIT[getNearestSide(e)] }, {
      duration: 0.28, ease: [0.16, 1, 0.3, 1],
    });
  };

  // Taller on row 0
  const cellClass = `social-cell${rowIndex === 0 ? ' social-cell--lg' : ''}`;

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`social-${social.id}`}
      aria-label={social.label}
      title={social.label}
      className={cellClass}
      style={{ background: bg }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Idle icon — white on brand bg */}
      <Icon className="social-cell-icon" style={{ color: '#fff' }} aria-hidden="true" />

      {/* Clip-path overlay — white bg, brand-colored icon (color reversal) */}
      <div
        ref={scope}
        className="social-cell-overlay"
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
          background: overlay,
        }}
        aria-hidden="true"
      >
        <Icon className="social-cell-icon" style={{ color: iconColor }} />
      </div>
    </a>
  );
}

// Row layout: 2 / 4 / 2
const ROW_SIZES = [2, 4, 2];

export default function SocialLinks({ links }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const rows = [];
  let cursor = 0;
  for (const size of ROW_SIZES) {
    rows.push(links.slice(cursor, cursor + size));
    cursor += size;
  }

  return (
    <section ref={ref} className="social-section" aria-label="Social links">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-head-label">Socials</span>
        <div className="section-head-line" />
      </motion.div>

      <motion.div
        className="social-clip-grid"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="social-clip-row"
            style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
          >
            {row.map((s) => (
              <LinkBox key={s.id} social={s} rowIndex={ri} />
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
