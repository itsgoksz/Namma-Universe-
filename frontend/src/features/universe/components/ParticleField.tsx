/**
 * ParticleField — The Core WebGL Universe (Active Theory Style)
 * 
 * High-performance, cinematic particle system.
 * Features:
 * - Tiny, sharp particles with extreme contrast (no blown-out blending)
 * - 4 Phases: Singularity -> Galaxy Spiral -> Settlement -> Constellation
 * - Interactive mouse parallax for deep spatial feel
 */

import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Constants ───────────────────────────────────────────────

const PARTICLE_COUNT = 180000; // Colossal particle count to achieve extreme density during the volumetric burst

// Solar System Planets: 8 planets to maintain the full visual scale of the universe
// We assign specific ones to our products below
const PRODUCT_NODES = [
  { radius: 1.2, startAngle: Math.random() * Math.PI * 2, speed: 0.08, color: [0.44, 0.50, 0.56], size: 1.2 }, // 0: Mercury
  { radius: 1.9, startAngle: Math.random() * Math.PI * 2, speed: 0.05, color: [0.8, 0.2, 0.6], size: 2.5 },  // 1: Venus (Aiva - Pink)
  { radius: 2.7, startAngle: Math.random() * Math.PI * 2, speed: 0.04, color: [0.2, 0.8, 0.4], size: 2.0 },  // 2: Earth (Wellora - Green)
  { radius: 3.6, startAngle: Math.random() * Math.PI * 2, speed: 0.03, color: [0.88, 0.44, 0.22], size: 1.5 }, // 3: Mars
  { radius: 5.2, startAngle: Math.random() * Math.PI * 2, speed: 0.015, color: [0.9, 0.7, 0.2], size: 4.0 },  // 4: Jupiter (Homie - Amber)
  { radius: 7.0, startAngle: Math.random() * Math.PI * 2, speed: 0.01, color: [0.93, 0.86, 0.51], size: 4.0 }, // 5: Saturn
  { radius: 8.8, startAngle: Math.random() * Math.PI * 2, speed: 0.008, color: [0.5, 0.2, 0.9], size: 3.0 },  // 6: Uranus (EV Copilot - Purple)
  { radius: 10.5, startAngle: Math.random() * Math.PI * 2, speed: 0.005, color: [0.1, 0.4, 0.9], size: 2.2 }, // 7: Neptune (Echo - Blue)
];

// Map Product Index (0-4) to Planet Index in PRODUCT_NODES
const productToPlanetMap = [1, 2, 7, 6, 4];

// Global state for cross-route cinematic transitions
export const sharedState = {
  entryTilt: Math.PI / 2.5, // Start by looking from high above (top-down view)
  isZoomingInto: null as string | null,
  spawnZoomedIn: false
};

// ─── GLSL Shaders ────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHeight;
  uniform vec3 uRayOrigin;
  uniform vec3 uRayDir;

  attribute vec3 aExpandedPos;
  attribute vec3 aGalaxyPos;
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
    float expansion     = easeOutCubic(smoothstep(0.12, 0.35, uProgress));
    float galaxyForm    = easeInOutQuart(smoothstep(0.35, 0.55, uProgress));
    float settlement    = easeInOutQuart(smoothstep(0.55, 0.85, uProgress));

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

    // ── Milky Way: Spiral structure ──
    vec3 galaxyPos = aGalaxyPos;
    // We rotate the milky way faster than the expanded dust for a majestic swirling effect
    float mwAngle = uTime * 0.25;
    float mws = sin(mwAngle);
    float mwc = cos(mwAngle);
    vec3 rotatedGalaxyPos = vec3(
      galaxyPos.x * mwc - galaxyPos.z * mws,
      galaxyPos.y,
      galaxyPos.x * mws + galaxyPos.z * mwc
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
    pos = mix(pos, rotatedGalaxyPos, galaxyForm);
    
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
    
    // SAFEGUARD: clamp the divisor. 
    // Instead of a hardcoded constant, calculate attenuation relative to screen height!
    // This guarantees the visual size is a consistent percentage of the screen across ALL resolutions.
    float sizeAttenuation = (uHeight * 0.12) / max(-mvPosition.z, 0.05);
    
    // Increase base size slightly (from 0.15 to 0.5) so they are more visible
    gl_PointSize = (aSize * 0.5) * pulse * sizeAttenuation * uPixelRatio;
    
    // Focus on the central sun and planets
    // Nodes are larger, Sun is massive
    float targetSize = aSize * sizeAttenuation * uPixelRatio * 3.0; // Slightly slightly bigger planets
    targetSize = mix(targetSize, targetSize * 6.0, isSun); // Balance sun so it doesn't get too massive
    gl_PointSize = mix(gl_PointSize, targetSize, isProductNode * settlement);

    // CRITICAL SAFEGUARD: Hard clamp point size to 1200 to prevent strict Windows WebGL drivers 
    // from completely culling and discarding the point if it exceeds ALIASED_POINT_SIZE_RANGE.
    gl_PointSize = min(gl_PointSize, 4000.0);

    // SAFEGUARD: Dynamic clamp based on screen height instead of an absolute 2500px!
    // This prevents the sun from blowing out on low-res screens (1x pixel ratio Windows laptops)
    // while allowing it to be huge on high-res retina displays.
    gl_PointSize = min(gl_PointSize, uHeight * uPixelRatio * 4.0);

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
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  activeProductIndexRef?: React.MutableRefObject<number | null>;
}

