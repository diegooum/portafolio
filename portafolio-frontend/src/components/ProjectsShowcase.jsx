import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import CDCase from './CDCase';

/**
 * ProjectsShowcase — "Crate Digging"
 * ---------------------------------------------------------
 * Los proyectos ya no son tarjetas en un grid: son estuches de
 * CD apoyados en una caja, que el usuario arrastra horizontalmente
 * para "rebuscar". Al arrastrar, toda la fila se inclina levemente
 * (como mirar la caja desde otro ángulo); al pasar el cursor sobre
 * un CD puntual, ese estuche se endereza y sigue el mouse; al hacer
 * click, levita hacia el frente y despliega su booklet.
 *
 * MOCK_PROJECTS mantiene exactamente la misma forma de datos que
 * en fases anteriores — reemplazar por la respuesta de GET /projects
 * no requiere tocar nada más.
 * ---------------------------------------------------------
 */

const MOCK_PROJECTS = [
  {
    id: 'gachadex',
    title: 'GachaDex',
    subtitle: 'Full-Stack · Machine Learning',
    description:
      'Aplicación full-stack que integra un modelo de Machine Learning para recomendar Pokémon según las preferencias y el historial del usuario, combinando un motor de recomendación entrenado con una API REST y una interfaz reactiva.',
    accentColor: '#D6CCF0', // lavanda
    technologies: ['React', 'NestJS', 'Python', 'PostgreSQL'],
    repoUrl: 'https://github.com/diego-medina/gachadex',
    demoUrl: 'https://gachadex.vercel.app',
    size: 'LARGE',
    categories: ['Web & Full-Stack', 'Data & Machine Learning'],
  },
  {
    id: 'ruka',
    title: 'Ruka',
    subtitle: 'Lenguaje de programación educativo',
    description:
      'Intérprete y lenguaje de programación propio, diseñado desde cero con fines educativos: léxico, parser y evaluador construidos a mano para enseñar los fundamentos de cómo funciona un lenguaje por dentro.',
    accentColor: '#F3D3B8', // durazno
    technologies: ['C', 'Python'],
    repoUrl: 'https://github.com/diego-medina/ruka',
    size: 'MEDIUM',
    categories: ['Web & Full-Stack', 'Automatización'],
  },
  {
    id: 'data-science-models',
    title: 'Modelos de Data Science',
    subtitle: 'KNN · Árboles de decisión',
    description:
      'Implementación desde cero de algoritmos clásicos de aprendizaje supervisado —K-Nearest Neighbors y Árboles de Decisión— aplicados a conjuntos de datos reales, con foco en entender el algoritmo antes que en usar la librería.',
    accentColor: '#BFE8D4', // menta
    technologies: ['Python', 'Pandas', 'Scikit-learn'],
    repoUrl: 'https://github.com/diego-medina/data-science-models',
    size: 'MEDIUM',
    categories: ['Data & Machine Learning'],
  },
];

const CASE_WIDTH = 208;
const OVERLAP = 118; // cuánto se "tapan" entre sí -> look de caja apretada

export default function ProjectsShowcase({ projects = MOCK_PROJECTS }) {
  const [activeId, setActiveId] = useState(null);

  const trackX = useMotionValue(0);
  // Al arrastrar, toda la fila se inclina levemente -> sensación
  // de estar mirando la caja desde otro ángulo mientras rebuscas.
  const crateRotateY = useTransform(trackX, [-260, 0, 260], [8, 0, -8]);

  const step = CASE_WIDTH - OVERLAP;
  const totalTrackWidth = step * (projects.length - 1) + CASE_WIDTH;
  const dragConstraints = {
    left: Math.min(0, -(totalTrackWidth - CASE_WIDTH) - 60),
    right: 60,
  };

  return (
    <section
      id="proyectos"
      className="relative w-full overflow-hidden bg-carbon px-6 py-32 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-lg">
            <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.25em] text-bone-muted">
              Proyectos seleccionados
            </p>
            <h2 className="font-display text-display-md font-bold text-bone">
              Rebusca en la colección
            </h2>
          </div>

          <p className="max-w-xs font-sans text-sm leading-relaxed text-bone-muted md:text-right">
            Arrastra la caja para pasar los discos. Haz click en uno para
            abrirlo y leer el detalle.
          </p>
        </div>

        {/* La caja de CDs */}
        <div
          style={{ perspective: 1400 }}
          className="relative mt-16 h-[360px] w-full md:h-[420px]"
          onClick={() => activeId && setActiveId(null)}
        >
          {/* Superficie de la caja física */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[240px] rounded-2xl border border-carbon-line
                       bg-gradient-to-b from-carbon-soft/40 to-carbon-soft/10"
          />

          <motion.div
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.12}
            dragMomentum={false}
            style={{
              x: trackX,
              rotateY: activeId ? 0 : crateRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-10 left-10 flex items-end md:left-16"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{ marginLeft: index === 0 ? 0 : -OVERLAP }}
                onClick={(event) => event.stopPropagation()}
              >
                <CDCase
                  project={project}
                  isActive={project.id === activeId}
                  isDimmed={Boolean(activeId) && project.id !== activeId}
                  zIndex={projects.length - index}
                  onActivate={() => setActiveId(project.id)}
                  onClose={() => setActiveId(null)}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pista de interacción */}
        <p className="mt-10 font-sans text-xs uppercase tracking-[0.2em] text-bone-dim">
          ← Arrastra para rebuscar →
        </p>
      </div>
    </section>
  );
}