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
      
      // Colors inspired by the images: vibrant reds, blacks, whites, dark greys
      const colors = [
        '#ff0000', // Bright red
        '#ff3300', // Fire orange-red
        '#cc0000', // Dark red
        '#000000', // Black
        '#ffffff', // White
        '#333333', // Dark grey
        '#1a0000', // Very dark red
        '#ff6600', // Orange
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
        // Initial gathering/swirl phase - particles converge
        const gatherProgress = time / 0.3;
        const gatherEase = 1 - Math.pow(1 - gatherProgress, 3);
        
        dummy.position.set(
          initialX * (1 - gatherEase),
          initialY * (1 - gatherEase),
          initialZ * (1 - gatherEase)
        );
        dummy.rotation.set(time * 2, time * 2, time * 2);
        dummy.scale.setScalar(size * (0.5 + gatherEase * 0.5));
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
        dummy.rotation.x += rotationSpeed * 20 * delta; // Reduced from 50 to 20
        dummy.rotation.y += rotationSpeed * 20 * delta;
        dummy.rotation.z += rotationSpeed * 20 * delta;
        
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
        roughness={0.05} 
        metalness={0.95}
        emissive="#ff0000"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
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
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ff0000" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[0, 0, 0]} intensity={8} color="#ff0000" distance={15} decay={2} />
        <pointLight position={[5, -5, 5]} intensity={3} color="#ff6600" distance={12} />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={0.5} intensity={5} color="#ff0000" castShadow />

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

