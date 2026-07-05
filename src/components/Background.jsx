import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * Interactive Background — hex grid of leaves with Easter Egg
 */
function LeafGrid() {
  const [cols, setCols] = useState(10);
  const [rows, setRows] = useState(10);
  const luckyIds = useRef(new Set());
  const [foundId, setFoundId] = useState(null);
  const found = foundId !== null;
  
  useEffect(() => {
    const handleResize = () => {
      const newCols = Math.ceil(window.innerWidth / 100) + 1;
      const newRows = Math.ceil(window.innerHeight / 85) + 1;
      setCols(newCols);
      setRows(newRows);
      
      // Pick 4 lucky clovers to increase the chance slightly
      if (luckyIds.current.size === 0) {
        for (let i = 0; i < 4; i++) {
          const r = Math.floor(Math.random() * newRows);
          const c = Math.floor(Math.random() * newCols);
          luckyIds.current.add(`${r}-${c}`);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (e, id) => {
    if (!found && luckyIds.current.has(id)) {
      setFoundId(id);
      e.currentTarget.style.setProperty('--hover-color', '#00A76F');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00A76F', '#34C759', '#ffffff'],
        disableForReducedMotion: true
      });
    } else if (!found) {
      // Pick a random color on every single hover
      const wrongColors = ['#FF2D55', '#FF9500', '#FFCC00', '#5856D6', '#AF52DE', '#FF3B30', '#32ADE6'];
      const randomColor = wrongColors[Math.floor(Math.random() * wrongColors.length)];
      e.currentTarget.style.setProperty('--hover-color', randomColor);
    }
  };

  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push({ r, c, id: `${r}-${c}` });
    }
  }

  // Vibrant palette for "wrong" leaves
  const wrongColors = ['#FF2D55', '#FF9500', '#FFCC00', '#5856D6', '#AF52DE', '#FF3B30', '#32ADE6'];

  return (
    <>
      <div className="leaf-grid">
        {grid.map((cell) => {
          const isOddRow = cell.r % 2 !== 0;
          const leftOffset = isOddRow ? 50 : 0;
          const isTheFoundOne = found && cell.id === foundId;
          
          return (
            <div
              key={cell.id}
              className={`leaf-cell ${isTheFoundOne ? 'is-found' : ''}`}
              style={{
                left: `${cell.c * 100 + leftOffset}px`,
                top: `${cell.r * 85}px`,
              }}
              onMouseEnter={(e) => handleHover(e, cell.id)}
            >
              <div className="leaf-icon" />
            </div>
          );
        })}
      </div>

      {/* Global Toast for finding the Clover */}
      <AnimatePresence>
        {found && (
          <motion.div
            className="easter-egg-toast"
            initial={{ opacity: 0, y: 40, x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <span className="toast-icon">🍀</span> You found us!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Background() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 22, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 22, damping: 30 });

  const orb1X = useTransform(springX, [0, 1], ['-8%', '8%']);
  const orb1Y = useTransform(springY, [0, 1], ['-6%', '6%']);
  const orb2X = useTransform(springX, [0, 1], ['6%', '-6%']);
  const orb2Y = useTransform(springY, [0, 1], ['4%', '-4%']);
  const orb3X = useTransform(springX, [0, 1], ['-4%', '4%']);
  const orb3Y = useTransform(springY, [0, 1], ['6%', '-6%']);

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="bg-layer" aria-hidden="true">
      {/* ── Layer 1: Interactive Leaf Grid ─────────────── */}
      <LeafGrid />

      {/* ── Layer 3: Morphing emerald orbs ────────────────────── */}
      <motion.div
        className="bg-orb bg-orb-1"
        style={{ x: orb1X, y: orb1Y }}
        animate={{
          borderRadius: ['60% 40% 55% 45%', '40% 60% 45% 55%', '60% 40% 55% 45%'],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="bg-orb bg-orb-2"
        style={{ x: orb2X, y: orb2Y }}
        animate={{
          borderRadius: ['45% 55% 40% 60%', '60% 40% 55% 45%', '45% 55% 40% 60%'],
          scale: [1, 0.94, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* ── Layer 4: SVG fractal grain ────────────────────────── */}
      <svg className="bg-grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
