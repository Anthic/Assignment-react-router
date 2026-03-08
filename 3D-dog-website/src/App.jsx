import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Dog from "./components/Dog";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "#1a1a1a" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />

        {/* 3D Model */}
        <Dog />

        {/* Controls */}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

        {/* Environment for better reflections */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

export default App;
