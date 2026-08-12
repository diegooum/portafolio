import { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * CDCase
 * ---------------------------------------------------------
 * Un proyecto renderizado como un estuche de CD (jewel case):
 *
 *  - En reposo, descansa "recostado" en la caja con una leve
 *    inclinación (BASELINE_TILT), como discos apoyados unos
 *    contra otros.
 *  - Al pasar el cursor, se endereza y sigue el mouse con un
 *    tilt real (rotateX/rotateY vía spring), y sube su z-index.
 *  - Al hacer click, "levita" hacia el frente (y, scale, aura)
 *    y despliega el booklet con la info del proyecto.
 * ---------------------------------------------------------
 */

const BASELINE_TILT = -16; // grados — inclinación de "apoyado en la caja"
const CASE_WIDTH = 208;
const CASE_HEIGHT = 208;

export default function CDCase({
  project,
  isActive,
  isDimmed,
  zIndex,
  onActivate,
  onClose,
}) {
  const caseRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(BASELINE_TILT);
  const springConfig = { stiffness: 260, damping: 22, mass: 0.4 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Al activarse, el estuche se endereza para mirar de frente.
  useEffect(() => {
    if (isActive) {
      rotateX.set(0);
      rotateY.set(0);
    } else {
      rotateX.set(0);
      rotateY.set(BASELINE_TILT);
    }
  }, [isActive, rotateX, rotateY]);

  const handleMouseMove = (event) => {
    if (isActive) return;
    const bounds = caseRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    // Se endereza respecto a la línea base y sigue al cursor.
    rotateY.set(BASELINE_TILT * 0.25 + (px - 0.5) * 22);
    rotateX.set((0.5 - py) * 10);
  };

  const handleMouseLeave = () => {
    if (isActive) return;
    rotateX.set(0);
    rotateY.set(BASELINE_TILT);
  };

  const primaryTech = project.technologies?.[0];

  return (
    <motion.div
      ref={caseRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !isActive && onActivate()}
      layout
      animate={{
        y: isActive ? -56 : 0,
        scale: isActive ? 1.22 : 1,
        opacity: isDimmed ? 0.35 : 1,
        filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: CASE_WIDTH,
        height: CASE_HEIGHT,
        flex: '0 0 auto',
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 900,
        zIndex: isActive ? 100 : zIndex,
      }}
      className={`group relative select-none ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Disco asomando por el borde superior */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-26px] h-16 w-16 -translate-x-1/2 rounded-full opacity-90"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.accentColor}55 0%, ${project.accentColor}22 45%, transparent 70%)`,
        }}
      >
        <span
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: `${project.accentColor}88` }}
        />
      </div>

      {/* Cuerpo del estuche — plástico translúcido */}
      <div
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-md border
                   bg-carbon-raised/70 backdrop-blur-md transition-colors duration-500 ease-premium"
        style={{
          borderColor: `${project.accentColor}40`,
          boxShadow: isActive
            ? `0 30px 80px -20px ${project.accentColor}66`
            : `0 12px 30px -14px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Reflejo pastel diagonal del plástico */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70"
          style={{
            background: `linear-gradient(115deg, ${project.accentColor}33 0%, transparent 35%, transparent 65%, ${project.accentColor}22 100%)`,
          }}
        />

        {/* Etiqueta / sticker estilo "Parental Advisory" con la tech principal */}
        {primaryTech && (
          <div
            aria-hidden="true"
            className="absolute right-3 top-3 -rotate-6 rounded-[2px] border border-white/70 bg-black/85 px-2 py-1"
          >
            <p className="font-sans text-[7px] font-black leading-none tracking-wide text-white">
              EXPLICIT
              <br />
              CODE CONTENT
            </p>
          </div>
        )}

        {/* Título en el lomo/portada */}
        <div className="relative z-10 p-4">
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: project.accentColor }}
          >
            {primaryTech ?? 'Proyecto'}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-bone">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Booklet — se despliega hacia la derecha cuando el CD está activo */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -24, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -24, rotateY: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ transformPerspective: 1000, transformOrigin: 'left center' }}
            className="absolute left-[calc(100%+18px)] top-1/2 z-[110] w-[320px] -translate-y-1/2
                       rounded-md border border-white/10 bg-carbon-soft/95 p-6 backdrop-blur-xl
                       shadow-2xl md:w-[380px]"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              aria-label="Cerrar"
              className="absolute right-4 top-4 font-sans text-sm text-bone-dim transition-colors duration-300 hover:text-bone"
            >
              ✕
            </button>

            <p
              className="font-sans text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: project.accentColor }}
            >
              {project.subtitle}
            </p>

            <h4 className="mt-2 font-display text-2xl font-bold text-bone">
              {project.title}
            </h4>

            <p className="mt-4 font-sans text-sm leading-relaxed text-bone-muted/90">
              {project.description}
            </p>

            {/* Stickers de precio/tech dentro del libreto */}
            {project.technologies?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-dashed px-2 py-1 font-sans text-[11px] font-medium text-bone-muted"
                    style={{ borderColor: `${project.accentColor}55` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {(project.repoUrl || project.demoUrl) && (
              <div className="mt-6 flex gap-5 border-t border-white/10 pt-5">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="font-sans text-sm font-medium text-bone underline-offset-4 hover:underline"
                  >
                    Ver demo ↗
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="font-sans text-sm font-medium text-bone-muted underline-offset-4 hover:text-bone hover:underline"
                  >
                    Repositorio ↗
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}