function Particles({ progressRef, mouseRef, activeProductIndexRef }: ParticlesProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);

  // Parallax smoothing
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Force geometry rebuild on HMR
  const GEOMETRY_VERSION = 10;

  // Pre-compute particle geometry data
  const { geometry } = useMemo(() => {
    const positions   = new Float32Array(PARTICLE_COUNT * 3);
    const expandedPos = new Float32Array(PARTICLE_COUNT * 3);
    const galaxyPos   = new Float32Array(PARTICLE_COUNT * 3);
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

      // 2. Expanded Burst State (Volumetric Spherical Explosion)
      // We use a true 3D spherical distribution to scatter evenly into all corners like a real explosion
      const burstTheta = Math.random() * Math.PI * 2;
      const burstPhi   = Math.acos(2 * Math.random() - 1);
      
      // Use a smoother clustering power (2.5) to keep a brilliant core, but guarantee a vast, even spread up to a 120-unit radius!
      const burstRadius = 0.5 + Math.pow(Math.random(), 2.5) * 120.0; 

      expandedPos[i * 3]     = burstRadius * Math.sin(burstPhi) * Math.cos(burstTheta);
      // Very slight vertical squash (0.8) so it feels structured, but still vastly volumetric in all directions
      expandedPos[i * 3 + 1] = burstRadius * Math.cos(burstPhi) * 0.8;
      expandedPos[i * 3 + 2] = burstRadius * Math.sin(burstPhi) * Math.sin(burstTheta);

      // --- 2.5. MILKY WAY GALAXY PHASE ---
      const isCoreGalaxy = Math.random() < 0.35; // 35% forms the dense galactic core
      
      let gx, gy, gz;
      
      if (isCoreGalaxy) {
        // Spherical/Ellipsoidal dense core
        const coreRadius = Math.pow(Math.random(), 2.0) * 15.0; // Dense core radius ~15
        const coreTheta = Math.random() * Math.PI * 2;
        const corePhi = Math.acos(2 * Math.random() - 1);
        gx = coreRadius * Math.sin(corePhi) * Math.cos(coreTheta);
        gy = coreRadius * Math.cos(corePhi) * 0.7; // slightly squashed Y
        gz = coreRadius * Math.sin(corePhi) * Math.sin(coreTheta);
      } else {
        // Spiral arms
        const numArms = 2; // Two main spiral arms
        const armIndex = Math.floor(Math.random() * numArms);
        const armOffset = (armIndex * Math.PI * 2) / numArms;
        
        // Distance from center (10 to 110)
        const radius = 10.0 + Math.pow(Math.random(), 1.5) * 100.0;
        
        // Spiral winding (further out = more twisted)
        const winding = 3.5; // Number of twists
        const theta = (radius / 110.0) * Math.PI * winding + armOffset;
        
        // Scatter increases with radius
        const scatterRange = 10.0 * (radius / 110.0) + 3.0;
        const scatterX = (Math.random() - 0.5) * scatterRange;
        const scatterZ = (Math.random() - 0.5) * scatterRange;
        const scatterY = (Math.random() - 0.5) * (3.0 + radius * 0.05); // Thin Y profile
        
        gx = radius * Math.cos(theta) + scatterX;
        gy = scatterY;
        gz = radius * Math.sin(theta) + scatterZ;
      }
      
      // Tilt the entire galaxy slightly (approx 25 degrees) so it looks majestic in 3D
      const tiltAngle = Math.PI * 0.14;
      const cosTilt = Math.cos(tiltAngle);
      const sinTilt = Math.sin(tiltAngle);
      
      galaxyPos[i * 3]     = gx;
      galaxyPos[i * 3 + 1] = gy * cosTilt - gz * sinTilt;
      galaxyPos[i * 3 + 2] = gy * sinTilt + gz * cosTilt;
      // ------------------------------------

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
        // 80% of stars stay in the ultra-dense central core to keep the solar system rich, 
        // 20% span out to a massive radius (100) to fill the screen corners during the flight!
        const isCore = Math.random() < 0.8;
        const tunnelRadius = isCore 
          ? 3.0 + Math.sqrt(Math.random()) * 40.0 
          : 43.0 + Math.random() * 60.0;
          
        const tunnelAngle = Math.random() * Math.PI * 2;
        // Wrap stars all the way from the distant starting camera (+150) down into the deep background (-70)
        const tunnelZ = 150.0 - Math.random() * 220.0; 
        
        targets[i * 3]     = Math.cos(tunnelAngle) * tunnelRadius;
        // Keep the vertical galaxy squash for the dense core, but let the outer shell be a massive perfect circle
        targets[i * 3 + 1] = Math.sin(tunnelAngle) * tunnelRadius * (isCore ? 0.6 : 1.0);
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
    geo.setAttribute('aGalaxyPos', new THREE.BufferAttribute(galaxyPos, 3));
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
    uHeight:     { value: window.innerHeight },
    uRayOrigin:  { value: new THREE.Vector3() },
    uRayDir:     { value: new THREE.Vector3() },
  }), []);

  // Animation loop
  useFrame(({ camera, clock }, delta) => {
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));

    if (materialRef.current && groupRef.current) {
      materialRef.current.uniforms.uProgress.value = smoothProgress.current;
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uHeight.value = window.innerHeight;
      
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
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02) + sharedState.entryTilt;
      
      // Cinematic spin (roll) around the camera's flight path
      groupRef.current.rotation.z = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
    }
  });

  return (
    <group ref={groupRef}>
      <ActivePlanet activeProductIndexRef={activeProductIndexRef} />
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
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.15 + sharedState.entryTilt;
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

function ActivePlanet({ activeProductIndexRef }: { activeProductIndexRef?: React.MutableRefObject<number | null> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (!activeProductIndexRef || activeProductIndexRef.current === null) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }
    
    if (meshRef.current) meshRef.current.visible = true;

    // Snap to the exact integer to show ONE planet cleanly
    const idx = Math.round(activeProductIndexRef.current);
    if (idx < 0 || idx >= productToPlanetMap.length) return;
    
    const p0 = PRODUCT_NODES[productToPlanetMap[idx]];
    
    const angle0 = p0.startAngle + clock.elapsedTime * p0.speed;
    const pos0 = new THREE.Vector3(
      Math.cos(angle0) * p0.radius,
      Math.sin(angle0) * p0.radius * 0.15,
      Math.sin(angle0) * p0.radius
    );
    
    meshRef.current.position.copy(pos0);
    // Slowly rotate the planet for a majestic feel
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x += 0.001;
    
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.setRGB(p0.color[0], p0.color[1], p0.color[2]);
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <sphereGeometry args={[0.2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uColor: { value: new THREE.Color() },
          uTime: { value: 0 }
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vViewPosition;
          void main() {
            vUv = uv;
            vObjPos = position;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vViewPosition;
          
          // Simplex 3D Noise
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }
          
          float fbm(vec3 x) {
            float v = 0.0; float a = 0.5; vec3 shift = vec3(100);
            for (int i = 0; i < 4; ++i) { v += a * snoise(x); x = x * 2.0 + shift; a *= 0.5; }
            return v;
          }

          void main() {
            vec3 viewDir = normalize(vViewPosition);
            float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
            float smoothRim = smoothstep(0.5, 1.0, rim);
            
            vec3 spherePos = normalize(vObjPos) * 5.0;
            
            // Lava/Energy cracks
            float cracks = fbm(spherePos * 1.5 - uTime * 0.1);
            float energyMask = smoothstep(0.4, 0.6, abs(cracks));
            
            vec3 baseColor = uColor * 0.15;
            vec3 energyColor = uColor * (1.0 - energyMask) * 2.5;
            vec3 rimColor = uColor * smoothRim * 2.0;
            
            vec3 finalColor = baseColor + energyColor + rimColor;
            
            // Soft fade on the edges so it blends beautifully with deep space
            float alpha = smoothstep(0.0, 0.4, dot(viewDir, vNormal));
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </mesh>
  );
}



interface CameraControllerProps {
  progressRef: MutableRefObject<number>;
  activeProductIndexRef?: React.MutableRefObject<number | null>;
  mouseRef: MutableRefObject<{ x: number, y: number }>;
}

function CameraController({ progressRef, activeProductIndexRef, mouseRef }: CameraControllerProps) {
  const { camera } = useThree();
  const initialZoom = useRef(150.0); // Start insanely far out for a hyper-immersive, cinematic fly-in
  
  const smoothProgress = useRef(0);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 25));
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isFirstFrame = useRef(true);

  useFrame(({ clock }, delta) => {
    // Sync shared smoothing variables
    smoothProgress.current += (progressRef.current - smoothProgress.current) * (1 - Math.exp(-6 * delta));
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * (1 - Math.exp(-4 * delta));
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * (1 - Math.exp(-4 * delta));

    // Majestic, slow, cinematic flight through the stars before settling into the solar system (0.5 instead of 2.0 multiplier)
    initialZoom.current += (17.5 - initialZoom.current) * (1 - Math.exp(-0.5 * delta));

    // Decay the top-down entry tilt so the solar system beautifully flattens out as we arrive
    sharedState.entryTilt += (0 - sharedState.entryTilt) * (1 - Math.exp(-0.5 * delta));
    
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
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02) + sharedState.entryTilt;
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        
        pos0.applyEuler(euler);
        
        const planetLook = pos0.clone();
        const planetPos = pos0.clone().add(new THREE.Vector3(0, 0.02, 0.4));
        
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
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02) + sharedState.entryTilt;
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        
        pos1.applyEuler(euler);
        
        const planetLook = pos1.clone();
        const planetPos = pos1.clone().add(new THREE.Vector3(0, 0.02, 0.15));
        
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
        const rx = -smoothMouse.current.y * 0.15 + (extraScrollRot * 0.02) + sharedState.entryTilt;
        const ry = smoothMouse.current.x * 0.15 + (extraScrollRot * 0.05);
        const rz = smoothProgress.current * 0.5 + (Date.now() % 100000) * 0.00005;
        
        const euler = new THREE.Euler(rx, ry, rz, 'XYZ');
        pos.applyEuler(euler);
        
        targetLook.copy(pos);
        targetPos.copy(pos).add(new THREE.Vector3(0, 0.02, 0.4));
      }

      if (activeProductIndexRef && activeProductIndexRef.current !== null) {
        const panOffset = new THREE.Vector3(0.22, 0, 0);
        targetLook.add(panOffset);
        targetPos.add(panOffset);
      }
    }

    if (isFirstFrame.current && sharedState.spawnZoomedIn) {
      // Instantly snap to position if we just arrived from a cinematic warp
      smoothTarget.current.copy(targetPos);
      smoothLookAt.current.copy(targetLook);
    } else {
      // Smoothly interpolate camera. Use high speed when tracking a planet to prevent lag/drift!
      const isTrackingPlanet = activeProductIndexRef && activeProductIndexRef.current !== null;
      const speed = sharedState.isZoomingInto ? 20.0 : (isTrackingPlanet ? 15.0 : 3.0);
      smoothTarget.current.lerp(targetPos, 1 - Math.exp(-speed * delta));
      smoothLookAt.current.lerp(targetLook, 1 - Math.exp(-(speed + 1.0) * delta));
    }
    isFirstFrame.current = false;

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
        {/* Flat plane sized to match the 2:1 aspect ratio of the new 800x400 image */}
        <planeGeometry args={[0.6, 0.3]} />
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

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
        <Particles progressRef={progressRef} mouseRef={mouseRef} activeProductIndexRef={activeProductIndexRef} />
        <SolarSystemRings progressRef={progressRef} mouseRef={mouseRef} />
        <SpaceshipCursor mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
