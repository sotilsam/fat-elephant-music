import { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, ScrollControls, useGLTF, Scroll } from '@react-three/drei';
import * as THREE from 'three';

const ElephantModel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { scene } = useGLTF('/elephant.glb') as any;
    const { size } = useThree();

    // Check if device is a phone
    const isMobile = size.width < 768;

    useFrame(() => {
        if (groupRef.current) {
            // Rotate exactly 180 degrees over the entire scroll duration
            groupRef.current.rotation.y = scroll.offset * Math.PI;
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

const AnimatedHeadline = () => {
    const scroll = useScroll();
    const [opacity, setOpacity] = useState(0);

    useFrame(() => {
        // perfectly synced with the 3D elephant rotation!
        if (scroll.offset >= 0.85) {
            const newOpacity = Math.min((scroll.offset - 0.85) / 0.15, 1);
            setOpacity(newOpacity);
        } else {
            setOpacity(0);
        }
    });

    return (
        <Scroll html>
            <div
                className="absolute inset-0 z-10 w-screen h-screen flex flex-col items-center pt-28 md:pt-20 pointer-events-none transition-opacity duration-75"
                style={{ opacity, transform: 'translate3d(0, 0, 0)' }} // Translate3d helps prevent rendering bugs in <Scroll html>
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-clip-text text-transparent tracking-widest md:tracking-[0.1em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    Fat Elephant
                </h1>
            </div>
        </Scroll>
    );
};

export const HeroSection = () => {
    return (
        <div className="w-full h-[150vh] bg-black relative">
            <div className="sticky top-0 w-full h-screen">
                {/* 3D Canvas */}
                <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <ScrollControls pages={1.5} damping={0.1}>
                            <ElephantModel />
                            <AnimatedHeadline />
                        </ScrollControls>
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};
