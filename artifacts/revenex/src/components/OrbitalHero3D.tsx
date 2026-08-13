import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Suspense,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  BookOpen,
  UserPlus,
  CalendarCheck,
  MessageCircle,
  IndianRupee,
  BookMarked,
  Bus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

useGLTF.setDecoderPath("/draco/");

/* ─── Mounts only when the hero approaches the viewport; unmounts when scrolled far ─── */
function useNearViewport(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "600px",
) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return near;
}

/* ─── 3D Student model ─── */
function StudentModel() {
  const { scene } = useGLTF("/student.glb");
  const baseColor = useLoader(THREE.TextureLoader, "/student-basecolor.webp");
  const ref = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    baseColor.colorSpace = THREE.SRGBColorSpace;
    baseColor.flipY = true;
    scene.traverse((obj) => {
      const mesh = obj as any;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.map = baseColor;
        mat.metalness = 0.1;
        mat.roughness = 0.8;
        mat.metalnessMap = null;
        mat.roughnessMap = null;
        mat.normalMap = null;
        mat.aoMap = null;
        mat.needsUpdate = true;
      }
    });
  }, [scene, baseColor]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <primitive ref={ref} object={scene} scale={3.55} position={[0, -2.1, 0]} />
  );
}

function StudentCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.0, 5.1], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[3, 5, 3]} intensity={3.0} />
      <directionalLight
        position={[-3, 2, -3]}
        intensity={1.5}
        color="#C4A32A"
      />
      <pointLight position={[0, 3, 3]} intensity={1.4} color="#FFF8F0" />
      <pointLight position={[2, 1, 2]} intensity={0.8} color="#C4A32A" />
      <Suspense fallback={null}>
        <StudentModel />
        <ContactShadows
          position={[0, -1.0, 0]}
          opacity={0.12}
          scale={3}
          blur={2.5}
          color="#8B4513"
        />
      </Suspense>
    </Canvas>
  );
}

