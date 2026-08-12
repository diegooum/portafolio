import { motion } from 'framer-motion';

/**
 * FooterContact
 * ---------------------------------------------------------
 * Cierre de página de alto impacto: un headline masivo (mismo
 * peso visual que el Hero, para que la página "respire" con
 * simetría de intención aunque el layout sea asimétrico) seguido
 * de las vías de contacto reales y el CTA de descarga de CV.
 * ---------------------------------------------------------
 */

const CONTACT_LINKS = [
  {
    label: 'Correo institucional',
    value: 'diego.medina@utalca.cl',
    href: 'mailto:diego.medina@utalca.cl',
  },
  {
    label: 'Correo personal',
    value: 'diegomedinaparedes@gmail.com',
    href: 'mailto:diegomedinaparedes@gmail.com',
  },
];

export default function FooterContact({
  cvUrl = '/cv-diego-medina-paredes.pdf',
}) {
  return (
    <footer id="contacto" className="relative w-full overflow-hidden bg-carbon px-6 pb-16 pt-32 md:px-16 lg:px-24">
      {/* Aura pastel de cierre — sutil, asimétrica, coherente con el Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-[-10%] h-[380px] w-[380px]
                   rounded-full bg-radial-mint blur-3xl animate-breathe"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 font-sans text-sm font-medium uppercase tracking-[0.25em] text-bone-muted"
        >
          Disponible para nuevos proyectos
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl font-display text-display-xl font-black leading-[0.95] text-bone"
        >
          ¿Construimos
          <br />
          algo <span className="text-lavender">juntos</span>?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col justify-between gap-12 md:flex-row md:items-end"
        >
          {/* CTA principal — descarga de CV con glow pastel en hover */}
          <a
            href={cvUrl}
            download
            className="group inline-flex w-fit items-center gap-4 rounded-full border border-carbon-line
                       bg-carbon-raised px-8 py-4 font-sans text-base font-medium text-bone
                       transition-all duration-500 ease-premium
                       hover:border-lavender/50 hover:shadow-aura-lavender"
          >
            Descargar CV
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-line/60 text-sm transition-transform duration-500 ease-premium group-hover:translate-y-0.5">
              ↓
            </span>
          </a>

          {/* Vías de contacto */}
          <div className="flex flex-col gap-4">
            {CONTACT_LINKS.map((contact) => (
              <a
                key={contact.href}
                href={contact.href}
                className="group flex flex-col gap-0.5 md:items-end"
              >
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-bone-dim">
                  {contact.label}
                </span>
                <span className="font-sans text-base font-medium text-bone-muted transition-colors duration-300 ease-premium group-hover:text-mint">
                  {contact.value}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Línea final */}
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-carbon-line pt-8 md:flex-row md:items-center">
          <p className="font-sans text-xs text-bone-dim">
            Diego Medina Paredes — Ingeniero en Informática Empresarial
          </p>
          <p className="font-sans text-xs text-bone-dim">
            Diseñado y construido a mano, sin plantillas.
          </p>
        </div>
      </div>
    </footer>
  );
}