import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function shell(count: number, inner: number, outer: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = inner + Math.random() * (outer - inner);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    // Squashed vertically and lifted so stars sit above the horizon
    arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.5 + 0.6;
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
}

/** Two static layers: a dim dust field plus a few brighter pinpoints. */
export function Starfield({ count = 2200 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null);

  const dust = useMemo(() => shell(count, 9, 24), [count]);
  const bright = useMemo(
    () => shell(Math.floor(count * 0.14), 8, 18),
    [count],
  );

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.006;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#7f9ad6"
          transparent
          opacity={0.42}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bright, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#cfe2ff"
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
