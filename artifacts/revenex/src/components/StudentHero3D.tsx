import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useInView, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { CalendarCheck, IndianRupee, BookOpen, Bus, MessageCircle, Library, UserPlus, Pause, Play } from "lucide-react";

const modules = [
  { label: "Attendance", Icon: CalendarCheck },
  { label: "Fees", Icon: IndianRupee },
  { label: "Homework", Icon: BookOpen },
  { label: "Transport", Icon: Bus },
  { label: "Communication", Icon: MessageCircle },
  { label: "Library", Icon: Library },
  { label: "Admissions", Icon: UserPlus },
];

useGLTF.setDecoderPath("/draco/");
type LookTarget = RefObject<THREE.Vector2>;

function PortraitLens() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = size.width < 400 ? 50 : 34;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);
  return null;
}

function Student({
  target,
  reduced,
  onReady,
}: {
  target: LookTarget;
  reduced: boolean;
  onReady: () => void;
}) {
  const { scene } = useGLTF("/student.glb");
  const texture = useLoader(THREE.TextureLoader, "/student-basecolor.webp");
  const pivot = useRef<THREE.Group>(null);
  const headTurn = useMemo(() => new THREE.Vector2(), []);
  const { model, center, materials } = useMemo(() => {
    const model = scene.clone(true);
    const materials: THREE.MeshStandardMaterial[] = [];
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const source = object.material as THREE.MeshStandardMaterial;
      const material = source.clone();
      material.metalness = 0;
      material.roughness = 0.8;
      material.metalnessMap = null;
      material.roughnessMap = null;
      material.normalMap = null;
      material.aoMap = null;
      // The source has no armature. A blended neck deformation keeps the
      // original arm pose and avoids cutting the nine interleaved mesh pieces.
      material.onBeforeCompile = (shader) => {
        shader.uniforms.studentHeadTurn = { value: headTurn };
        const deform = `
          uniform vec2 studentHeadTurn;
          mat3 studentHeadRotation() {
            float cy = cos(studentHeadTurn.x), sy = sin(studentHeadTurn.x);
            float cx = cos(studentHeadTurn.y), sx = sin(studentHeadTurn.y);
            return mat3(cy,0.0,-sy, 0.0,1.0,0.0, sy,0.0,cy) * mat3(1.0,0.0,0.0, 0.0,cx,sx, 0.0,-sx,cx);
          }
        `;
        shader.vertexShader = deform + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
          float neckWeight = smoothstep(0.89, 0.98, position.y);
          objectNormal = normalize(mix(objectNormal, studentHeadRotation() * objectNormal, neckWeight));
        `,
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vec3 neckPivot = vec3(-0.02, 0.93, 0.0);
          transformed = mix(transformed, neckPivot + studentHeadRotation() * (transformed - neckPivot), neckWeight);
        `,
        );
      };
      material.customProgramCacheKey = () => "student-neck-follow-v1";
      object.material = material;
      materials.push(material);
    });
    return {
      model,
      center: new THREE.Box3()
        .setFromObject(model)
        .getCenter(new THREE.Vector3()),
      materials,
    };
  }, [scene, headTurn]);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    for (const material of materials) {
      material.map = texture;
      material.needsUpdate = true;
    }
  }, [materials, texture]);
  useEffect(onReady, [onReady]);
  useEffect(
    () => () => {
      // The geometry and texture remain shared GLTF cache assets; only these
      // scene-specific material copies belong to this mounted preview.
      for (const material of materials) material.dispose();
    },
    [materials],
  );

  useFrame((state, delta) => {
    if (!pivot.current) return;
    const yaw = reduced ? 0 : target.current.x * 0.07;
    const pitch = reduced ? 0 : target.current.y * 0.025;
    pivot.current.rotation.y = THREE.MathUtils.damp(
      pivot.current.rotation.y,
      yaw,
      7,
      Math.min(delta, 0.05),
    );
    pivot.current.rotation.x = THREE.MathUtils.damp(
      pivot.current.rotation.x,
      pitch,
      7,
      Math.min(delta, 0.05),
    );
    const headYaw = reduced ? 0 : target.current.x * 0.34;
    const headPitch = reduced ? 0 : target.current.y * 0.14;
    headTurn.x = THREE.MathUtils.damp(
      headTurn.x,
      headYaw,
      8,
      Math.min(delta, 0.05),
    );
    headTurn.y = THREE.MathUtils.damp(
      headTurn.y,
      headPitch,
      8,
      Math.min(delta, 0.05),
    );
    // Demand rendering stops once the student settles, instead of running a
    // permanent idle animation when the pointer is still or has left the hero.
    if (
      Math.abs(pivot.current.rotation.y - yaw) +
        Math.abs(pivot.current.rotation.x - pitch) +
        Math.abs(headTurn.x - headYaw) +
        Math.abs(headTurn.y - headPitch) >
      0.0001
    )
      state.invalidate();
  });

  return (
    <group ref={pivot}>
      {/* Keep the original pose, but frame the face and torso like a portrait. */}
      <primitive
        object={model}
        position={[-center.x, -center.y - 0.23, -center.z]}
      />
    </group>
  );
}

