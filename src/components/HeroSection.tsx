import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, ScrollControls, useGLTF, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const ElephantModel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const { scene } = useGLTF('/elephant.glb') as any;

    useFrame(() => {
        if (groupRef.current) {
            // Rotate exactly 180 degrees over the entire scroll duration
            groupRef.current.rotation.y = scroll.offset * Math.PI;
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={[5, 5, 5]} position={[0, 0, 0]} />
        </group>
    );
};

useGLTF.preload('/elephant.glb');

const FatElephantText = () => {
    const scroll = useScroll();
    const materialRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

    useFrame((_, delta) => {
        const targetOpacity = scroll.offset >= 0.85 ? 1 : 0;
        materialRefs.current.forEach((mat) => {
            if (mat) {
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 15 * delta);
            }
        });
    });

    const text = "FAT ELEPHANT";
    const radius = 3.2; // How wide the circle is
    const maxAngle = Math.PI / 4.5; // How far the text spreads around the top of the circle

    return (
        <group position={[0, -0.2, 0]}>
            {text.split('').map((char, index) => {
                // Determine angle for this specific letter
                const t = index / (text.length - 1);
                const angle = -maxAngle + t * maxAngle * 2; // Arcs from -maxAngle (left) to +maxAngle (right)

                // Position on the edge of the circle (top half)
                const x = Math.sin(angle) * radius;
                const y = Math.cos(angle) * radius;

                return (
                    <group key={index} position={[x, y, 0]} rotation={[0, 0, -angle]}>
                        <Center>
                            <Text3D
                                font="/font.json"
                                size={0.35}
                                height={0.15}
                                curveSegments={32}
                                bevelEnabled
                                bevelThickness={0.06}
                                bevelSize={0.04}
                                bevelOffset={0}
                                bevelSegments={12}
                            >
                                {char}
                                <meshStandardMaterial
                                    ref={(el) => (materialRefs.current[index] = el)}
                                    color="#ffffff"
                                    transparent
                                    opacity={0}
                                    roughness={0.3}
                                    metalness={0.7}
                                />
                            </Text3D>
                        </Center>
                    </group>
                );
            })}
        </group>
    );
};

export const HeroSection = () => {
    return (
        <div className="w-full h-[150vh] bg-black relative">
            <div className="sticky top-0 w-full h-screen">
                <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <ScrollControls pages={1.5} damping={0.1}>
                            <ElephantModel />
                            <FatElephantText />
                        </ScrollControls>
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};
