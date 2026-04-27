import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, MeshTransmissionMaterial, Environment, AdaptiveDpr } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function Character() {
  const group = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffc099", roughness: 0.4 }), []);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#00d4aa", roughness: 0.6 }), []);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.7 }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.8) * 0.08 - 0.45;
      group.current.rotation.y = Math.sin(t * 0.3) * 0.06 + 0.15;
    }
    if (armR.current) {
      armR.current.rotation.x = -1.1 + Math.sin(t * 2.2) * 0.12;
      armR.current.rotation.z = -0.2;
    }
  });

  return (
    <group ref={group} position={[-1.4, -0.45, 0.6]} scale={0.85}>
      <mesh position={[0, 2.15, 0]} material={skinMat}><sphereGeometry args={[0.26, 16, 16]} /></mesh>
      <mesh position={[0, 1.85, 0]} material={skinMat}><cylinderGeometry args={[0.08, 0.08, 0.2, 8]} /></mesh>
      <mesh position={[0, 1.35, 0]} material={shirtMat}><capsuleGeometry args={[0.32, 0.6, 8, 16]} /></mesh>
      <group position={[-0.4, 1.6, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.25, 0]} material={shirtMat}><capsuleGeometry args={[0.09, 0.4, 8, 8]} /></mesh>
        <mesh position={[0, -0.55, 0]} material={skinMat}><sphereGeometry args={[0.07, 8, 8]} /></mesh>
      </group>
      <group position={[0.4, 1.6, 0.1]} ref={armR}>
        <mesh position={[0, -0.25, 0]} material={shirtMat}><capsuleGeometry args={[0.09, 0.4, 8, 8]} /></mesh>
        <mesh position={[0, -0.55, 0]} material={skinMat}><sphereGeometry args={[0.07, 8, 8]} /></mesh>
      </group>
      <mesh position={[-0.15, 0.55, 0]} material={pantsMat}><capsuleGeometry args={[0.11, 0.6, 8, 8]} /></mesh>
      <mesh position={[0.15, 0.55, 0]} material={pantsMat}><capsuleGeometry args={[0.11, 0.6, 8, 8]} /></mesh>
    </group>
  );
}

function Phone() {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);
  const coin = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.55) * 0.09;
      group.current.rotation.y = Math.sin(t * 0.35) * 0.12 + 0.18;
    }
    if (coin.current) {
      coin.current.rotation.y = t * 2;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={group} position={[0.7, 0.25, 0]}>

        <mesh castShadow>
          <boxGeometry args={[1.15, 2.05, 0.08]} />
          <MeshTransmissionMaterial
            samples={4}
            thickness={0.2}
            chromaticAberration={0.02}
            distortion={0}
            color="#111"
            roughness={0.2}
          />
        </mesh>

        <mesh ref={screen} position={[0, 0, 0.045]}>
          <planeGeometry args={[0.98, 1.85]} />
          <meshStandardMaterial color="#0a2a1f" emissive="#00d4aa" emissiveIntensity={0.35} />
        </mesh>

        <group ref={coin} position={[0, -0.2, 0.052]} scale={0.25}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.08, 12]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
        </group>

        {[0.65, 0.45, 0.25].map((y, i) => (
          <mesh key={i} position={[0, y, 0.052]}>
            <boxGeometry args={[0.6, 0.05, 0.005]} />
            <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={1} transparent opacity={0.8} />
          </mesh>
        ))}
        <pointLight position={[0, 0, 0.5]} color="#00d4aa" intensity={1} distance={2} />
      </group>
    </Float>
  );
}

function InteractionWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.1, 0.05);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.05, 0.05);
    }
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.8, 5.5], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <AdaptiveDpr />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 2]} intensity={1} color="#00d4aa" />
      <InteractionWrapper>
        <Character />
        <Phone />
      </InteractionWrapper>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={8} blur={2} color="#00d4aa" />
    </Canvas>
  );
}
