import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import LoadingSpinner from './ui/LoadingSpinner';

// Animated Sphere Component
const AnimatedSphere = ({ position, color, speed, size, distort }) => {
  const mesh = useRef();
  
  // Create a random rotation factor
  const rotationFactor = useMemo(() => {
    return {
      x: Math.random() * 0.02 - 0.01,
      y: Math.random() * 0.02 - 0.01,
      z: Math.random() * 0.02 - 0.01
    };
  }, []);

  // Animate the sphere
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    mesh.current.rotation.x += rotationFactor.x;
    mesh.current.rotation.y += rotationFactor.y;
    mesh.current.rotation.z += rotationFactor.z;
    
    // Subtle position movement
    mesh.current.position.x = position[0] + Math.sin(time) * 0.5;
    mesh.current.position.y = position[1] + Math.cos(time) * 0.5;
  });

  return (
    <Sphere ref={mesh} args={[size, 32, 32]} position={position}>
      <MeshDistortMaterial 
        color={color} 
        attach="material" 
        distort={distort} 
        speed={speed * 2} 
        roughness={0.4}
        metalness={0.2}
        opacity={0.8}
        transparent={true}
      />
    </Sphere>
  );
};

// Floating Particles
const FloatingParticles = ({ count, colors }) => {
  // Create random positions, sizes, and colors for particles
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 10 - 15
      ],
      size: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.2 + 0.1,
      distort: Math.random() * 0.3 + 0.1
    }));
  }, [count, colors]);

  return (
    <>
      {particles.map((particle, i) => (
        <AnimatedSphere
          key={i}
          position={particle.position}
          color={particle.color}
          size={particle.size}
          speed={particle.speed}
          distort={particle.distort}
        />
      ))}
    </>
  );
};

// Loading component for Suspense fallback
const Loading = () => {
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith('/blog');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  let color = 'blue'; // Default
  if (isBlogPage) color = 'green';
  if (isAdminPage) color = 'red';
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <LoadingSpinner size="lg" color={color} />
        <p className="mt-4 text-center text-gray-700">Loading 3D experience...</p>
      </div>
    </div>
  );
};

// Fallback gradient background when 3D is disabled
const FallbackBackground = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isBlogPage = location.pathname.startsWith('/blog');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  let gradientClass = 'bg-gradient-to-br from-blue-400/30 via-indigo-400/30 to-purple-400/30'; // Default for home
  
  if (isBlogPage) {
    gradientClass = 'bg-gradient-to-br from-green-400/30 via-emerald-400/30 to-lime-400/30';
  } else if (isAdminPage) {
    gradientClass = 'bg-gradient-to-br from-red-400/30 via-orange-400/30 to-amber-400/30';
  }
  
  return (
    <div className={`fixed inset-0 -z-50 ${gradientClass}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

const Scene = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Define different color schemes based on the route
  const colors = isHomePage 
    ? ['#4361ee', '#3a0ca3', '#7209b7', '#560bad', '#480ca8'] // Blue-purple for home
    : location.pathname.startsWith('/blog')
    ? ['#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200'] // Green for blog
    : location.pathname.startsWith('/admin')
    ? ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f'] // Red-orange for admin
    : ['#4361ee', '#3a0ca3', '#7209b7', '#560bad', '#480ca8']; // Default

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      
      {/* Main center sphere */}
      <AnimatedSphere 
        position={[0, 0, -10]} 
        color={colors[0]} 
        size={3} 
        speed={0.2} 
        distort={0.4} 
      />
      
      {/* Multiple floating particles */}
      <FloatingParticles count={15} colors={colors} />
      
      {/* Add subtle orbit controls for interaction */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        rotateSpeed={0.1}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Detect if the device can handle 3D animations
const usePerformanceCheck = () => {
  const [canHandle3D, setCanHandle3D] = useState(true);
  
  useEffect(() => {
    // Check for mobile devices which might struggle with 3D
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check for low-end devices by testing if the device has less than 4 logical processors
    const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Check if device has battery API and if battery is low
    const checkBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          return battery.level < 0.2 && !battery.charging;
        } catch (e) {
          return false;
        }
      }
      return false;
    };
    
    const determinePerformance = async () => {
      const isLowBattery = await checkBattery();
      
      // If it's a mobile device with low CPU or battery, disable 3D
      if ((isMobile && hasLowCPU) || isLowBattery) {
        setCanHandle3D(false);
      }
      
      // Add a user preference from localStorage if they've disabled 3D before
      const userPrefers2D = localStorage.getItem('prefers2D') === 'true';
      if (userPrefers2D) {
        setCanHandle3D(false);
      }
    };
    
    determinePerformance();
  }, []);
  
  return canHandle3D;
};

const AnimatedBackground = () => {
  const canHandle3D = usePerformanceCheck();
  
  // If the device can't handle 3D, show a simple gradient background
  if (!canHandle3D) {
    return <FallbackBackground />;
  }
  
  return (
    <div className="animated-background">
      <Suspense fallback={<Loading />}>
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default AnimatedBackground; 