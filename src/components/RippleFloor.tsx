import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { floorFragment, floorVertex } from "../lib/shaders";

type Props = {
  progress: React.RefObject<number>;
  reveal: React.RefObject<number>;
};

export function RippleFloor({ progress, reveal }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSpread: { value: 0.6 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uReveal.value = reveal.current;
    // The reflection pool widens as the narrow trunk becomes the wide cube
    mat.uniforms.uSpread.value = THREE.MathUtils.lerp(
      0.55,
      1.5,
      THREE.MathUtils.smoothstep(progress.current, 0.5, 0.85),
    );
  });

  return (
    <group>
      {/* Opaque ground so the starfield stops at the horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Thin neon rings + fake reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]}>
        <planeGeometry args={[26, 26]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={floorVertex}
          fragmentShader={floorFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