/* ─── Orbital 3D hero visual ─── */
function OrbitalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const near = useNearViewport(containerRef, "600px");
  const reduce = useReducedMotion();

  const rotY = useMotionValue(0);
  const rotX = useMotionValue(0);
  const springY = useSpring(rotY, { stiffness: 100, damping: 30 });
  const springX = useSpring(rotX, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!near || reduce) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        rotY.set(x * 0.3);
        rotX.set(-y * 0.2);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [near, reduce, rotX, rotY]);

  const badges: Array<{
    label: string;
    Icon: LucideIcon;
    style: CSSProperties;
    dur: number;
    delay: number;
  }> = [
    {
      label: "Library",
      Icon: BookOpen,
      style: { top: "-2%", right: "-8%" },
      dur: 4,
      delay: 0,
    },
    {
      label: "Admissions",
      Icon: UserPlus,
      style: { top: "18%", left: "-15%" },
      dur: 3.8,
      delay: 0.6,
    },
    {
      label: "Attendance",
      Icon: CalendarCheck,
      style: { top: "18%", right: "-15%" },
      dur: 4.5,
      delay: 1.2,
    },
    {
      label: "Communication",
      Icon: MessageCircle,
      style: { top: "45%", left: "-18%" },
      dur: 3.5,
      delay: 0.3,
    },
    {
      label: "Fees",
      Icon: IndianRupee,
      style: { top: "45%", right: "-15%" },
      dur: 4.2,
      delay: 0.9,
    },
    {
      label: "Homework",
      Icon: BookMarked,
      style: { bottom: "5%", left: "-12%" },
      dur: 3.9,
      delay: 1.5,
    },
    {
      label: "Transport",
      Icon: Bus,
      style: { bottom: "5%", right: "-12%" },
      dur: 4.8,
      delay: 0.5,
    },
  ];

  if (!near) {
    return (
      <div
        ref={containerRef}
        style={{ perspective: "1000px" }}
        className="relative w-full h-[680px] max-md:h-[420px] max-md:scale-[0.65] flex items-center justify-center"
      >
        <div className="w-[560px] h-[560px]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ perspective: "1000px" }}
      className="relative w-full h-[680px] max-md:h-[420px] max-md:scale-[0.65] flex items-center justify-center"
    >
      {/* Scene wrapper — subtle mouse parallax */}
      <motion.div
        style={{
          rotateY: springY,
          rotateX: springX,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-[560px] h-[560px] flex items-center justify-center"
      >
        {/* BACKGROUND GLOW */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "480px",
            height: "480px",
            zIndex: 0,
            background:
              "radial-gradient(ellipse, rgba(196,163,42,0.08) 0%, rgba(139,69,19,0.04) 40%, transparent 70%)",
          }}
          animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
          transition={
            reduce
              ? undefined
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        />

        {/* SVG gradient + glow definitions */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#D9A92E" />
              <stop offset="100%" stopColor="#9A6A15" />
            </linearGradient>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#C9C9D8" />
              <stop offset="100%" stopColor="#8A8AA0" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D6C6" />
              <stop offset="50%" stopColor="#C9906F" />
              <stop offset="100%" stopColor="#A06040" />
            </linearGradient>
            <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* RING 1 — Gold diagonal metallic ellipse */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 480,
            height: 180,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "rotate(-35deg)" }}
          >
            <svg
              width="480"
              height="180"
              viewBox="0 0 480 180"
              fill="none"
              style={{ overflow: "visible" }}
            >
              <ellipse
                cx="240"
                cy="90"
                rx="240"
                ry="90"
                stroke="url(#goldGrad)"
                strokeWidth="2.5"
                opacity="0.85"
                filter="url(#ringGlow)"
              />
            </svg>
            <motion.div
              className="absolute inset-0"
              style={{ willChange: "transform" }}
              animate={reduce ? undefined : { rotate: [0, 360] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 18, repeat: Infinity, ease: "linear" }
              }
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "12%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 16,
                  height: 16,
                  background:
                    "radial-gradient(circle at 35% 35%, #FFE066 0%, #C4A32A 100%)",
                  boxShadow: "0 0 16px 6px rgba(196,163,42,0.9)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* RING 2 — Silver diagonal metallic ellipse */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 150,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "rotate(35deg)" }}
          >
            <svg
              width="400"
              height="150"
              viewBox="0 0 400 150"
              fill="none"
              style={{ overflow: "visible" }}
            >
              <ellipse
                cx="200"
                cy="75"
                rx="200"
                ry="75"
                stroke="url(#silverGrad)"
                strokeWidth="2"
                opacity="0.75"
                filter="url(#ringGlow)"
              />
            </svg>
            <motion.div
              className="absolute inset-0"
              style={{ willChange: "transform" }}
              animate={reduce ? undefined : { rotate: [360, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 14, repeat: Infinity, ease: "linear" }
              }
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "12%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 12,
                  height: 12,
                  background:
                    "radial-gradient(circle at 35% 35%, #E8E8F8 0%, #A0A0C0 100%)",
                  boxShadow: "0 0 12px 4px rgba(160,160,192,0.8)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* RING 3 — Rose gold horizontal metallic ellipse */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 320,
            height: 110,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "rotate(0deg)" }}
          >
            <svg
              width="320"
              height="110"
              viewBox="0 0 320 110"
              fill="none"
              style={{ overflow: "visible" }}
            >
              <ellipse
                cx="160"
                cy="55"
                rx="160"
                ry="55"
                stroke="url(#roseGrad)"
                strokeWidth="1.5"
                opacity="0.7"
                filter="url(#ringGlow)"
              />
            </svg>
            <motion.div
              className="absolute inset-0"
              style={{ willChange: "transform" }}
              animate={reduce ? undefined : { rotate: [0, 360] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 10, repeat: Infinity, ease: "linear" }
              }
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "12%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 10,
                  height: 10,
                  background:
                    "radial-gradient(circle at 35% 35%, #E8A060 0%, #8B4513 100%)",
                  boxShadow: "0 0 10px 3px rgba(139,69,19,0.7)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* STUDENT — 3D model */}
        {!reduce && (
          <div
            className="absolute z-20"
            style={{
              width: "320px",
              height: "480px",
              bottom: "5%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <StudentCanvas />
          </div>
        )}

        {/* FLOATING FEATURE BADGES */}
        {badges.map((b) => (
          <motion.div
            key={b.label}
            className="absolute z-30 flex items-center gap-2 px-5 py-2.5 rounded-full cursor-default"
            style={{
              ...b.style,
              background: "#FFFFFF",
              border: "1px solid #EDE8E3",
              boxShadow: "0 4px 20px rgba(139,69,19,0.10)",
              willChange: "transform",
            }}
            animate={
              reduce
                ? undefined
                : { y: [0, -8, 0], opacity: [1, 0.4, 1], scale: [1, 1.08, 1] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: b.dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: b.delay,
                  }
            }
            whileHover={{ scale: 1.06 }}
          >
            <div className="w-8 h-8 bg-[#F5EDE0] rounded-lg flex items-center justify-center">
              <b.Icon size={16} color="#8B4513" />
            </div>
            <span className="text-sm font-semibold text-[#1A1410] whitespace-nowrap">
              {b.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default OrbitalHero;
