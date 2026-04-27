import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function UserIcon() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.25;
      g.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.08;
    }
  });
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00d4aa", metalness: 0.7, roughness: 0.2,
  }), []);
  return (
    <group ref={g}>
      <mesh position={[0, 0.55, 0]} material={mat}>
        <sphereGeometry args={[0.28, 32, 32]} />
      </mesh>
      <mesh position={[0, -0.15, 0]} material={mat}>
        <capsuleGeometry args={[0.32, 0.25, 16, 16]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.55, 0]}>
        <torusGeometry args={[0.4, 0.015, 8, 48]} />
        <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={3} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function ClipboardIcon() {
  const g = useRef<THREE.Group>(null);
  const check = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.2;
      g.current.position.y = Math.sin(clock.elapsedTime * 0.7 + 1) * 0.08;
    }
    if (check.current) {
      check.current.scale.setScalar(0.8 + Math.sin(clock.elapsedTime * 2) * 0.2);
    }
  });
  return (
    <group ref={g}>
      <mesh>
        <boxGeometry args={[0.55, 0.75, 0.04]} />
        <meshStandardMaterial color="#1a2a25" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0.02]}>
        <boxGeometry args={[0.2, 0.08, 0.04]} />
        <meshStandardMaterial color="#00d4aa" metalness={0.8} roughness={0.15} />
      </mesh>
      {[-0.15, 0, 0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0.025]}>
          <boxGeometry args={[0.35 - i * 0.05, 0.03, 0.005]} />
          <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} transparent opacity={0.7 - i * 0.15} />
        </mesh>
      ))}
      <group ref={check} position={[0.15, -0.22, 0.03]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#00ffc8" emissive="#00ffc8" emissiveIntensity={3} />
        </mesh>
      </group>
    </group>
  );
}

function WalletIcon() {
  const g = useRef<THREE.Group>(null);
  const coin = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (g.current) {
      g.current.rotation.y = Math.sin(t * 0.55) * 0.25;
      g.current.position.y = Math.sin(t * 0.8 + 2) * 0.08;
    }
    if (coin.current) {
      coin.current.position.y = 0.35 + Math.sin(t * 1.8) * 0.12;
      coin.current.rotation.y = t * 2;
    }
  });
  return (
    <group ref={g}>
      <mesh>
        <boxGeometry args={[0.65, 0.45, 0.15]} />
        <meshStandardMaterial color="#0f1f18" metalness={0.6} roughness={0.25} />
      </mesh>

      <mesh position={[0, 0.22, 0.02]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.12]} />
        <meshStandardMaterial color="#00d4aa" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.1]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={coin} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} metalness={0.95} roughness={0.08} />
      </mesh>
    </group>
  );
}

function StepScene({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return <div style={{ width: "100%", height: "100%" }} />;
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 5]} intensity={0.6} />
      <pointLight position={[-2, 1, 2]} intensity={0.8} color="#00d4aa" />
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.2}>
        {children}
      </Float>
      <Sparkles count={20} scale={3} size={1.5} speed={0.3} color="#00d4aa" opacity={0.3} />
    </Canvas>
  );
}

export function StepIcon1() {
  return <StepScene><UserIcon /></StepScene>;
}
export function StepIcon2() {
  return <StepScene><ClipboardIcon /></StepScene>;
}
export function StepIcon3() {
  return <StepScene><WalletIcon /></StepScene>;
}
