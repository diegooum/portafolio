import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls, Text, Html, useCursor, useTexture, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* =========================================================
   PALETA DIORAMA 
   ========================================================= */
const COLORS = {
  wall: '#F9F9F9',
  floor: '#E26D28',
  furniture: '#4A3320',
  academica: '#FFDE59',
  experiencia: '#FF914D',
  proyectos: '#00D26A',
  certificados: '#8C52FF',
  idiomas: '#FF3131',
  // -- Nuevos, solo para elementos decorativos / easter eggs --
  rug: '#2E2E52',
  rugAccent: '#8C52FF',
  plant: '#3E7A55',
  pot: '#B5602E',
  neon: '#00D26A',
  database: '#3B82F6',
  football: '#F5F5F5',
};

/* =========================================================
   ZONAS DE CÁMARA
   ========================================================= */
const ZONES = {
  overview: { position: [0, 2, 7.5], target: [0, 1.5, 0] },
  projects: { position: [0, 2.8, 3.5], target: [0, 2.4, -1.25] },
  wall: { position: [0, 3.5, 3], target: [0, 3.5, 0] },
  contact: { position: [0, 2.1, 2.6], target: [0, 1.6, -0.7] },
};

/* =========================================================
   1. VINILO DECORATIVO 
   ========================================================= */
function DecorativeVinyl({ position, imageUrl }) {
  const texture = useTexture(imageUrl);
  return (
    <group position={position}>
      {/* Marco delgado detrás de la carátula -> sensación de "colgado en la pared" */}
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.86, 0.02]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   2. VINILO INTERACTIVO (¡Levita, vuela y se abre!)
   ========================================================= */
function InteractiveRecordSleeve({ basePosition, color, imageUrl, title, subtitle, pages, zoneTarget, onSelectZone, isActive, onToggle }) {
  const groupRef = useRef();
  const frontCoverRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  useCursor(hovered);

  // Textura de la carátula frontal — mismo hook que usan los vinilos
  // decorativos de la pared. `color` se sigue usando para el lomo/interior
  // y como acento del borde en el HTML, tal como antes.
  const coverTexture = useTexture(imageUrl);

  // Reiniciar la página si se cierra
  useEffect(() => {
    if (!isActive) setCurrentPage(0);
  }, [isActive]);

  // Animación de Vuelo y Apertura de Tapa
  useFrame((_, delta) => {
    // 1. Vuelo del vinilo: Si está activo, vuela hacia la cámara. Si no, vuelve al mueble.
    const targetPos = isActive
      ? new THREE.Vector3(-0.6, 2.6, 1.5) // Posición flotando en el aire frente a ti
      : new THREE.Vector3(...basePosition); // Su lugar original en la repisa

    groupRef.current.position.lerp(targetPos, delta * 6);

    // 2. Apertura de la tapa: Se abre casi por completo
    const targetRotation = isActive ? -Math.PI * 0.95 : 0;
    frontCoverRef.current.rotation.y = THREE.MathUtils.lerp(
      frontCoverRef.current.rotation.y,
      targetRotation,
      delta * 6
    );
  });

  const nextPage = (e) => {
    e.stopPropagation();
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = (e) => {
    e.stopPropagation();
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onToggle(null);
    onSelectZone('overview');
  };

  return (
    // Usamos el ref aquí para mover todo el grupo junto
    <group ref={groupRef} position={basePosition}>

      {/* CARÁTULA TRASERA */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(title);
          onSelectZone(zoneTarget);
        }}
        castShadow
      >
        <boxGeometry args={[0.8, 0.8, 0.02]} />
        <meshPhysicalMaterial color={color} roughness={0.28} clearcoat={0.7} clearcoatRoughness={0.2} />
      </mesh>

      {/* CONTENIDO HTML (¡AHORA ES UN OVERLAY SEGURO QUE FLOTA AL LADO!) */}
      {isActive && (
        <Html
          position={[1.2, 0, 0]} // Aparece a la derecha del vinilo flotante
          center
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              width: '340px',
              backgroundColor: '#ffffff',
              borderLeft: `8px solid ${color}`,
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 20px 40px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.5s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111', textTransform: 'uppercase' }}>
                  {pages[currentPage].title}
                </h3>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#888', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                  {currentPage + 1} / {pages.length}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: '1.5' }}>
                {pages[currentPage].content}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '16px' }}>
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 10px', borderRadius: '4px', border: 'none', cursor: currentPage === 0 ? 'default' : 'pointer', background: currentPage === 0 ? '#f0f0f0' : '#e2e8f0', color: currentPage === 0 ? '#ccc' : '#333' }}
              >
                ◀ ATRÁS
              </button>
              <button
                onClick={handleClose}
                style={{ fontSize: '12px', fontWeight: 'bold', border: 'none', background: 'transparent', color: '#e53e3e', cursor: 'pointer' }}
              >
                CERRAR ✕
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 10px', borderRadius: '4px', border: 'none', cursor: currentPage === pages.length - 1 ? 'default' : 'pointer', background: currentPage === pages.length - 1 ? '#f0f0f0' : '#e2e8f0', color: currentPage === pages.length - 1 ? '#ccc' : '#333' }}
              >
                SIG. ▶
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* CARÁTULA FRONTAL (Tapa que gira) */}
      <group position={[-0.4, 0, 0.02]} ref={frontCoverRef}>
        <mesh position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.02]} />
          <meshPhysicalMaterial map={coverTexture} color="#ffffff" roughness={0.28} clearcoat={0.7} clearcoatRoughness={0.2} />
        </mesh>
        {/* Lomo interior del vinilo -> se ve al abrir la tapa, sigue usando `color` */}
        <mesh position={[0.4, 0, -0.015]}>
          <boxGeometry args={[0.78, 0.78, 0.005]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>

        <Text position={[0.4, 0.1, 0.011]} fontSize={0.09} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold" maxWidth={0.7} textAlign="center">
          {title}
        </Text>
        <Text position={[0.4, -0.1, 0.011]} fontSize={0.05} color="#ffffff" anchorX="center" anchorY="middle">
          {subtitle}
        </Text>
      </group>
    </group>
  );
}

