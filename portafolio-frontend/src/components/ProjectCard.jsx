import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ProjectCard
 * ---------------------------------------------------------
 * Tarjeta asimétrica para el showcase de proyectos (GachaDex,
 * Ruka, Modelos de Data Science). El tamaño se define por
 * `size` (coincide con el enum LayoutSize del backend), lo que
 * permite armar un grid tipo mosaico en el componente padre:
 *
 *   <div className="grid grid-cols-6 gap-6">
 *     <ProjectCard size="LARGE" .../>   -> col-span-4 row-span-2
 *     <ProjectCard size="SMALL" .../>   -> col-span-2
 *     ...
 *   </div>
 *
 * Microinteracciones:
 *  - Tilt 3D sutil que sigue el cursor (perspectiva real, no un
 *    simple scale).
 *  - Aura de color propia del proyecto (`accentColor`) que
 *    aparece solo en hover, nunca en reposo.
 *  - El stack tecnológico y el CTA se revelan con un desliz
 *    hacia arriba, en vez de aparecer de golpe.
 * ---------------------------------------------------------
 */

// Tamaños de referencia para uso standalone (fuera de un grid que ya
// controle el tamaño del wrapper, como hace ProjectsShowcase). Cuando
// ProjectCard se renderiza dentro de un contenedor con tamaño propio,
// pasa `fill` en true y estas clases se ignoran a favor de h-full/w-full.
const SIZE_CLASSES = {
  SMALL: 'col-span-6 md:col-span-3 aspect-[4/5]',
  MEDIUM: 'col-span-6 md:col-span-3 aspect-[4/5] md:row-span-2 md:aspect-auto',
  LARGE: 'col-span-6 md:col-span-4 aspect-[4/5] md:aspect-[16/11]',
  WIDE: 'col-span-6 aspect-[16/9] md:aspect-[21/9]',
};

export default function ProjectCard({
  title,
  subtitle,
  description,
  coverImageUrl,
  accentColor = '#D6CCF0', // fallback: lavanda
  technologies = [],
  repoUrl,
  demoUrl,
  size = 'MEDIUM',
  fill = true,
}) {
  const cardRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springTilt = { stiffness: 220, damping: 22, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springTilt);
  const smoothRotateY = useSpring(rotateY, springTilt);

  // El aura sigue el punto exacto del cursor dentro de la tarjeta.
  const auraX = useMotionValue(50);
  const auraY = useMotionValue(50);

  const handleMouseMove = (event) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    // Tilt máximo de ~6deg — sutil, nunca "efecto videojuego".
    rotateY.set((px - 0.5) * 12);
    rotateX.set((0.5 - py) * 12);

    auraX.set(px * 100);
    auraY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const auraBackground = useTransform(
    [auraX, auraY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${accentColor}33, transparent 60%)`,
  );

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 1000,
      }}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl
                  border border-carbon-line bg-carbon-raised
                  transition-[border-color] duration-500 ease-premium
                  hover:border-white/10 ${fill ? 'h-full w-full' : SIZE_CLASSES[size]}`}
    >
      {/* Imagen de portada */}
      {coverImageUrl && (
        <motion.img
          src={coverImageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-70
                     transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
        />
      )}

      {/* Aura de acento — solo visible en hover, sigue al cursor */}
      <motion.div
        aria-hidden="true"
        style={{ background: auraBackground }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity
                   duration-500 ease-premium group-hover:opacity-100"
      />

      {/* Degradado de legibilidad sobre la imagen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col p-6 md:p-8">
        {subtitle && (
          <span
            className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {subtitle}
          </span>
        )}

        <h3 className="font-display text-2xl font-bold text-bone md:text-3xl">
          {title}
        </h3>

        {/* Descripción — se desliza hacia arriba y aparece en hover */}
        <motion.p
          initial={{ opacity: 0, y: 12, height: 0 }}
          whileHover={{}}
          className="mt-3 max-h-0 overflow-hidden font-sans text-sm leading-relaxed text-bone-muted
                     opacity-0 transition-all duration-500 ease-premium
                     group-hover:mt-3 group-hover:max-h-32 group-hover:opacity-100"
        >
          {description}
        </motion.p>

        {/* Stack tecnológico */}
        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 opacity-80 transition-opacity duration-500 ease-premium group-hover:opacity-100">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-carbon-line px-3 py-1 font-sans text-xs font-medium text-bone-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        {(repoUrl || demoUrl) && (
          <div className="mt-5 flex translate-y-1 gap-5 opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm font-medium text-bone underline-offset-4 hover:underline"
              >
                Ver demo ↗
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm font-medium text-bone-muted underline-offset-4 hover:text-bone hover:underline"
              >
                Repositorio ↗
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}