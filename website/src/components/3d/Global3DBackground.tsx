import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useScrollY } from "@/hooks/use-scroll";

function FloatingObject({ position, speed, rotationSpeed, scale, color }: any) {
  const mesh = useRef<THREE.Mesh>(null);
  const scrollY = useScrollY();

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * rotationSpeed;
    mesh.current.rotation.y = t * rotationSpeed * 0.8;
    mesh.current.position.y = position[1] - (scrollY * speed * 0.005);
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh} position={position} scale={scale}>
        {Math.random() > 0.5 ? (
          <torusGeometry args={[1, 0.3, 12, 24]} />
        ) : (
          <octahedronGeometry args={[1, 0]} />
        )}
        <meshPhysicalMaterial
          transparent
          opacity={0.15}
          color={color}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const { viewport } = useThree();
  
  const objects = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 4,
        -5 - Math.random() * 8
      ],
      speed: 0.05 + Math.random() * 0.2,
      rotationSpeed: 0.05 + Math.random() * 0.2,
      scale: 0.4 + Math.random() * 1.2,
      color: i % 2 === 0 ? "#00d4aa" : "#ffffff"
    }));
  }, [viewport]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      
      {objects.map((obj) => (
        <FloatingObject key={obj.id} {...obj} />
      ))}
    </>
  );
}

export default function Global3DBackground() {
  const [ok, setOk] = useState(false);
  const [dpr, setDpr] = useState(1);
  
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={dpr}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <AdaptiveDpr pixelated />
        <Scene />
      </Canvas>
    </div>
  );
}
