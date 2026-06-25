/**
 * ParticleField — The Core WebGL Universe (Active Theory Style)
 * 
 * High-performance, cinematic particle system.
 * Features:
 * - Tiny, sharp particles with extreme contrast (no blown-out blending)
 * - 4 Phases: Singularity -> Galaxy Spiral -> Settlement -> Constellation
 * - Interactive mouse parallax for deep spatial feel
 */

import { useRef, useMemo, useEffect, Suspense } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Constants ───────────────────────────────────────────────

const PARTICLE_COUNT = 35000; // Massively increased for a deeply dense, rich galaxy that fills the whole tunnel

// Solar System Planets: 8 planets to maintain the full visual scale of the universe
// We assign specific ones to our products below
const PRODUCT_NODES = [
  { radius: 1.2, startAngle: Math.random() * Math.PI * 2, speed: 1.60, color: [0.44, 0.50, 0.56], size: 1.2 }, // 0: Mercury
  { radius: 1.9, startAngle: Math.random() * Math.PI * 2, speed: 1.10, color: [0.8, 0.2, 0.6], size: 2.5 },  // 1: Venus (Aiva - Pink)
  { radius: 2.7, startAngle: Math.random() * Math.PI * 2, speed: 0.80, color: [0.2, 0.8, 0.4], size: 2.0 },  // 2: Earth (Wellora - Green)
  { radius: 3.6, startAngle: Math.random() * Math.PI * 2, speed: 0.50, color: [0.88, 0.44, 0.22], size: 1.5 }, // 3: Mars
  { radius: 5.2, startAngle: Math.random() * Math.PI * 2, speed: 0.25, color: [0.9, 0.7, 0.2], size: 4.0 },  // 4: Jupiter (Homie - Amber)
  { radius: 7.0, startAngle: Math.random() * Math.PI * 2, speed: 0.15, color: [0.93, 0.86, 0.51], size: 4.0 }, // 5: Saturn
  { radius: 8.8, startAngle: Math.random() * Math.PI * 2, speed: 0.10, color: [0.5, 0.2, 0.9], size: 3.0 },  // 6: Uranus (EV Copilot - Purple)
  { radius: 10.5, startAngle: Math.random() * Math.PI * 2, speed: 0.05, color: [0.1, 0.4, 0.9], size: 2.2 }, // 7: Neptune (Echo - Blue)
];

// Map Product Index (0-4) to Planet Index in PRODUCT_NODES
const productToPlanetMap = [1, 2, 7, 6, 4];

