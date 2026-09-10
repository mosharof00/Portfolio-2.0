import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  generateCube,
  generateSphere,
  generateTree,
  hash,
  stampTextOnCube,
} from "../lib/shapes";
import { particleFragment, particleVertex } from "../lib/shaders";

type Props = {
  count: number;
  progress: React.RefObject<number>;
  reveal: React.RefObject<number>;
  mouse: React.RefObject<{ x: number; y: number }>;
};

/** Primary cloud + inverted water reflection (same buffers, two draws). */
export function ParticleMorph({ count, progress, reveal, mouse }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const mainMat = useRef<THREE.ShaderMaterial>(null);
  const mirrorMat = useRef<THREE.ShaderMaterial>(null);

  const buffers = useMemo(() => {
    const sphere = generateSphere(count);
    const tree = generateTree(count);
    const cube = stampTextOnCube(generateCube(count), "VISTORA");
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = hash(i, 99);
    return {
      positions: new Float32Array(count * 3),
      sphere,
      tree,
      cube,
      seeds,
    };
  }, [count]);

  const mainUniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: count > 100_000 ? 1.7 : 2.2 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0.35 },
      uMirror: { value: 0 },
    }),
    [count],
  );

  const mirrorUniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: count > 100_000 ? 1.5 : 1.9 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
      uMirror: { value: 1 },
    }),
    [count],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = progress.current ?? 0;
    const r = reveal.current ?? 0;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    for (const mat of [mainMat.current, mirrorMat.current]) {
      if (!mat) continue;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uProgress.value = p;
      mat.uniforms.uReveal.value = r;
      mat.uniforms.uMouse.value.set(mx, my);
    }

    if (groupRef.current) {
      const spin = 0.008 + THREE.MathUtils.smoothstep(p, 0.6, 0.85) * 0.07;
      groupRef.current.rotation.y += spin * 0.016;
    }
  });

  // Two draws share the same CPU buffers: live cloud + water mirror
  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSphere"
            args={[buffers.sphere.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aTree"
            args={[buffers.tree.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aCube"
            args={[buffers.cube.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSeed" args={[buffers.seeds, 1]} />
          <bufferAttribute
            attach="attributes-aSphereHeat"
            args={[buffers.sphere.heat, 1]}
          />
          <bufferAttribute
            attach="attributes-aTreeHeat"
            args={[buffers.tree.heat, 1]}
          />
          <bufferAttribute
            attach="attributes-aCubeHeat"
            args={[buffers.cube.heat, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={mainMat}
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={mainUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSphere"
            args={[buffers.sphere.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aTree"
            args={[buffers.tree.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aCube"
            args={[buffers.cube.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSeed" args={[buffers.seeds, 1]} />
          <bufferAttribute
            attach="attributes-aSphereHeat"
            args={[buffers.sphere.heat, 1]}
          />
          <bufferAttribute
            attach="attributes-aTreeHeat"
            args={[buffers.tree.heat, 1]}
          />
          <bufferAttribute
            attach="attributes-aCubeHeat"
            args={[buffers.cube.heat, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={mirrorMat}
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={mirrorUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
