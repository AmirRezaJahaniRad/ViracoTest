import React, { memo, useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const ParticleEffect: React.FC<Props> = ({ className, style }) => {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initParticlesEngine(async (engine: Engine) => {
          await loadFull(engine);
        });
        setReady(true);
      } catch (err) {
        console.error("Particles init error:", err);
      }
    };

    init();

    // detect mobile
    setIsMobile(window.innerWidth < 768);
  }, []);

  const options = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: true, zIndex: -1 },
    fpsLimit: isMobile ? 30 : 60,
    detectRetina: false,
    particles: {
      number: {
        value: isMobile ? 25 : 40,
        density: { enable: true, width: 800 },
      },
      color: { value: "#8B008B" },
      links: {
        enable: isMobile ? false : true,
        distance: isMobile ? 80 : 120,
        color: "#9ca3af",
        opacity: isMobile ? 0.25 : 0.35,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.3,
        outModes: { default: "out" },
      },
      size: { value: { min: 1, max: isMobile ? 2 : 3 } },
      opacity: { value: 0.1 },
    },
    interactivity: {
      events: {
        onHover: { enable: !isMobile, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 150, links: { opacity: 0.6 } },
        push: { quantity: isMobile ? 2 : 4 },
      },
    },
  }), [isMobile]);

  if (!ready) {
    console.log("Particles not ready yet...");
    return null; // تا وقتی که engine آماده نشده چیزی نشون نده
  }

  return (
    <Particles id="tsparticles" options={options} className={className} style={style} />
  );
};

export default memo(ParticleEffect);