// ─── GLSL Shaders ────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uRayOrigin;
  uniform vec3 uRayDir;

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

    // ── DEEP SPACE CONTINUOUS DRIFT ──
    // Slowly move background dust towards the camera continuously to simulate floating in space
    if (isProductNode < 0.5 && settlement > 0.5) {
      // Base speed: very slow so it's ambient
      float driftSpeed = 3.0 * (settlement - 0.5) * 2.0; // Fade in drift speed after settlement
      // Shift forward and wrap around from +20 back to -80 to create an infinite seamless tunnel
      pos.z = mod(pos.z + uTime * driftSpeed + 80.0, 100.0) - 80.0;
    }

    // ── PREMIUM SPACESHIP GRAVITY (PERFECT 3D RAYCAST) ──
    if (isProductNode < 0.5 && settlement > 0.5) {
      vec3 w = pos - uRayOrigin;
      float t = dot(w, uRayDir);
      vec3 nearestRayPoint = uRayOrigin + t * uRayDir;
      
      vec3 dirToMouse = nearestRayPoint - pos;
      float distToMouse = length(dirToMouse);
      
      // Calculate a soft, elegant radius for the gravitational field
      float pull = smoothstep(10.0, 0.0, distToMouse);
      float smoothPull = pow(pull, 2.0); // very smooth falloff for premium feel
      
      if (pull > 0.0) {
        // 1. Elegant Attraction: Pull particles gracefully towards the ship's path
        float pullStrength = min(distToMouse * 0.85, smoothPull * 6.0);
        vec3 pullVec = normalize(dirToMouse) * pullStrength;
        
        // 2. Liquid Swirl: Extremely subtle rotational swirl around the ship
        vec3 swirlVec = normalize(cross(uRayDir, dirToMouse)) * (smoothPull * 0.8);
        
        // 3. Optical Depth: Pull them slightly forward towards the camera 
        // to create a beautiful, prominent 3D cluster effect behind the ship.
        vec3 depthPull = -uRayDir * (smoothPull * 2.5);
        
        pos += pullVec + swirlVec + depthPull;
      }
    }

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
  const GEOMETRY_VERSION = 9;

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
      new THREE.Color('#FFB347'), // warm amber/gold (nebula feel)
      new THREE.Color('#FF7B54'), // deep coral/orange
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
      // Much larger radius to fill screen edges
      const radius = 0.5 + Math.pow(Math.random(), 2.0) * 40.0; 
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
        sizes[i]          = 50.0; // Massive glowing sun
        colors[i * 3]     = 1.0; 
        colors[i * 3 + 1] = 0.85; // Bright vibrant yellow
        colors[i * 3 + 2] = 0.15;
        // MUST be 1.0 so it doesn't drift like background dust
        isProduct[i]      = 1.0;
      } else {
        // Ambient background dust final targets: infinite deep starry tunnel
        // Uniform circular distribution inside a radius of 40, keeping a hollow core of 3
        const tunnelRadius = 3.0 + Math.sqrt(Math.random()) * 40.0; 
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
          sizes[i] = Math.random() * 1.5 + 0.3;
          // Pick color based on radius and random distribution
          let colBase: THREE.Color;
          
          if (Math.random() > 0.6) {
             // 40% chance for Warm Nebula (Amber/Coral)
             colBase = cosmicColors[5].clone().lerp(cosmicColors[6], Math.random());
          } else {
             if (tunnelRadius < 8.0) {
               colBase = cosmicColors[4]; // White/bright core
             } else if (tunnelRadius < 16.0) {
               colBase = cosmicColors[3].clone().lerp(cosmicColors[2], Math.random()); // Cyan/Violet mid
             } else {
               colBase = cosmicColors[2].clone().lerp(cosmicColors[4], Math.random()); // Violet/White edge (bright!)
             }
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
    uRayOrigin:  { value: new THREE.Vector3() },
    uRayDir:     { value: new THREE.Vector3() },
  }), []);

  // Animation loop
  useFrame(({ camera }, delta) => {
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));

    if (materialRef.current && groupRef.current) {
      materialRef.current.uniforms.uProgress.value = smoothProgress.current;
      materialRef.current.uniforms.uTime.value += delta;
      
      // Calculate mouse with a bit more smoothing for the gravity feel
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * (1 - Math.exp(-4 * delta));
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * (1 - Math.exp(-4 * delta));
      
      // Perfect 3D Raycasting: Convert mouse coordinates to a true 3D ray in the group's local space
      const mouseVec = new THREE.Vector3(smoothMouse.current.x, -smoothMouse.current.y, 0.5);
      mouseVec.unproject(camera);
      
      const rayOrigin = camera.position.clone();
      const rayDir = mouseVec.sub(camera.position).normalize();
      
      // Convert to local space of the particle group to match vertex coordinates
      groupRef.current.worldToLocal(rayOrigin);
      
      const rayTarget = camera.position.clone().add(rayDir);
      groupRef.current.worldToLocal(rayTarget);
      
      const localRayDir = rayTarget.sub(rayOrigin).normalize();
      
      materialRef.current.uniforms.uRayOrigin.value.copy(rayOrigin);
      materialRef.current.uniforms.uRayDir.value.copy(localRayDir);
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
      <points frustumCulled={false} geometry={geometry as any}>
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



interface CameraControllerProps {
  progressRef: MutableRefObject<number>;
  activeProductIndexRef?: React.MutableRefObject<number | null>;
  mouseRef: MutableRefObject<{ x: number, y: number }>;
}

function CameraController({ progressRef, activeProductIndexRef, mouseRef }: CameraControllerProps) {
  const { camera } = useThree();
  const initialZoom = useRef(25);
  
  const smoothProgress = useRef(0);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 25));
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ clock }, delta) => {
    // Sync shared smoothing variables
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * (1 - Math.exp(-4 * delta));
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * (1 - Math.exp(-4 * delta));

    initialZoom.current += (10.0 - initialZoom.current) * (1 - Math.exp(-2.0 * delta));
    
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = 4.0;
    const effectiveScroll = Math.min(scrollY / vh, maxScroll);
    const scrollForward = effectiveScroll * 0.8;
    
    const baseZ = initialZoom.current - scrollForward;
    
    let targetPos = new THREE.Vector3(0, 0, baseZ);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (activeProductIndexRef && activeProductIndexRef.current !== null) {
      const idx = activeProductIndexRef.current;
      
      if (idx < 0) {
        // Interpolate between solar system and planet 0
        const t = Math.max(0, idx + 1); // 0 to 1
        
        const p0 = PRODUCT_NODES[productToPlanetMap[0]];
        const angle0 = p0.startAngle + clock.elapsedTime * p0.speed;
        const pos0 = new THREE.Vector3(
          Math.cos(angle0) * p0.radius,
          Math.sin(angle0) * p0.radius * 0.15,
          Math.sin(angle0) * p0.radius
        );
        
        const extraScrollRot = Math.max(0, (scrollY / vh) - 4.0);
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02);
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        
        pos0.applyEuler(euler);
        
        const planetLook = pos0.clone();
        const planetPos = pos0.clone().add(new THREE.Vector3(0, 0.5, 3.0));
        
        targetLook.lerp(planetLook, t);
        targetPos.lerp(planetPos, t);

      } else if (idx > productToPlanetMap.length - 1) {
        // Interpolate between last planet and solar system (zooming out)
        const t = Math.max(0, 1 - (idx - (productToPlanetMap.length - 1))); // 1 to 0
        
        const lastIdx = productToPlanetMap.length - 1;
        const p1 = PRODUCT_NODES[productToPlanetMap[lastIdx]];
        const angle1 = p1.startAngle + clock.elapsedTime * p1.speed;
        const pos1 = new THREE.Vector3(
          Math.cos(angle1) * p1.radius,
          Math.sin(angle1) * p1.radius * 0.15,
          Math.sin(angle1) * p1.radius
        );
        
        const extraScrollRot = Math.max(0, (scrollY / vh) - 4.0);
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02);
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        
        pos1.applyEuler(euler);
        
        const planetLook = pos1.clone();
        const planetPos = pos1.clone().add(new THREE.Vector3(0, 0.5, 3.0));
        
        targetLook.lerp(planetLook, t);
        targetPos.lerp(planetPos, t);
        
      } else {
        // Normal interpolation between planets
        const index0 = Math.floor(idx);
        const index1 = Math.min(index0 + 1, productToPlanetMap.length - 1);
        const t = idx - index0;
        
        const p0 = PRODUCT_NODES[productToPlanetMap[index0]];
        const p1 = PRODUCT_NODES[productToPlanetMap[index1]];
        
        const angle0 = p0.startAngle + clock.elapsedTime * p0.speed;
        const pos0 = new THREE.Vector3(
          Math.cos(angle0) * p0.radius,
          Math.sin(angle0) * p0.radius * 0.15,
          Math.sin(angle0) * p0.radius
        );
        
        const angle1 = p1.startAngle + clock.elapsedTime * p1.speed;
        const pos1 = new THREE.Vector3(
          Math.cos(angle1) * p1.radius,
          Math.sin(angle1) * p1.radius * 0.15,
          Math.sin(angle1) * p1.radius
        );
        
        const pos = new THREE.Vector3().lerpVectors(pos0, pos1, t);
        
        const extraScrollRot = Math.max(0, (scrollY / vh) - 4.0);
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02);
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        pos.applyEuler(euler);
        
        targetLook.copy(pos);
        targetPos.copy(pos).add(new THREE.Vector3(0, 0.5, 3.0));
      }
    }

    // Smoothly interpolate camera
    smoothTarget.current.lerp(targetPos, 1 - Math.exp(-3.0 * delta));
    smoothLookAt.current.lerp(targetLook, 1 - Math.exp(-4.0 * delta));

    camera.position.copy(smoothTarget.current);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
}

