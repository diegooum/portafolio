import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ExperienceAccordion
 * ---------------------------------------------------------
 * En vez de un acordeón vertical tradicional (título + contenido
 * apilados uno debajo del otro), esto es un layout maestro-detalle:
 * los títulos viven en una columna angosta a la izquierda, y el
 * contenido del ítem activo se revela en el espacio negativo de
 * la derecha con un crossfade — asimetría real, no cosmética.
 *
 * En mobile colapsa a una sola columna: la lista arriba, el
 * detalle del ítem activo justo debajo.
 * ---------------------------------------------------------
 */

const EXPERIENCE_ITEMS = [
  {
    id: 'fen-utalca',
    type: 'Experiencia',
    title: 'Desarrollo Full-Stack',
    org: 'FEN Utalca',
    period: '2024',
    description:
      'Desarrollo de un sistema de registro de actividades para la Facultad de Economía y Negocios: desde el modelado de datos hasta la interfaz que usan a diario administrativos y estudiantes.',
    accentColor: '#D6CCF0',
  },
  {
    id: 'hcm-propiedades',
    type: 'Experiencia',
    title: 'Automatización con Python',
    org: 'HCM Propiedades',
    period: '2023',
    description:
      'Diseño de scripts de automatización en Python para eliminar tareas manuales repetitivas del área administrativa, reduciendo tiempos de proceso y errores de carga de datos.',
    accentColor: '#F3D3B8',
  },
  {
    id: 'ayudantia',
    type: 'Experiencia',
    title: 'Ayudante académico',
    org: 'Algoritmos y Programación Orientada a Objetos',
    period: '2022 — 2023',
    description:
      'Apoyo a estudiantes de cursos introductorios de algoritmos y POO: resolución de dudas, corrección de ejercicios y ayudantías de reforzamiento antes de evaluaciones.',
    accentColor: '#BFE8D4',
  },
  {
    id: 'scrum-foundation',
    type: 'Certificación',
    title: 'Scrum Foundation',
    org: 'CertiProf',
    period: '2024',
    description:
      'Certificación en los fundamentos del framework Scrum: roles, eventos y artefactos para la gestión ágil de proyectos de software.',
    accentColor: '#D6CCF0',
  },
  {
    id: 'mit-transformacion-digital',
    type: 'Certificación',
    title: 'Transformación Digital',
    org: 'MIT',
    period: '2023',
    description:
      'Programa del Massachusetts Institute of Technology sobre estrategia de transformación digital: tecnologías emergentes y su impacto en modelos de negocio.',
    accentColor: '#F3D3B8',
  },
];

export default function ExperienceAccordion({ items = EXPERIENCE_ITEMS }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <section
      id="experiencia"
      className="relative w-full bg-carbon px-6 py-32 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-16 max-w-lg">
          <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.25em] text-bone-muted">
            Experiencia &amp; certificaciones
          </p>
          <h2 className="font-display text-display-md font-bold text-bone">
            Lo que he construido fuera de la sala de clases
          </h2>
        </div>

        {/* Layout maestro-detalle */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          {/* Columna izquierda — lista de títulos */}
          <div className="md:col-span-5 lg:col-span-4">
            <ul className="border-t border-carbon-line">
              {items.map((item) => {
                const isActive = item.id === activeItem.id;
                return (
                  <li key={item.id} className="border-b border-carbon-line">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-expanded={isActive}
                      className="group flex w-full flex-col items-start gap-1.5 py-5 text-left
                                 transition-colors duration-300 ease-premium"
                    >
                      <span
                        className="font-sans text-xs font-medium uppercase tracking-[0.2em]"
                        style={{ color: isActive ? item.accentColor : undefined }}
                      >
                        <span className={isActive ? '' : 'text-bone-dim'}>{item.type}</span>
                      </span>

                      <span
                        className={`font-display text-xl font-bold transition-colors duration-300 ease-premium md:text-2xl ${
                          isActive
                            ? 'text-bone'
                            : 'text-bone-muted/70 group-hover:text-bone-muted'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Columna derecha — detalle del ítem activo */}
          <div className="md:col-span-7 md:pt-2 lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="mb-6 h-px w-16"
                  style={{ backgroundColor: activeItem.accentColor }}
                  aria-hidden="true"
                />

                <p className="font-sans text-sm font-medium text-bone-muted">
                  {activeItem.org} · {activeItem.period}
                </p>

                <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-bone-muted/90">
                  {activeItem.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}