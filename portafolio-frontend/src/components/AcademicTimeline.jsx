import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * AcademicTimeline
 * ---------------------------------------------------------
 * Eje vertical asimétrico (anclado a la izquierda, no centrado)
 * con una línea de progreso que se "dibuja" a medida que el
 * usuario recorre la sección — el propio scroll es la animación,
 * no un efecto decorativo superpuesto.
 *
 * Cada hito se revela de forma independiente al entrar en
 * viewport (whileInView), con un color pastel derivado de su
 * categoría (internacional / liderazgo / investigación).
 * ---------------------------------------------------------
 */

const CATEGORY_STYLES = {
  INTERNATIONAL: {
    label: 'Intercambio internacional',
    dot: 'bg-lavender',
    ring: 'ring-lavender/40',
    text: 'text-lavender',
  },
  LEADERSHIP: {
    label: 'Liderazgo estudiantil',
    dot: 'bg-peach',
    ring: 'ring-peach/40',
    text: 'text-peach',
  },
  RESEARCH: {
    label: 'Investigación',
    dot: 'bg-mint',
    ring: 'ring-mint/40',
    text: 'text-mint',
  },
  ACADEMIC: {
    label: 'Académico',
    dot: 'bg-bone-muted',
    ring: 'ring-bone-muted/30',
    text: 'text-bone-muted',
  },
  PROFESSIONAL: {
    label: 'Profesional',
    dot: 'bg-bone-muted',
    ring: 'ring-bone-muted/30',
    text: 'text-bone-muted',
  },
};

// Datos por defecto — trayectoria académica de Diego.
// El componente acepta `events` por props para que el frontend
// consuma directamente el endpoint /timeline del backend.
const DEFAULT_EVENTS = [
  {
    id: 'muenster',
    title: 'Semestre de intercambio',
    institution: 'Fachhochschule Münster, Alemania',
    description:
      'Un semestre completo cursando en Alemania, inmerso en un sistema académico distinto y en un tercer idioma de trabajo.',
    category: 'INTERNATIONAL',
    date: 'Agosto — Diciembre 2023',
  },
  {
    id: 'centro-estudiantes',
    title: 'Vicepresidente del Centro de Estudiantes',
    institution: 'Gestión logística de eventos masivos',
    description:
      'Coordinación integral de la Semana Mechona y otros eventos de gran escala: presupuesto, proveedores, seguridad y equipos de voluntariado.',
    category: 'LEADERSHIP',
    date: '2022 — 2023',
  },
  {
    id: 'tesis-bod',
    title: 'Investigación de tesis: Burnout Digital (BOD)',
    institution: 'Estudiantes de educación superior',
    description:
      'Estudio sobre el agotamiento digital en estudiantes universitarios: causas, indicadores y su relación con el uso prolongado de plataformas académicas.',
    category: 'RESEARCH',
    date: '2024',
  },
];

function TimelineItem({ event, index }) {
  const style = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.ACADEMIC;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative flex gap-8 pb-20 last:pb-0 md:gap-14"
    >
      {/* Marcador sobre el eje */}
      <div className="relative flex w-6 flex-none justify-center md:w-10">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={`z-10 mt-1.5 h-3 w-3 flex-none rounded-full ${style.dot} ring-4 ${style.ring}`}
        />
      </div>

      {/* Contenido del hito */}
      <div className="max-w-xl pt-0">
        <span className={`font-sans text-xs font-medium uppercase tracking-[0.2em] ${style.text}`}>
          {style.label} · {event.date}
        </span>

        <h3 className="mt-3 font-display text-2xl font-bold text-bone md:text-3xl">
          {event.title}
        </h3>

        {event.institution && (
          <p className="mt-1.5 font-sans text-sm font-medium text-bone-muted">
            {event.institution}
          </p>
        )}

        <p className="mt-4 font-sans text-base leading-relaxed text-bone-muted/90">
          {event.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function AcademicTimeline({ events = DEFAULT_EVENTS }) {
  const containerRef = useRef(null);

  // Progreso de scroll acotado al rango de la propia sección,
  // no de la página completa.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="trayectoria"
      className="relative w-full bg-carbon px-6 py-32 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-5xl">
        {/* Encabezado de sección — asimétrico, alineado a la izquierda */}
        <div className="mb-20 max-w-lg">
          <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.25em] text-bone-muted">
            Trayectoria
          </p>
          <h2 className="font-display text-display-md font-bold text-bone">
            Formación con carácter internacional y de liderazgo
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Eje base (tenue) */}
          <div
            aria-hidden="true"
            className="absolute left-[11px] top-2 h-full w-px bg-carbon-line md:left-[19px]"
          />
          {/* Eje de progreso (se dibuja con el scroll) */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute left-[11px] top-2 h-full w-px origin-top bg-gradient-to-b
                       from-lavender via-mint to-peach md:left-[19px]"
          />

          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}