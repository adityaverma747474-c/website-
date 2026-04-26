import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, AdaptiveDpr, Text } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function Indian20RupeeCoin() {
  const coin = useRef<THREE.Group>(null);
  const aura = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coin.current) {
      coin.current.rotation.y = t * 1.2;
      coin.current.position.y = Math.sin(t * 0.7) * 0.08;
    }
    if (aura.current) {
      const s = 1.1 + Math.sin(t * 1.5) * 0.08;
      aura.current.scale.set(s, s, s);
      (aura.current.material as THREE.MeshStandardMaterial).opacity = 0.1 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group>
      {/* Glow aura */}
      <mesh ref={aura}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.5} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      <group ref={coin}>
        {/* Outer Ring - 12 Edges (Dodecagonal) - Silver/Nickel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 12]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Inner Circle - Brass/Gold */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.11, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Symbol "₹" on Front */}
        <Text
          position={[0, 0.15, 0.06]}
          fontSize={0.25}
          color="#92400e"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          ₹
        </Text>

        {/* Number "20" on Front */}
        <Text
          position={[0, -0.1, 0.06]}
          fontSize={0.3}
          fontWeight="bold"
          color="#92400e"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          20
        </Text>

        {/* Symbol on Back */}
        <Text
          position={[0, 0, -0.06]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.4}
          color="#92400e"
        >
          ₹
        </Text>
      </group>

      <pointLight position={[0, 0, 1.2]} color="#fbbf24" intensity={1.5} distance={3} />
      <pointLight position={[0, 0, -1.2]} color="#ffffff" intensity={0.8} distance={3} />
    </group>
  );
}

export default function SpinningCoin() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 35 }} gl={{ antialias: false, alpha: true }} dpr={[1, 1.5]}>
      <AdaptiveDpr />
      <ambientLight intensity={0.5} />
      <Indian20RupeeCoin />
      <Sparkles count={20} scale={4} size={1.5} speed={0.3} color="#fbbf24" opacity={0.3} />
    </Canvas>
  );
}
