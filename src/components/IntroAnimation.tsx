import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Constants for the animation
const COUNT = 400;
const EXPLOSION_DURATION = 3.5; // seconds

const Shards = ({ active, onComplete }: { active: boolean; onComplete: () => void }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Generate random initial positions and velocities
  const [particles] = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      const speed = 0.3 + Math.random() * 0.8; // Reduced from 0.5-1.5 to 0.3-0.8
      const rotationSpeed = (Math.random() - 0.5) * 0.1;
      
      // Colors: red and white blocks
      const colors = [
        '#ff0000', // Bright red
        '#ffffff', // White
      ];
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      
      temp.push({ 
        angle, 
        radius, 
        speed, 
        rotationSpeed,
        initialX: Math.cos(angle) * radius,
        initialY: Math.sin(angle) * radius,
        initialZ: (Math.random() - 0.5) * radius,
        color,
        size: 0.3 + Math.random() * 0.7
      });
    }
    return [temp];
  }, []);

  // Dummy object for positioning
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize colors
  useEffect(() => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        meshRef.current!.setColorAt(i, particle.color);
      });
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particles]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Animate each particle
    particles.forEach((particle, i) => {
      const { angle, speed, rotationSpeed, initialX, initialY, initialZ, size } = particle;
      
      if (time < 0.3) {
        // Initial gathering/swirl phase - particles converge with pulsing
        const gatherProgress = time / 0.3;
        const gatherEase = 1 - Math.pow(1 - gatherProgress, 3);
        
        // Pulsing effect: faster pulses as we approach explosion
        const pulseSpeed = 8 + gatherProgress * 12; // Increases from 8 to 20
        const pulseIntensity = 0.15 + gatherProgress * 0.25; // Increases from 0.15 to 0.4
        const pulse = 1 + Math.sin(time * pulseSpeed) * pulseIntensity;
        
        dummy.position.set(
          initialX * (1 - gatherEase),
          initialY * (1 - gatherEase),
          initialZ * (1 - gatherEase)
        );
        dummy.rotation.set(time * 1, time * 1, time * 1);
        dummy.scale.setScalar(size * (0.5 + gatherEase * 0.5) * pulse);
      } else {
        // EXPLOSION PHASE - particles blast outward (slower)
        const explodeTime = time - 0.3;
        const explodeProgress = Math.min(explodeTime / (EXPLOSION_DURATION - 0.3), 1);
        
        // Slower exponential outward explosion
        const distance = speed * explodeTime * explodeTime * 3; // Reduced from 8 to 3
        const direction = new THREE.Vector3(
          Math.cos(angle) + (Math.random() - 0.5) * 0.5,
          Math.sin(angle) + (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ).normalize();
        
        dummy.position.set(
          direction.x * distance,
          direction.y * distance,
          direction.z * distance
        );
        
        // Slower rotation
        dummy.rotation.x += rotationSpeed * 10 * delta; // Reduced from 20 to 10
        dummy.rotation.y += rotationSpeed * 10 * delta;
        dummy.rotation.z += rotationSpeed * 10 * delta;
        
        // Slight scale variation
        dummy.scale.setScalar(size * (1 + Math.sin(explodeTime * 10) * 0.2));
      }
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Trigger completion
    if (time > EXPLOSION_DURATION && active) {
      onComplete();
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        roughness={0.2} 
        metalness={0.1}
      />
    </instancedMesh>
  );
};


const PulsingLights = () => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const light4Ref = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (time < 0.3) {
      const gatherProgress = time / 0.3;
      const pulseSpeed = 8 + gatherProgress * 12;
      const pulseIntensity = 0.15 + gatherProgress * 0.25;
      const pulse = 1 + Math.sin(time * pulseSpeed) * pulseIntensity;
      
      if (light1Ref.current) light1Ref.current.intensity = 2 * pulse;
      if (light2Ref.current) light2Ref.current.intensity = 1.5 * pulse;
      if (light3Ref.current) light3Ref.current.intensity = 8 * pulse;
      if (light4Ref.current) light4Ref.current.intensity = 3 * pulse;
      if (spotLightRef.current) spotLightRef.current.intensity = 5 * pulse;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[10, 10, 10]} intensity={2} color="#ff0000" />
      <pointLight ref={light2Ref} position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />
      <pointLight ref={light3Ref} position={[0, 0, 0]} intensity={8} color="#ff0000" distance={15} decay={2} />
      <pointLight ref={light4Ref} position={[5, -5, 5]} intensity={3} color="#ff6600" distance={12} />
      <spotLight ref={spotLightRef} position={[0, 10, 0]} angle={0.5} penumbra={0.5} intensity={5} color="#ff0000" castShadow />
    </>
  );
};

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [active, setActive] = useState(true);

  const handleComplete = () => {
    setActive(false);
    setTimeout(onComplete, 500); // Small buffer
  };

  return (
    <div className="fixed inset-0 z-50 bg-black w-full h-full overflow-hidden">
      <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.8} />
        <PulsingLights />

        <Suspense fallback={null}>
          <Shards active={active} onComplete={handleComplete} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={2} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 3} 
        />
      </Canvas>
      
      {/* HTML Overlay for Text to ensure readability */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 
          className="text-6xl md:text-9xl font-black text-white"
          style={{ 
            fontFamily: 'Impact, sans-serif',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3)',
            letterSpacing: '0.3em'
          }}
        >
          HAZE
        </h1>
      </div>
      
      {/* CSS-based glow overlay for extra effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.8) 100%)',
        mixBlendMode: 'screen'
      }} />
    </div>
  );
};

export default IntroAnimation;

