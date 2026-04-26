import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, AdaptiveDpr } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function Mascot() {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffc099", roughness: 0.5 }), []);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#00d4aa", roughness: 0.6 }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.9) * 0.05;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.15, 0.05);
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, mouse.x * 0.4, 0.05);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -mouse.y * 0.2, 0.05);
    }
  });

  return (
    <group ref={group} scale={0.75}>
      <group ref={head} position={[0, 1.65, 0]}>
        <mesh material={skinMat}><sphereGeometry args={[0.3, 12, 12]} /></mesh>
        <mesh position={[0, -0.1, 0.26]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.08, 0.01, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#111820" />
        </mesh>
      </group>
      <mesh position={[0, 0.9, 0]} material={shirtMat}><capsuleGeometry args={[0.3, 0.5, 8, 8]} /></mesh>
      <group position={[0.4, 1.1, 0]}><mesh material={shirtMat}><capsuleGeometry args={[0.08, 0.3, 8, 8]} /></mesh></group>
      <group position={[-0.4, 1.1, 0]}><mesh material={shirtMat}><capsuleGeometry args={[0.08, 0.3, 8, 8]} /></mesh></group>
    </group>
  );
}

export default function MascotScene() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <Canvas camera={{ position: [0, 1, 3.5], fov: 35 }} gl={{ antialias: false, alpha: true }} dpr={1}>
      <AdaptiveDpr />
      <ambientLight intensity={0.5} />
      <Mascot />
    </Canvas>
  );
}
