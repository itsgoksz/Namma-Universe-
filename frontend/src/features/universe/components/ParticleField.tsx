/**
 * ParticleField — The Core WebGL Universe (Active Theory Style)
 * 
 * High-performance, cinematic particle system.
 * Features:
 * - Tiny, sharp particles with extreme contrast (no blown-out blending)
 * - 4 Phases: Singularity -> Galaxy Spiral -> Settlement -> Constellation
 * - Interactive mouse parallax for deep spatial feel
 */

import { useRef, useMemo, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Constants ───────────────────────────────────────────────

const PARTICLE_COUNT = 15000; // Massively increased for a deeply dense, rich galaxy that fills the whole tunnel

// Solar System Planets: Accurate colors, relative sizes, and orbital speeds
const PRODUCT_NODES = [
  { radius: 1.2, startAngle: Math.random() * Math.PI * 2, speed: 1.60, color: [0.44, 0.50, 0.56], size: 1.2 }, // Mercury: Slate gray
  { radius: 1.9, startAngle: Math.random() * Math.PI * 2, speed: 1.10, color: [0.95, 0.92, 0.84], size: 1.8 }, // Venus: Pearly white/yellow
  { radius: 2.7, startAngle: Math.random() * Math.PI * 2, speed: 0.80, color: [0.17, 0.45, 0.95], size: 2.0 }, // Earth: Vibrant blue
  { radius: 3.6, startAngle: Math.random() * Math.PI * 2, speed: 0.50, color: [0.88, 0.44, 0.22], size: 1.5 }, // Mars: Dusky red/butterscotch
  { radius: 5.2, startAngle: Math.random() * Math.PI * 2, speed: 0.25, color: [0.85, 0.65, 0.45], size: 4.8 }, // Jupiter: Swirling yellow/brown
  { radius: 7.0, startAngle: Math.random() * Math.PI * 2, speed: 0.15, color: [0.93, 0.86, 0.51], size: 4.0 }, // Saturn: Pale yellow/gold
  { radius: 8.8, startAngle: Math.random() * Math.PI * 2, speed: 0.10, color: [0.67, 0.91, 0.91], size: 3.0 }, // Uranus: Cyan/light blue-green
  { radius: 10.5, startAngle: Math.random() * Math.PI * 2, speed: 0.05, color: [0.15, 0.35, 0.75], size: 2.8 },// Neptune: Deep, opaque blue
];

// ─── GLSL Shaders ────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  attribute vec3 aExpandedPos;
  attribute vec3 aTarget;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aIsProduct;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  // Ease functions
  float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  float easeInOutQuart(float t) {
    return t < 0.5 ? 8.0 * t * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 4.0) / 2.0;
  }

  void main() {
    vPhase = aPhase;

    // Phase progress values (each 0→1 within its range)
    float fadeIn        = smoothstep(0.0, 0.08, uProgress);
    float expansion     = easeOutCubic(smoothstep(0.12, 0.45, uProgress));
    float settlement    = easeInOutQuart(smoothstep(0.40, 0.70, uProgress));

    // ── Singularity: tight cluster at origin ──
    vec3 singularityPos = position * 0.002;
    // Add some spin to the singularity
    float sigSpin = uTime * 2.0 + aPhase * 6.28;
    singularityPos.x += cos(sigSpin) * 0.02;
    singularityPos.z += sin(sigSpin) * 0.02;

    // ── Expanded: Galaxy structure ──
    // We precomputed the galaxy positions in aExpandedPos, but let's add continuous slow rotation
    vec3 expandedPos = aExpandedPos;
    float angle = uTime * 0.15;
    float s = sin(angle);
    float c = cos(angle);
    vec3 rotatedExpandedPos = vec3(
      expandedPos.x * c - expandedPos.z * s,
      expandedPos.y,
      expandedPos.x * s + expandedPos.z * c
    );

    // ── Solar System: final target positions ──
    vec3 finalPos = aTarget;

    float isProductNode = aIsProduct;
    float isSun = step(5.0, aSize);

    if (isProductNode > 0.5) {
      // It's a planet! Calculate orbit.
      float radius = aTarget.x;
      float startAngle = aTarget.y;
      float speed = aTarget.z;
      
      float currentAngle = startAngle + uTime * speed;
      
      // Orbit on XZ plane, tilted slightly on Y
      finalPos.x = cos(currentAngle) * radius;
      finalPos.y = sin(currentAngle) * radius * 0.15; 
      finalPos.z = sin(currentAngle) * radius;
    }

    // ── Interpolate through phases ──
    vec3 pos = mix(singularityPos, rotatedExpandedPos, expansion);
    
    // ── WARP TUNNEL EFFECT ──
    // Instead of a flat chaotic scatter, we force the galaxy dust to burst radially OUTWARD
    // and FORWARD (past the camera), clearing the center for the Solar System to assemble.
    float warpArc = settlement * (1.0 - settlement); // Parabolic arc peaking at mid-transition
    vec2 dir = normalize(pos.xy + vec2(0.0001));
    
    float isDust = 1.0 - isProductNode;
    vec3 warpedPos = pos;
    
    // Massive radial burst outward for dust
    warpedPos.xy += dir * (warpArc * 80.0 * isDust);
    // Massive forward burst (Z goes positive) so dust flies past the camera
    warpedPos.z += warpArc * 60.0 * isDust;
    
    pos = mix(warpedPos, finalPos, settlement);

    // Gentle floating in final state
    float floatStrength = settlement * 0.15;
    pos.x += sin(uTime * 0.4 + aPhase * 6.28) * floatStrength;
    pos.y += cos(uTime * 0.3 + aPhase * 5.0)  * floatStrength;
    pos.z += sin(uTime * 0.5 + aPhase * 4.0)  * floatStrength * 0.5;

    // Singularity pulse effect
    float pulse = 1.0 + sin(uTime * 4.0 + aPhase * 2.0) * 0.8 * (1.0 - expansion);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // SAFEGUARD: clamp the divisor so point sizes don't explode to Infinity when flying directly through particles
    float sizeAttenuation = 180.0 / max(-mvPosition.z, 0.5);
    
    // Increase base size slightly (from 0.15 to 0.5) so they are more visible
    gl_PointSize = (aSize * 0.5) * pulse * sizeAttenuation * uPixelRatio;
    
    // Focus on the central sun and planets
    // Nodes are larger, Sun is massive
    float targetSize = aSize * sizeAttenuation * uPixelRatio * 2.0;
    targetSize = mix(targetSize, targetSize * 3.0, isSun);
    gl_PointSize = mix(gl_PointSize, targetSize, isProductNode * settlement);

    // SAFEGUARD: Hard clamp point size to prevent WebGL context crash
    gl_PointSize = min(gl_PointSize, 2500.0);

    gl_Position  = projectionMatrix * mvPosition;

    vColor = aColor;

    // Alpha handling: start partially visible (0.4) so the singularity is seen on load
    vAlpha = mix(0.4, 1.0, fadeIn);

    // Dim particles during singularity, brighten during expansion
    float expansionBrightness = mix(0.2, 1.0, expansion);
    
    // Keep background dust visible and rich during constellation phase (0.75 instead of 0.4)
    float dustFade = mix(1.0, 0.75, settlement * (1.0 - isProductNode));

    vAlpha *= expansionBrightness * dustFade;
    
    // Product nodes glow brighter
    vAlpha = mix(vAlpha, vAlpha * 2.0, isProductNode * settlement);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Active Theory style: Microscopic razor-sharp core, with extremely faint optical glow
    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 3.0); // Less steep falloff for brighter glow

    // Subtle flicker/twinkle based on phase
    float twinkle = 0.8 + 0.2 * sin(vPhase * 100.0);

    // Increase glow mix to 0.45 for better visibility
    float alpha = mix(glow * 0.45, 1.0, core) * vAlpha * twinkle;

    // Color mixing: core is pure white, glow is the assigned color
    vec3 color = mix(vColor, vec3(1.0), core * 0.7);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Particles Scene Component ───────────────────────────────