export default function StudentHero3D({
  interactionRootId,
}: {
  interactionRootId: string;
}) {
  const visual = useRef<HTMLDivElement>(null);
  const target = useRef(new THREE.Vector2());
  const redraw = useRef<() => void>(() => {});
  const near = useInView(visual, { margin: "200px" });
  const reduced = Boolean(useReducedMotion());
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const section = document.getElementById(interactionRootId);
    if (!section || !near) return;
    const reset = () => {
      target.current.set(0, 0);
      redraw.current();
    };
    const move = (event: PointerEvent) => {
      if (reduced || event.pointerType === "touch" || !visual.current) return;
      const box = visual.current.getBoundingClientRect();
      const bounds = section.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) / (bounds.width / 2);
      const y = (event.clientY - box.top - box.height / 2) / (box.height / 2);
      target.current.set(
        THREE.MathUtils.clamp(x, -1, 1),
        THREE.MathUtils.clamp(y, -1, 1),
      );
      redraw.current();
    };
    reset();
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", reset);
    section.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", reset);
      section.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [interactionRootId, near, reduced]);

  return (
    <div
      ref={visual}
      role="group"
      aria-label="Revenex student: gently turns toward your pointer within this section"
      className="relative h-[380px] w-full overflow-hidden sm:h-[440px] lg:h-[520px] xl:h-[560px]"
      data-student-hero
    >
      {near && (
        <Canvas
          camera={{ position: [0, 0, 1.4], fov: 34 }}
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 78%, transparent 90%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 78%, transparent 90%)",
          }}
          onCreated={({ invalidate }) => {
            redraw.current = invalidate;
          }}
        >
          <PortraitLens />
          <ambientLight intensity={1.3} />
          <directionalLight position={[3, 5, 4]} intensity={2} />
          <directionalLight
            position={[-3, 1, 2]}
            intensity={0.7}
            color="#FFF4E8"
          />
          <Suspense fallback={null}>
            <Student target={target} reduced={reduced} onReady={onReady} />
          </Suspense>
        </Canvas>
      )}
      <div className="student-modules absolute inset-0 pointer-events-none" aria-label="School management modules">
        {modules.map(({ label, Icon }, index) => (
          <span key={label} className="student-module" title={label} aria-label={label} style={{
            offsetDistance: `${index * 100 / modules.length}%`,
            animationDelay: `${-index * 40 / modules.length}s`,
            animationPlayState: near && !paused && !reduced ? "running" : "paused",
            animationName: reduced ? "none" : undefined,
          }}>
            <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#8B4513]" />
            <span className="student-module-label">{label}</span>
          </span>
        ))}
      </div>
      {!reduced && (
        <button type="button" onClick={() => setPaused(value => !value)}
          className="absolute bottom-1 right-2 flex min-h-10 items-center gap-1 rounded-full bg-[#F5F0E8]/90 px-3 text-[10px] font-medium text-[#6B5D52] hover:bg-white"
          aria-label={paused ? "Resume moving module labels" : "Pause moving module labels"}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
          {paused ? "Resume" : "Pause"}
        </button>
      )}
      {near && !ready && (
        <span
          role="status"
          className="absolute inset-0 flex items-center justify-center text-xs text-[#8B7866]"
        >
          Loading student…
        </span>
      )}
    </div>
  );
}