/* =========================================================
   3. ESTRUCTURA DEL ESCENARIO 
   ========================================================= */
function Diorama() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[20, 10]} /><meshStandardMaterial color={COLORS.floor} roughness={0.55} metalness={0.05} /></mesh>
      <mesh position={[0, 4, -2]} receiveShadow><planeGeometry args={[20, 8]} /><meshStandardMaterial color={COLORS.wall} roughness={0.9} /></mesh>
      <mesh position={[0, 0.8, -1]} castShadow receiveShadow><boxGeometry args={[6, 1.6, 1]} /><meshPhysicalMaterial color={COLORS.furniture} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.35} /></mesh>
      <mesh position={[0, 1.8, -1.25]} castShadow receiveShadow><boxGeometry args={[6, 0.4, 0.5]} /><meshPhysicalMaterial color={COLORS.furniture} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.35} /></mesh>
      <mesh position={[0, 3.2, -1.9]} castShadow><boxGeometry args={[4.5, 0.05, 0.2]} /><meshStandardMaterial color={COLORS.furniture} roughness={0.4} metalness={0.4} /></mesh>

      {/* Zócalo delgado -> remata el encuentro piso/pared, evita el "flotando" */}
      <mesh position={[0, 0.02, -1.95]} receiveShadow>
        <boxGeometry args={[20, 0.06, 0.1]} />
        <meshStandardMaterial color="#111111" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* =========================================================
   3.1 DECORACIÓN DE AMBIENTE (100% visual, sin estado propio)
   ========================================================= */

// Alfombra — dos capas superpuestas para dar sensación de textura/trama
// sin necesitar una textura externa.
function Rug() {
  return (
    <group position={[0, 0.015, 1.8]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.1, 48]} />
        <meshStandardMaterial color={COLORS.rug} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.55, 1.75, 48]} />
        <meshStandardMaterial color={COLORS.rugAccent} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 48]} />
        <meshStandardMaterial color={COLORS.rugAccent} roughness={0.9} opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

