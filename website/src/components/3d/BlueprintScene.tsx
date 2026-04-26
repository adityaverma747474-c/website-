import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, AdaptiveDpr } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

interface Props { progress: number; }

function BlueprintLines({ progress }: Props) {
  const group = useRef<THREE.Group>(null);
  
  const buildEdges = useMemo(() => [
    [-0.5, 0, -0.4, 0.5, 0, -0.4], [0.5, 0, -0.4, 0.5, 0, 0.4],
    [0.5, 0, 0.4, -0.5, 0, 0.4], [-0.5, 0, 0.4, -0.5, 0, -0.4],
    [-0.5, 0, -0.4, -0.5, 1.2, -0.4], [0.5, 0, -0.4, 0.5, 1.2, -0.4],
    [0.5, 0, 0.4, 0.5, 1.2, 0.4], [-0.5, 0, 0.4, -0.5, 1.2, 0.4],
    [-0.5, 1.2, -0.4, 0.5, 1.2, -0.4], [0.5, 1.2, -0.4, 0.5, 1.2, 0.4],
    [0.5, 1.2, 0.4, -0.5, 1.2, 0.4], [-0.5, 1.2, 0.4, -0.5, 1.2, -0.4],
    [0, 1.2, 0, 0, 2.0, 0]
  ] as [number, number, number, number, number, number][], []);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.1;
  });

  const buildProgress = Math.max((progress - 0.2) / 0.8, 0);

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {buildEdges.map((line, i) => {
        const frac = Math.min(buildProgress * buildEdges.length - i, 1);
        if (frac <= 0) return null;
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints([
              new THREE.Vector3(line[0], line[1], line[2]),
              new THREE.Vector3(line[0] + (line[3] - line[0]) * frac, line[1] + (line[4] - line[1]) * frac, line[2] + (line[5] - line[2]) * frac)
            ])} />
            <lineBasicMaterial color="#00ffc8" transparent opacity={0.6} />
          </line>
        );
      })}
    </group>
  );
}

export default function BlueprintScene({ progress }: Props) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;

  return (
    <Canvas camera={{ position: [2, 1, 2], fov: 40 }} gl={{ antialias: false, alpha: true }} dpr={1}>
      <AdaptiveDpr />
      <ambientLight intensity={0.5} />
      <BlueprintLines progress={progress} />
    </Canvas>
  );
}
