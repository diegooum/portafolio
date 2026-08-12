import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * HeroSection
 * ---------------------------------------------------------
 * Primera vista del portafolio. Asimétrica: el bloque de texto
 * vive desplazado hacia la izquierda mientras dos auras pastel
 * (lavanda + menta) ocupan el espacio negativo a la derecha,
 * reaccionando sutilmente al movimiento del cursor (parallax).
 *
 * La animación de entrada revela el nombre línea por línea con
 * un stagger, seguida del título y el CTA — evocando la apertura
 * de una cortina, no un fade genérico.
 * ---------------------------------------------------------
 */

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const lineReveal = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSection() {
  const sectionRef = useRef(null);

  // Valores crudos del cursor, suavizados con spring para un
  // movimiento de parallax orgánico (no lineal / robótico).
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Cada aura se mueve a una profundidad distinta -> sensación 3D.
  const lavenderX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const lavenderY = useTransform(smoothY, [-1, 1], [-20, 20]);
  const mintX = useTransform(smoothX, [-1, 1], [24, -24]);
  const mintY = useTransform(smoothY, [-1, 1], [16, -16]);

  const handleMouseMove = (event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    mouseX.set(relativeX * 2);
    mouseY.set(relativeY * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden bg-carbon"
    >
      {/* ---------------------------------------------------
          AURAS PASTEL — espacio negativo a la derecha,
          desplazadas de forma asimétrica respecto al texto.
          --------------------------------------------------- */}
      <motion.div
        aria-hidden="true"
        style={{ x: lavenderX, y: lavenderY }}
        className="pointer-events-none absolute right-[-10%] top-[12%] h-[420px] w-[420px]
                   rounded-full bg-radial-lavender blur-3xl animate-breathe"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: mintX, y: mintY }}
        className="pointer-events-none absolute right-[8%] bottom-[6%] h-[300px] w-[300px]
                   rounded-full bg-radial-mint blur-3xl animate-float-slow"
      />

      {/* ---------------------------------------------------
          CONTENIDO — bloque asimétrico anclado a la izquierda,
          con generoso espacio negativo alrededor.
          --------------------------------------------------- */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-6 md:px-16 lg:px-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="mb-6 font-sans text-sm font-medium uppercase tracking-[0.25em] text-bone-muted"
          >
            Portafolio · 2025
          </motion.p>

          {/* Nombre — revelado línea por línea */}
          <h1 className="font-display font-black text-display-xl text-bone">
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                Diego Medina
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block text-lavender">
                Paredes
              </motion.span>
            </span>
          </h1>

          {/* Título profesional */}
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl font-sans text-lg font-normal leading-relaxed text-bone-muted md:text-xl"
          >
            Ingeniero en Informática Empresarial &amp; Desarrollador Full-Stack.
            Diseño y construyo productos digitales donde la ingeniería y la
            estética conviven sin fricción.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-12 flex items-center gap-6">
            <a
              href="#proyectos"
              className="group relative inline-flex items-center gap-3 rounded-full border border-carbon-line
                         px-7 py-3.5 font-sans text-sm font-medium text-bone
                         transition-all duration-500 ease-premium
                         hover:border-lavender/60 hover:shadow-aura-lavender"
            >
              Ver proyectos
              <span className="transition-transform duration-500 ease-premium group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="#contacto"
              className="font-sans text-sm font-medium text-bone-muted underline-offset-4
                         transition-colors duration-300 hover:text-mint hover:underline"
            >
              Contactar
            </a>
          </motion.div>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 left-6 flex items-center gap-3 md:left-16 lg:left-24"
        >
          <span className="h-10 w-px bg-carbon-line" />
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-bone-dim">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}