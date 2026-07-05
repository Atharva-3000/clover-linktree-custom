import { useEffect } from 'react';
import Lenis from 'lenis';
import Background from './components/Background';
import Hero from './components/Hero';
import SocialLinks from './components/SocialLinks';
import LinkCards from './components/LinkCards';
import FloatingCTA from './components/FloatingCTA';
import Footer from './components/Footer';
import { profile, socialLinks, customLinks } from './data/links';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf;
    const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  // Tab Title Easter Egg
  useEffect(() => {
    let intervalId;
    const originalTitle = document.title;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        let isMissYou = true;
        document.title = "We miss you! 🍀";
        
        intervalId = setInterval(() => {
          isMissYou = !isMissYou;
          document.title = isMissYou ? "We miss you! 🍀" : "Come back! 🥺";
        }, 1500);
      } else {
        clearInterval(intervalId);
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* Animated orb background */}
      <Background />

      <main>
        <Hero profile={profile} />

        <div className="spacer" style={{ height: '32px' }} />
        <SocialLinks links={socialLinks} />

        <div className="spacer" style={{ height: '32px' }} />
        <LinkCards links={customLinks} />

        <Footer />
      </main>

      <FloatingCTA label="Schedule a Call" href="https://cal.com/clover-studio-fyoxps" />
    </>
  );
}
