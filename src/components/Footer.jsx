import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      aria-label="Footer"
    >
      <p className="footer-text">
        made by Clover Studio with <span className="footer-heart" aria-label="love">💚</span> &nbsp;·&nbsp; {year}
      </p>
    </motion.footer>
  );
}

