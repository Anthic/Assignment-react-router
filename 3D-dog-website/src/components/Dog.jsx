import { useGLTF } from "@react-three/drei";

export default function Dog() {
  const { scene } = useGLTF("/models/dog.drc.glb");

  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}
