import * as THREE from "three";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ScrollControls,
  Sky,
  useScroll,
  useGLTF,
  useAnimations,
  OrbitControls,
} from "@react-three/drei";

export default function App() {
  const [hovered, hover] = useState(false);
  const mouse = useRef([0, 0]);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  useEffect(() => {
    renderer.setSize(window.innerWidth/2,  window.innerHeight/2);
    const canvas = renderer.domElement;
    canvas.addEventListener(
      'webglcontextlost',
      function (event) {
        event.preventDefault();
        setTimeout(function () {
          renderer.forceContextRestore();
        }, 1);
      },
      false
    );
    document.body.style.cursor = hovered
      ? "pointer"
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto";
  }, [hovered]);

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 10, 10], near: 0.4, far: 1000 }}
      style={{ height: "100vh" }}
    >
      <ambientLight intensity={0.03} />
      <fog attach="fog" args={["#354AA1", 5, 18]} density="0.1" />
      <spotLight
        angle={0.14}
        color="#CDDAE0"
        penumbra={1}
        position={[25, 50, -20]}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        castShadow
      />
      <Sky scale={1000} sunPosition={[0, 0, 0]} />
      <Suspense fallback={null}>
        <LittlestTokyo
          mouse={mouse}
          hover={hover}
          scale={0.1}
          position={[0, 6, -4]}
        />
      </Suspense>
    </Canvas>
  );
}

function LittlestTokyo({ hover }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        state.mouse.x * 2,
        0.05
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        state.mouse.y / 2,
        0.05
      );
      ref.current.rotation.y = 0.8;
    }
  });
  
  
  const { scene, nodes, animations } = useGLTF("/terrain.glb");
  const { actions } = useAnimations(animations, scene);
  
  return (
    <group ref={ref}>
      <primitive
        object={scene}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      />
    </group>
  );
}

useGLTF.preload("/terrain.glb");
