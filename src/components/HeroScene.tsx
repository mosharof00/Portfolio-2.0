import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ParticleMorph } from "./ParticleMorph";
import { RippleFloor } from "./RippleFloor";
import { Starfield } from "./Starfield";
import { pickParticleCount } from "../lib/shapes";

type SceneProps = {
  progress: React.RefObject<number>;
  reveal: React.RefObject<number>;
  mouse: React.RefObject<{ x: number; y: number }>;
};

/**
 * Framing is matched to the reference: a low camera pitched slightly down so
 * the tree base lands at ~2/3 screen height and the floor fills the bottom.
 */
const CAMERA_POS = new THREE.Vector3(0, 1.15, 6.4);
const CAMERA_TARGET = new THREE.Vector3(0, 0.78, 0);

function CameraRig({ progress, mouse }: Omit<SceneProps, "reveal">) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const target = useRef(CAMERA_TARGET.clone());

  useEffect(() => {
    camera.position.copy(CAMERA_POS);
    camera.lookAt(CAMERA_TARGET);
  }, [camera]);

  useFrame(() => {
    const p = progress.current;
    // Gentle dolly-in over the sequence, as the cube takes over the frame
    const dolly = THREE.MathUtils.smoothstep(p, 0.55, 1);

    desired.current.set(
      CAMERA_POS.x + mouse.current.x * 0.3,
      CAMERA_POS.y + mouse.current.y * 0.15,
      CAMERA_POS.z - dolly * 0.25,
    );
    camera.position.lerp(desired.current, 0.05);

    target.current.y = CAMERA_TARGET.y + dolly * 0.2;
    camera.lookAt(target.current);
  });

  return null;
}

function SceneInner({ progress, reveal, mouse }: SceneProps) {
  const count = useMemo(() => pickParticleCount(), []);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 22]} />
      <CameraRig progress={progress} mouse={mouse} />
      <Starfield />
      <ParticleMorph
        count={count}
        progress={progress}
        reveal={reveal}
        mouse={mouse}
      />
      <RippleFloor progress={progress} reveal={reveal} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.58}
          luminanceThreshold={0.48}
          luminanceSmoothing={0.32}
          mipmapBlur
          radius={0.55}
        />
        <Vignette offset={0.22} darkness={0.68} />
      </EffectComposer>
    </>
  );
}

export function HeroScene({ progress, reveal, mouse }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: 38,
        near: 0.1,
        far: 46,
        position: [CAMERA_POS.x, CAMERA_POS.y, CAMERA_POS.z],
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneInner progress={progress} reveal={reveal} mouse={mouse} />
      </Suspense>
    </Canvas>
  );
}