// Planta de interior — maceta + follaje hecho de esferas achatadas,
// sin geometría externa.
function PottedPlant({ position, scale = 1 }) {
  const leafPositions = [
    [0, 0.55, 0],
    [0.18, 0.42, 0.1],
    [-0.2, 0.45, -0.08],
    [0.1, 0.4, -0.18],
    [-0.12, 0.38, 0.16],
  ];
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.32, 16]} />
        <meshStandardMaterial color={COLORS.pot} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        <meshStandardMaterial color="#3B2A1E" roughness={0.9} />
      </mesh>
      {leafPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0.3, i, 0.2]} castShadow>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial color={COLORS.plant} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Cajas de discos apiladas en el suelo — puro relleno de escena.
function RecordCrates({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.36, 0.5]} />
        <meshStandardMaterial color={COLORS.furniture} roughness={0.6} />
      </mesh>
      <mesh position={[0.06, 0.54, -0.03]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.34, 0.48]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} />
      </mesh>
      {/* Discos asomando por el borde de la caja de arriba */}
      {[COLORS.proyectos, COLORS.certificados, COLORS.idiomas].map((c, i) => (
        <mesh key={c} position={[-0.18 + i * 0.18, 0.73, -0.03]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.01, 24]} />
          <meshStandardMaterial color={c} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Letrero de neón — malla emisiva + luz puntual del mismo color, para
// que además de verse encendida, ilumine la pared alrededor.
function NeonSign({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group position={[0, 5.4, -1.88]}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onToggle('NEON');
          onSelectZone('wall');
        }}
      >
        <planeGeometry args={[2.6, 0.7]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <Text
        fontSize={0.32}
        color={COLORS.neon}
        anchorX="center"
        anchorY="middle"
        outlineWidth={hovered ? 0.012 : 0.006}
        outlineColor={COLORS.neon}
      >
        {'<@diego-medina/>'}
      </Text>
      <pointLight color={COLORS.neon} intensity={hovered ? 1.4 : 0.9} distance={3.5} decay={2} />

      {isActive && (
        <Html position={[0, -0.7, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: `4px solid ${COLORS.neon}` }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#111' }}>Mi portafolio</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Sitio web diseñado para mostrar mi trabajo y trayectoria profesional.</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Easter egg — icono de base de datos (nod a backend / SQL).
function DatabaseIcon({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group
      position={[-2.75, 1.66, -0.65]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle('DATABASE');
        onSelectZone('contact');
      }}
    >
      {[0, 0.09, 0.18].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 20]} />
          <meshStandardMaterial
            color={COLORS.database}
            roughness={0.3}
            metalness={0.4}
            emissive={hovered ? COLORS.database : '#000000'}
            emissiveIntensity={hovered ? 0.25 : 0}
          />
        </mesh>
      ))}

      {isActive && (
        <Html position={[0.3, 0.25, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: `4px solid ${COLORS.database}` }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#111' }}>Backend &amp; Datos</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>NestJS, PostgreSQL y Prisma. Usados en proyectos que necesitaban un backend.</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Easter egg — balón de fútbol estilizado (guiño futbolero).
function FootballNod({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const pentagonOffsets = [
    [0, 0.1, 0.06],
    [0.09, 0.02, 0.05],
    [-0.09, 0.02, 0.05],
    [0.05, -0.08, 0.06],
    [-0.05, -0.08, 0.06],
  ];

  return (
    <group
      position={[2.75, 1.72, -0.65]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle('FOOTBALL');
        onSelectZone('contact');
      }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial
          color={COLORS.football}
          roughness={0.4}
          emissive={hovered ? '#888888' : '#000000'}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>
      {pentagonOffsets.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.035, 5]} />
          <meshStandardMaterial color="#111111" roughness={0.5} />
        </mesh>
      ))}

      {isActive && (
        <Html position={[-0.4, 0.22, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: '4px solid #111' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#111' }}>Nada</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Este es un botón secreto, no hace nada :)</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* =========================================================
   4. UTILERÍA DE LA MESA 
   ========================================================= */
function Turntable({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group position={[2.2, 1.65, -0.7]}>
      <mesh castShadow onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); onToggle('TURNTABLE'); onSelectZone('contact'); }}>
        <boxGeometry args={[1.2, 0.1, 0.8]} /><meshPhysicalMaterial color="#181818" roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
      {/* Mat de fieltro */}
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.35, 0.35, 0.02, 32]} /><meshStandardMaterial color="#EAEAEA" roughness={0.85} /></mesh>
      {/* Disco de vinilo apoyado, ligeramente descentrado del mat */}
      <mesh position={[0, 0.075, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.005, 48]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.006, 32]} />
        <meshStandardMaterial color={COLORS.idiomas} roughness={0.4} />
      </mesh>
      {/* Spindle central */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Brazo + cápsula fonocaptora */}
      <mesh position={[0.4, 0.1, -0.2]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.04, 0.04, 0.4]} /><meshStandardMaterial color="#AAAAAA" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0.24, 0.09, -0.02]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.06, 0.03, 0.08]} />
        <meshStandardMaterial color="#333333" roughness={0.4} />
      </mesh>

      {isActive && (
        <Html position={[0, 0.2, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: '4px solid #111' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Contacto</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>diegomdnp@gmail.com</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#555' }}>+56 9 8214 4956</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#555' }}>
              <a href="https://www.linkedin.com/in/diego-medina-paredes-a698a8241/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
                LinkedIn
              </a>
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function RetroCorner({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const figureTexture = useTexture('/pangoro.png');
  return (
    <group position={[-2.2, 1.625, -0.7]}>
      <mesh castShadow onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); onToggle('RETRO'); onSelectZone('contact'); }}>
        <boxGeometry args={[0.5, 0.05, 0.3]} /><meshPhysicalMaterial color="#8C52FF" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      {/* Bisel + pantalla */}
      <mesh position={[0, 0.028, 0]}><boxGeometry args={[0.28, 0.005, 0.2]} /><meshStandardMaterial color="#0A0A0A" roughness={0.6} /></mesh>
      <mesh position={[0, 0.031, 0]}><planeGeometry args={[0.25, 0.18]} /><meshBasicMaterial color="#274A2E" /></mesh>
      {/* D-Pad */}
      <mesh position={[-0.16, 0.028, 0.08]}><boxGeometry args={[0.05, 0.01, 0.015]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.16, 0.028, 0.08]}><boxGeometry args={[0.015, 0.01, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
      {/* Botones A/B */}
      <mesh position={[0.15, 0.028, 0.09]}><cylinderGeometry args={[0.012, 0.012, 0.01, 12]} /><meshStandardMaterial color="#D6336C" /></mesh>
      <mesh position={[0.19, 0.028, 0.05]}><cylinderGeometry args={[0.012, 0.012, 0.01, 12]} /><meshStandardMaterial color="#D6336C" /></mesh>
      {/* Led de encendido */}
      <mesh position={[-0.2, 0.028, -0.1]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial color={COLORS.proyectos} emissive={COLORS.proyectos} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.4, 0.25, -0.1]} castShadow><planeGeometry args={[0.4, 0.4]} /><meshBasicMaterial map={figureTexture} transparent={true} side={THREE.DoubleSide} /></mesh>

      {isActive && (
        <Html position={[0, 0.2, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: '4px solid #8C52FF' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#111' }}>Ocio</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Me gusta escuchar música, los videojuegos, aprender nuevas cosas y pasar tiempo con amigos :p</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function ThesisFolder({ onSelectZone, isActive, onToggle }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group position={[-1.1, 1.62, -0.7]}>
      <mesh rotation={[0, 0.2, 0]} castShadow onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); onToggle('THESIS'); onSelectZone('projects'); }}>
        <boxGeometry args={[0.5, 0.04, 0.7]} />
        <meshPhysicalMaterial color="#FFDE59" roughness={0.55} clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      <mesh position={[0.05, 0.02, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.48, 0.01, 0.68]} />
        <meshStandardMaterial color="#FFF" roughness={0.8} />
      </mesh>
      {/* Separador de página asomando */}
      <mesh position={[0.02, 0.03, 0.32]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.04, 0.01, 0.12]} />
        <meshStandardMaterial color={COLORS.proyectos} roughness={0.5} />
      </mesh>
      {/* Lápiz apoyado al lado */}
      <group position={[-0.32, 0.03, 0.15]} rotation={[0, 0.9, Math.PI / 2 - 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
          <meshStandardMaterial color="#F2C14E" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <coneGeometry args={[0.012, 0.03, 8]} />
          <meshStandardMaterial color="#3B2A1E" roughness={0.6} />
        </mesh>
      </group>

      {isActive && (
        <Html position={[0, 0.2, 0]} center distanceFactor={4} zIndexRange={[100, 0]}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px', borderLeft: '4px solid #FFDE59' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Actualmente...</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Me encuentro haciendo mi tesis, el tema central es sobre el Burnout Digital en estudiantes de educación superior.</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function LanguageBooks() {
  return (
    <group position={[1.1, 1.64, -0.7]}>
      <mesh position={[0, 0, 0]} rotation={[0, -0.1, 0]} castShadow><boxGeometry args={[0.4, 0.08, 0.6]} /><meshStandardMaterial color="#FF3131" roughness={0.5} /></mesh>
      <mesh position={[0.02, 0.08, 0.05]} rotation={[0, 0.1, 0]} castShadow><boxGeometry args={[0.38, 0.07, 0.55]} /><meshStandardMaterial color="#FFDE59" roughness={0.5} /></mesh>
      <mesh position={[-0.03, 0.15, -0.02]} rotation={[0, -0.2, 0]} castShadow><boxGeometry args={[0.39, 0.06, 0.58]} /><meshStandardMaterial color="#00D26A" roughness={0.5} /></mesh>
    </group>
  );
}

function WineAndPhoto() {
  const photoTexture = useTexture('/diego.jpg');
  return (
    <group position={[0, 1.6, -0.7]}>
      <mesh position={[-0.3, 0.25, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.3, 16]} /><meshPhysicalMaterial color="#2E0814" transparent opacity={0.9} roughness={0.05} transmission={0.6} thickness={0.3} /></mesh>
      <mesh position={[-0.3, 0.45, 0]} castShadow><cylinderGeometry args={[0.02, 0.06, 0.15, 16]} /><meshPhysicalMaterial color="#2E0814" transparent opacity={0.9} roughness={0.05} transmission={0.6} /></mesh>
      {/* Corcho */}
      <mesh position={[-0.3, 0.54, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.06, 12]} />
        <meshStandardMaterial color="#D8B991" roughness={0.8} />
      </mesh>
      {/* Copa apoyada al lado */}
      <group position={[-0.15, 0, 0.12]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.02, 0.16, 16, 1, true]} />
          <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.25} roughness={0.05} transmission={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.12, 8]} />
          <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.3} roughness={0.05} transmission={0.9} />
        </mesh>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.3} roughness={0.05} transmission={0.9} />
        </mesh>
      </group>
      <group position={[0.3, 0.15, 0]} rotation={[0, -0.4, 0.1]}>
        <mesh castShadow><boxGeometry args={[0.3, 0.4, 0.04]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
        <mesh position={[0, 0, 0.021]}><planeGeometry args={[0.26, 0.36]} /><meshBasicMaterial map={photoTexture} /> </mesh>
      </group>
    </group>
  );
}

/* =========================================================
   ESCENA PRINCIPAL 
   ========================================================= */
export default function RecordStoreScene() {
  const cameraControlsRef = useRef();
  const [activeItem, setActiveItem] = useState(null);

  const handleSelectZone = (nextZone) => {
    const { position, target } = ZONES[nextZone] ?? ZONES.overview;
    cameraControlsRef.current?.setLookAt(
      position[0], position[1], position[2],
      target[0], target[1], target[2],
      true
    );
  };

  const handleToggleItem = (itemName) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  useEffect(() => {
    handleSelectZone('overview');
  }, []);

  return (
    <>
      {/* Luz de relleno suave (cielo/piso) en vez de un ambient plano al 2.5 —
          esto es lo que más aplanaba la escena original. */}
      <hemisphereLight args={['#FFF6E5', COLORS.floor, 0.55]} />
      <ambientLight intensity={0.35} color="#ffffff" />

      {/* Luz principal (sol/foco de tienda), con sombras de mayor resolución */}
      <directionalLight
        position={[2, 8, 5]}
        intensity={1.6}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#DCE8FF" />

      {/* Lámpara de escritorio — foco cálido puntual sobre la mesa */}
      <pointLight position={[0, 3, 0.5]} intensity={0.9} color="#FFD9A0" distance={5} decay={2} />

      {/* Acento neón (coherente con el letrero de la pared) */}
      <pointLight position={[0, 4.8, -1.6]} intensity={0.6} color={COLORS.neon} distance={4} decay={2} />

      {/* Polvo suspendido — atmósfera sutil, no decorativa de más */}
      <Sparkles count={30} scale={[6, 3, 3]} size={1.5} speed={0.25} opacity={0.25} color="#FFF5E6" position={[0, 2.5, 0]} />

      <Diorama />

      {/* --- LA PARED --- */}
      <DecorativeVinyl position={[-1.5, 3.65, -1.85]} imageUrl="/daft-punk.jpg" />
      <DecorativeVinyl position={[-0.5, 3.65, -1.85]} imageUrl="/arctic.jpg" />
      <DecorativeVinyl position={[0.5, 3.65, -1.85]} imageUrl="/frank-ocean.jpg" />
      <DecorativeVinyl position={[1.5, 3.65, -1.85]} imageUrl="/tyler.jpg" />
      <NeonSign onSelectZone={handleSelectZone} isActive={activeItem === 'NEON'} onToggle={handleToggleItem} />

      {/* --- EL MUEBLE (Vinilos voladores) --- */}
      {/* 
        NOTA: Ahora se usa basePosition en lugar de position para que el vinilo 
        recuerde dónde debe regresar después de volar hacia ti.
      */}
      <InteractiveRecordSleeve
        basePosition={[-2, 2.4, -1.25]} color={COLORS.academica} imageUrl="/covers/academica.jpg"
        title="ACADÉMICA" subtitle="EXPERIENCIA"
        zoneTarget="projects" onSelectZone={handleSelectZone}
        isActive={activeItem === "ACADÉMICA"}
        onToggle={handleToggleItem}
        pages={[
          { title: "U. de Talca", content: "Estudiante de 5to año en Ingeniería en Informática Empresarial." },
          { title: "FH Münster", content: "Intercambio académico internacional cursando Bachelor of Business Administration (BBA) en Alemania durante el primer semestre del 2025." },
          { title: "Liderazgo", content: "Vicepresidente del Centro de Estudiantes. Encargado de planificar actividades y participar en reuniones relacionadas a la carrera." }

        ]}
      />

      <InteractiveRecordSleeve
        basePosition={[-1, 2.4, -1.25]} color={COLORS.experiencia} imageUrl="/covers/experiencia.jpg"
        title="EXPERIENCIA" subtitle="LABORAL"
        zoneTarget="projects" onSelectZone={handleSelectZone}
        isActive={activeItem === "EXPERIENCIA"}
        onToggle={handleToggleItem}
        pages={[
          { title: "Ayudante", content: "Apoyo a los estudiantes de IIE de la Universidad de Talca en los ramos de Algoritmos, Programación y POO, dando clases y revisando controles" },
          { title: "Desarrollador", content: "Diseño e implementación de un sistema de gestión utilizando Python y Excel para optimizar la administración de liquidaciones, boletas y notificaciones automáticas de pago" },
          { title: "Apoyo técnico", content: "Apoyo al departamento de Relaciones Internacionales de la Universidad de Talca, cumpliendo funciones con programas ofimáticos y haciendo uso de PhpMyAdmin" },
          { title: "Desarrollador", content: "Creación de un sistema de registro de actividades académicas de la mano con Vinculación con el Medio de la FEN, Utalca" }
        ]}
      />

      <InteractiveRecordSleeve
        basePosition={[0, 2.4, -1.25]} color={COLORS.proyectos} imageUrl="/covers/proyectos.jpg"
        title="PROYECTOS" subtitle="DESTACADOS"
        zoneTarget="projects" onSelectZone={handleSelectZone}
        isActive={activeItem === "PROYECTOS"}
        onToggle={handleToggleItem}
        pages={[
          { title: "GachaDex", content: "Aplicación Full-Stack desplegada en Netlify. Implementa algoritmos de Machine Learning (KNN) para recomendar Pokémon." },

        ]}
      />

      <InteractiveRecordSleeve
        basePosition={[1, 2.4, -1.25]} color={COLORS.certificados} imageUrl="/covers/certificados.jpg"
        title="CERTIFICADOS" subtitle="LOGROS"
        zoneTarget="projects" onSelectZone={handleSelectZone}
        isActive={activeItem === "CERTIFICADOS"}
        onToggle={handleToggleItem}
        pages={[
          { title: "Certificaciones", content: "Excel - Nivel Avanzado (Santander Open Academy)" },
          { title: "Certificaciones", content: "Marketing Digital (University of Chicago - Santander Open Academy)" },
          { title: "Certificaciones", content: "Scrum Foundation Professional Certification - SFPC (CertiProf)" },
          { title: "Certificaciones", content: "Transformación Digital (MIT Profesional Education - Santander Open Academy)" },
          { title: "Certificaciones", content: "Google: Inteligencia Artificial y Productividad (Google - Santander Open Academy)" },
          { title: "Certificaciones", content: "Java - Sololearn" },
          { title: "Certificaciones", content: "JavaScript - Sololearn" },
        ]}
      />

      <InteractiveRecordSleeve
        basePosition={[2, 2.4, -1.25]} color={COLORS.idiomas} imageUrl="/covers/idiomas.jpg"
        title="IDIOMAS" subtitle="HABILIDADES"
        zoneTarget="projects" onSelectZone={handleSelectZone}
        isActive={activeItem === "IDIOMAS"}
        onToggle={handleToggleItem}
        pages={[
          { title: "Idiomas", content: "Español: Nativo.\n Inglés: B2 \t Alemán: A2 .\n Francés: A1" },
        ]}
      />

      {/* --- LA MESA --- */}
      <Turntable onSelectZone={handleSelectZone} isActive={activeItem === 'TURNTABLE'} onToggle={handleToggleItem} />
      <RetroCorner onSelectZone={handleSelectZone} isActive={activeItem === 'RETRO'} onToggle={handleToggleItem} />
      <ThesisFolder onSelectZone={handleSelectZone} isActive={activeItem === 'THESIS'} onToggle={handleToggleItem} />
      <LanguageBooks />
      <WineAndPhoto />
      <DatabaseIcon onSelectZone={handleSelectZone} isActive={activeItem === 'DATABASE'} onToggle={handleToggleItem} />
      <FootballNod onSelectZone={handleSelectZone} isActive={activeItem === 'FOOTBALL'} onToggle={handleToggleItem} />

      {/* --- AMBIENTE: alfombra, plantas, cajas y sombra de contacto --- */}
      <Rug />
      <PottedPlant position={[-4.6, 0, -1.2]} scale={1.3} />
      <PottedPlant position={[4.6, 0, -0.6]} scale={1.05} />
      <RecordCrates position={[-4.3, 0, 1.1]} />
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={12}
        blur={2.2}
        far={4}
        resolution={512}
        color="#000000"
      />

      {/* CÚPULA DE ESCAPE */}
      <mesh onClick={(e) => {
        if (e.eventObject === e.object) {
          handleSelectZone('overview');
          setActiveItem(null);
        }
      }}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial visible={false} side={THREE.BackSide} />
      </mesh>

      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={3}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2}
        smoothTime={0.4}
      />
    </>
  );
}