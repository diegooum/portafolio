import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import RecordStoreScene from './components/three/RecordStoreScene';

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-carbon">
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
      <Loader 
        dataInterpolation={(p) => `Cargando ${p.toFixed(0)}%`}
        containerStyles={{ backgroundColor: '#0B0B0D' }} // Fondo oscuro
        innerStyles={{ width: '300px' }} // Ancho de la barra
        barStyles={{ backgroundColor: '#E26D28' }} // Barra de progreso color naranja (piso)
        dataStyles={{ color: '#F9F9F9', fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'bold' }} // Texto
      />
    </div>
  );
}