interface ParticlesProps {
  progressRef: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number, y: number }>;
}

function Particles({ progressRef, mouseRef }: ParticlesProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);

  // Parallax smoothing
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Force geometry rebuild on HMR
  const GEOMETRY_VERSION = 7;

  // Pre-compute particle geometry data
  const { geometry } = useMemo(() => {
    const positions   = new Float32Array(PARTICLE_COUNT * 3);
    const expandedPos = new Float32Array(PARTICLE_COUNT * 3);
    const targets     = new Float32Array(PARTICLE_COUNT * 3);
    const sizes       = new Float32Array(PARTICLE_COUNT);
    const phases      = new Float32Array(PARTICLE_COUNT);
    const colors      = new Float32Array(PARTICLE_COUNT * 3);
    const isProduct   = new Float32Array(PARTICLE_COUNT);

    const cosmicColors = [
      new THREE.Color('#05060A'), // almost invisible
      new THREE.Color('#1A1344'), // deep violet
      new THREE.Color('#6D5EF7'), // bright violet
      new THREE.Color('#2DD4FF'), // cyan
      new THREE.Color('#FFFFFF'), // white dust
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 1. Initial Spherical Random (Tight Cluster)
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = Math.random();

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      phases[i] = Math.random();

      // 2. Expanded Galaxy State (Structured 3-arm spiral)
      const arm = Math.floor(Math.random() * 3);
      const angle = Math.random() * Math.PI * 2;
      // Much larger radius to fill screen
      const radius = 0.5 + Math.pow(Math.random(), 2.0) * 25.0; 
      const spinAngle = angle + radius * 0.4 + arm * ((Math.PI * 2) / 3);
      
      const armOffset = (Math.random() - 0.5) * 3.0;
      // Much thicker to prevent it from looking like a flat line
      const thickness = (Math.random() - 0.5) * 6.0 * (1.0 - radius / 30.0);
      
      expandedPos[i * 3]     = Math.cos(spinAngle) * radius + armOffset;
      expandedPos[i * 3 + 1] = thickness;
      expandedPos[i * 3 + 2] = Math.sin(spinAngle) * radius + armOffset;

      if (i < PRODUCT_NODES.length) {
        // Product node final targets (orbit parameters)
        const node = PRODUCT_NODES[i];
        targets[i * 3]     = node.radius;
        targets[i * 3 + 1] = node.startAngle;
        targets[i * 3 + 2] = node.speed;
        sizes[i]          = node.size;
        colors[i * 3]     = node.color[0];
        colors[i * 3 + 1] = node.color[1];
        colors[i * 3 + 2] = node.color[2];
        isProduct[i]      = 1.0;
      } else if (i === PRODUCT_NODES.length) {
        // Central Core — Sun
        targets[i * 3]     = 0;
        targets[i * 3 + 1] = 0;
        targets[i * 3 + 2] = 0;
        sizes[i]          = 12.0; // Massively increased size
        colors[i * 3]     = 1.0; 
        colors[i * 3 + 1] = 0.85; // Bright vibrant yellow
        colors[i * 3 + 2] = 0.15;
        isProduct[i]      = 0.0;
      } else {
        // Ambient background dust final targets: infinite deep starry tunnel
        // Uniform circular distribution inside a radius of 20, keeping a hollow core of 3
        const tunnelRadius = 3.0 + Math.sqrt(Math.random()) * 20.0; 
        const tunnelAngle = Math.random() * Math.PI * 2;
        // Uniformly distribute stars along the Z-axis safely to -70
        const tunnelZ = 10.0 - Math.random() * 80.0; 
        
        targets[i * 3]     = Math.cos(tunnelAngle) * tunnelRadius;
        targets[i * 3 + 1] = Math.sin(tunnelAngle) * tunnelRadius * 0.6; // Squashed vertically for galaxy feel
        targets[i * 3 + 2] = tunnelZ;
        isProduct[i]       = 0.0;
        
        // 3% chance to be a distant glowing solar system
        if (Math.random() > 0.97) {
          sizes[i] = Math.random() * 2.5 + 1.5; // Large glowing orb
          // Pick a vibrant color
          const hue = Math.random();
          const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
          colors[i * 3]     = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        } else {
          // Normal background dust
          sizes[i] = Math.random() * 1.0 + 0.2;
          // Pick color based on radius in the tunnel
          let colBase: THREE.Color;
          if (tunnelRadius < 8.0) {
            colBase = cosmicColors[4]; // White/bright core
          } else if (tunnelRadius < 16.0) {
            colBase = cosmicColors[3].clone().lerp(cosmicColors[2], Math.random()); // Cyan/Violet mid
          } else {
            colBase = cosmicColors[2].clone().lerp(cosmicColors[4], Math.random()); // Violet/White edge (bright!)
          }
          colors[i * 3]     = colBase.r;
          colors[i * 3 + 1] = colBase.g;
          colors[i * 3 + 2] = colBase.b;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aExpandedPos', new THREE.BufferAttribute(expandedPos, 3));
    geo.setAttribute('aTarget',  new THREE.BufferAttribute(targets, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aIsProduct', new THREE.BufferAttribute(isProduct, 1));

    return { geometry: geo };
  }, [GEOMETRY_VERSION]);

  // Uniforms
  const uniforms = useMemo(() => ({
    uProgress:   { value: 0 },
    uTime:       { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  // Animation loop
  useFrame((_, delta) => {
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));

    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = smoothProgress.current;
      materialRef.current.uniforms.uTime.value += delta;
    }

    // Apply parallax to the entire group
    if (groupRef.current) {
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * (1 - Math.exp(-4 * delta));
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * (1 - Math.exp(-4 * delta));
      
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const extraScrollRot = Math.max(0, (scrollY / vh) - 4.0); // Starts tilting deeply after Intro

      // Tilt the universe based on mouse (parallax) and deep scroll
      groupRef.current.rotation.y = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02);
      
      // Cinematic spin (roll) around the camera's flight path
      groupRef.current.rotation.z = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry as any}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── Solar System Rings ──────────────────────────────────────

function SolarSystemRings({ progressRef, mouseRef }: ParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));
    if (groupRef.current) {
      // Fade in extremely softly during settlement
      const lineAlpha = Math.max(0, smoothProgress.current - 0.5) / 0.5;
      
      groupRef.current.children.forEach(child => {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = lineAlpha * 0.15; // Faint glowing orbital rings
      });

      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * (1 - Math.exp(-4 * delta));
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * (1 - Math.exp(-4 * delta));
      
      // Match the exact cinematic rotation of the particle group
      groupRef.current.rotation.y = smoothMouse.current.x * 0.15;
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.15;
      groupRef.current.rotation.z = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
    }
  });

  return (
    <group ref={groupRef}>
      {PRODUCT_NODES.map((node, i) => {
        const points = useMemo(() => {
          const pts = [];
          // Draw perfect circle mapped to the 3D tilt of the shader
          for (let a = 0; a <= 64; a++) {
            const angle = (a / 64) * Math.PI * 2;
            pts.push(
              new THREE.Vector3(
                Math.cos(angle) * node.radius, 
                Math.sin(angle) * node.radius * 0.15, 
                Math.sin(angle) * node.radius
              )
            );
          }
          return new THREE.BufferGeometry().setFromPoints(pts);
        }, [node.radius]);
        
        return (
          <line key={i} geometry={points}>
            <lineBasicMaterial color={new THREE.Color(...node.color)} transparent opacity={0} blending={THREE.AdditiveBlending} />
          </line>
        );
      })}
    </group>
  );
}

// ─── Camera Controller ─────────────────────────────────────────
import { useThree } from '@react-three/fiber';

function CameraController({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const initialZoom = useRef(25); // Start far out in deep space
  const smoothZ = useRef(25);

  useFrame((_, delta) => {
    // Initial warp-in from z=25 to base z=10.0 (safely outside the Solar System)
    initialZoom.current += (10.0 - initialZoom.current) * (1 - Math.exp(-2.0 * delta));
    
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // "Loop of our universe": Cap the forward movement so we STOP in front of the Solar System
    // and just observe it spinning/looping. This prevents flying perfectly into the mathematical center
    // of particles and crashing the graphics card.
    const maxScroll = 4.0; // Stop moving forward after Intro
    const effectiveScroll = Math.min(scrollY / vh, maxScroll);
    const scrollForward = effectiveScroll * 0.8;
    
    // Target Z stops perfectly at 10.0 - 3.2 = 6.8. 
    // This keeps the Sun exactly in the center, and planets orbiting perfectly in view.
    const targetZ = initialZoom.current - scrollForward;
    
    // Smoothly interpolate the camera's Z position
    smoothZ.current += (targetZ - smoothZ.current) * (1 - Math.exp(-5.0 * delta));
    camera.position.z = smoothZ.current;
  });

  return null;
}

// ─── Main Canvas Export ──────────────────────────────────────

interface ParticleFieldProps {
  progressRef: MutableRefObject<number>;
  className?: string;
}

export default function ParticleField({ progressRef, className }: ParticleFieldProps) {
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1 to +1 range
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={className} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* Heavy vignette overlay for dramatic cinematic focus */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 10%, rgba(5, 6, 10, 0.8) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      <Canvas
        camera={{ position: [0, 0, 20], fov: 65, near: 0.1, far: 150 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#05060A' }}
      >
        {/* Subtle global fog to fade out distant particles */}
        <fog attach="fog" args={['#05060A', 3, 25]} />
        
        <CameraController progressRef={progressRef} />
        <Particles progressRef={progressRef} mouseRef={mouseRef} />
        <SolarSystemRings progressRef={progressRef} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
