import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ElephantModel = ({ scrollProgress }: { scrollProgress: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF('/elephant.glb') as any;
    const { size } = useThree();

    // Check if device is a phone
    const isMobile = size.width < 768;

    useFrame(() => {
        if (groupRef.current) {
            // Target rotation is directly tied to scroll progress (0 to 1 -> 0 to PI)
            const targetRotation = scrollProgress * Math.PI;
            // Lerp to make it smooth
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotation,
                0.1 // Damping factor for smoothness
            );
        }
    });

    return (
        <group ref={groupRef}>
            <primitive
                object={scene}
                scale={isMobile ? [3, 3, 3] : [5, 5, 5]}
                position={[0, isMobile ? -0.8 : 0, 0]}
            />
        </group>
    );
};

useGLTF.preload('/elephant.glb');

export const HeroSection = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const rotationScrollDistance = window.innerHeight * 2.5;
            // Calculate progress from 0 to 1 based on how far we've scrolled
            let progress = window.scrollY / rotationScrollDistance;
            // Clamp it between 0 and 1 so it stops rotating exactly at 180 degrees
            progress = Math.max(0, Math.min(progress, 1));

            setScrollProgress(progress);
        };
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full h-[400vh] bg-black relative">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <Canvas
                    camera={{ position: [0, 2, 8], fov: 50 }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
                >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <ElephantModel scrollProgress={scrollProgress} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};
