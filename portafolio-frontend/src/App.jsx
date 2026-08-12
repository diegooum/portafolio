import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RecordStoreScene from './components/three/RecordStoreScene';

/**
 * App
 * ---------------------------------------------------------
 * Punto de entrada del "Metaverso de la disquería". El scroll
 * vertical tradicional queda descartado: toda la experiencia
 * vive dentro de un único <Canvas> a pantalla completa.
 *
 * La UI HTML que queda fuera del Canvas es mínima a propósito
 * (título + pista de interacción) — el resto de la información
 * aparece dentro de la escena vía overlays de <Html> (drei)
 * cuando el usuario interactúa con un objeto 3D.
 * ---------------------------------------------------------
 */
export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-carbon">
      {/* Encabezado mínimo — fuera del Canvas, siempre visible */}
      <div className="pointer-events-none absolute left-6 top-6 z-10 md:left-10 md:top-10">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-bone-muted">
          Diego Medina Paredes
        </p>
        <p className="mt-1 font-sans text-xs text-bone-dim">
          Arrastra para mirar alrededor · Click en los objetos para interactuar
        </p>
      </div>

      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 3, 11], fov: 50, near: 0.1, far: 100 }}
      >
        <color attach="background" args={['#0B0B0D']} />
        <fog attach="fog" args={['#0B0B0D', 12, 26]} />

        <Suspense fallback={null}>
          <RecordStoreScene />
        </Suspense>
      </Canvas>
    </div>
  );
}