// ─── Spaceship Cursor Component ─────────────────────────────

function SpaceshipCursorModel({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
  const shipRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const prevPos = useRef(new THREE.Vector3());
  
  // Load the user's custom image using native R3F useLoader to prevent context errors
  const texture = useLoader(THREE.TextureLoader, '/space-probe.png');

  useFrame((state, delta) => {
    if (!shipRef.current) return;
    
    // Unproject to find world position at a fixed distance from the camera
    const mouseVec = new THREE.Vector3(mouseRef.current.x, -mouseRef.current.y, 0.5);
    mouseVec.unproject(camera);
    
    const rayDir = mouseVec.sub(camera.position).normalize();
    
    // Place ship 10 units in front of the camera perfectly on the interaction ray
    const shipPos = camera.position.clone().add(rayDir.multiplyScalar(10.0));
    
    // Smooth lerp for a floating, trailing follow effect
    shipRef.current.position.lerp(shipPos, 1 - Math.exp(-12 * delta));
    
    // Calculate velocity for banking/tilting
    const velocity = shipRef.current.position.clone().sub(prevPos.current);
    prevPos.current.copy(shipRef.current.position);
    
    // Always perfectly face the camera like a 2D cursor sprite
    shipRef.current.lookAt(camera.position);
    
    // Add a subtle 2D roll based on horizontal movement for a dynamic flying feel
    const targetRoll = -velocity.x * 2.0;
    shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, targetRoll, 0.1);
  });

  return (
    <group ref={shipRef}>
      <mesh>
        {/* Flat plane sized to the requested small probe size */}
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          side={THREE.DoubleSide} 
          depthTest={false} // Ensures the cursor always renders fully on top of stars
        />
      </mesh>
    </group>
  );
}

function SpaceshipCursor({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
  return (
    <Suspense fallback={null}>
      <SpaceshipCursorModel mouseRef={mouseRef} />
    </Suspense>
  );
}

// ─── Main Canvas Export ──────────────────────────────────────

interface ParticleFieldProps {
  progressRef: MutableRefObject<number>;
  activeProductIndexRef?: React.MutableRefObject<number | null>;
  className?: string;
}

export default function ParticleField({ progressRef, activeProductIndexRef, className }: ParticleFieldProps) {
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse and touch for parallax and gravity effects
  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      mouseRef.current = {
        x: (clientX / window.innerWidth) * 2 - 1,
        y: (clientY / window.innerHeight) * 2 - 1,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
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
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#05060A' }}
      >
        {/* Cinematic depth of field via fog to slowly fade out extremely distant particles */}
        <fog attach="fog" args={['#05060A', 15, 90]} />
        
        <CameraController progressRef={progressRef} activeProductIndexRef={activeProductIndexRef} mouseRef={mouseRef} />
        <Particles progressRef={progressRef} mouseRef={mouseRef} />
        <SolarSystemRings progressRef={progressRef} mouseRef={mouseRef} />
        <SpaceshipCursor mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
