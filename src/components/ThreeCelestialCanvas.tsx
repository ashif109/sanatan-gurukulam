import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCelestialCanvasProps {
  color?: string;
  particleCount?: number;
  interactive?: boolean;
  className?: string;
}

export default function ThreeCelestialCanvas({
  color = '#f97316', // Orange theme accent
  particleCount = 180,
  interactive = true,
  className = '',
}: ThreeCelestialCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLightMode, setIsLightMode] = React.useState(
    typeof document !== 'undefined' ? document.documentElement.classList.contains('light') : false
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 300;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 15;

    // Renderer setup with alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Theme color determination: light mode uses a warm sienna/bronze (#9f6107), dark mode uses the gold theme accent
    const getThemeColor = () => {
      const isLightMode = document.documentElement.classList.contains('light');
      return isLightMode ? '#9f6107' : color;
    };

    let activeColor = getThemeColor();
    const isLightModeOnStart = document.documentElement.classList.contains('light');
    const blendingMode = isLightModeOnStart ? THREE.NormalBlending : THREE.AdditiveBlending;

    // Astro-particles (glowing stars)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scaleFactors = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + Math.random() * 9.5; // distributed shell

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scaleFactors[i] = 0.5 + Math.random() * 2.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Points material (diamond square drift particles)
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(activeColor),
      size: 0.22,
      transparent: true,
      opacity: 0.7,
      blending: blendingMode,
      sizeAttenuation: true,
    });

    const starParticles = new THREE.Points(geometry, particleMaterial);
    scene.add(starParticles);

    // Dynamic starry constellation links
    const constellationGeo = new THREE.BufferGeometry();
    const constellationIndices: number[] = [];
    const maxDist = 3.5;
    let connectionsCount = 0;
    
    // Connect points that are close
    for (let i = 0; i < particleCount && connectionsCount < 100; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];
      for (let j = i + 1; j < particleCount && connectionsCount < 100; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < maxDist) {
          constellationIndices.push(i, j);
          connectionsCount++;
        }
      }
    }
    
    constellationGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    constellationGeo.setIndex(constellationIndices);
    const constellationMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(activeColor),
      transparent: true,
      opacity: 0.12,
      blending: blendingMode,
    });
    const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
    starParticles.add(constellationLines);

    // --- PROGRAMMATIC 3D SACRED YANTRA WIREFRAME ---
    const yantraGroup = new THREE.Group();

    // 1. Bhupura (Outer Square Gate outline representing the temple bounds)
    const gatePoints = [
      new THREE.Vector3(-4.5, 4.5, 0),
      new THREE.Vector3(-1.0, 4.5, 0),
      new THREE.Vector3(-1.0, 5.0, 0),
      new THREE.Vector3(1.0, 5.0, 0),
      new THREE.Vector3(1.0, 4.5, 0),
      new THREE.Vector3(4.5, 4.5, 0),
      
      new THREE.Vector3(4.5, 1.0, 0),
      new THREE.Vector3(5.0, 1.0, 0),
      new THREE.Vector3(5.0, -1.0, 0),
      new THREE.Vector3(4.5, -1.0, 0),
      new THREE.Vector3(4.5, -4.5, 0),
      
      new THREE.Vector3(1.0, -4.5, 0),
      new THREE.Vector3(1.0, -5.0, 0),
      new THREE.Vector3(-1.0, -5.0, 0),
      new THREE.Vector3(-1.0, -4.5, 0),
      new THREE.Vector3(-4.5, -4.5, 0),
      
      new THREE.Vector3(-4.5, -1.0, 0),
      new THREE.Vector3(-5.0, -1.0, 0),
      new THREE.Vector3(-5.0, 1.0, 0),
      new THREE.Vector3(-4.5, 1.0, 0),
      new THREE.Vector3(-4.5, 4.5, 0)
    ];
    const bhupuraGeo = new THREE.BufferGeometry().setFromPoints(gatePoints);
    const bhupuraMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(activeColor),
      transparent: true,
      opacity: 0.16,
      blending: blendingMode
    });
    const bhupuraLine = new THREE.Line(bhupuraGeo, bhupuraMat);
    yantraGroup.add(bhupuraLine);

    // 2. Concentric Circles
    const circleRadii = [3.8, 3.4];
    circleRadii.forEach((r) => {
      const segs = 64;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= segs; s++) {
        const t = (s / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0));
      }
      const circleGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const circleMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(activeColor),
        transparent: true,
        opacity: 0.14,
        blending: blendingMode
      });
      const circleLine = new THREE.Line(circleGeo, circleMat);
      yantraGroup.add(circleLine);
    });

    // 3. Concentric Lotus Petals Rings (using rose curve math formulas)
    const createPetalRing = (radius: number, petals: number, opacityVal: number) => {
      const pts: THREE.Vector3[] = [];
      const totalSegs = petals * 16;
      for (let i = 0; i <= totalSegs; i++) {
        const theta = (i / totalSegs) * Math.PI * 2;
        const r = radius * (1.0 + 0.18 * Math.abs(Math.sin(theta * (petals / 2))));
        pts.push(new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 0));
      }
      const petalGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const petalMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(activeColor),
        transparent: true,
        opacity: opacityVal,
        blending: blendingMode
      });
      return new THREE.Line(petalGeo, petalMat);
    };
    yantraGroup.add(createPetalRing(2.6, 8, 0.13));  // 8-petal outer circle
    yantraGroup.add(createPetalRing(2.0, 16, 0.11)); // 16-petal inner circle

    // 4. Volumetric Interlocking Triangles stacked along Z-axis (holographic Sri Yantra core)
    const downwardTriangles = [
      { scaleX: 1.8, scaleY: 1.5, z: -0.6, yOffset: -0.1 },
      { scaleX: 1.3, scaleY: 1.1, z: -0.3, yOffset: 0.05 },
      { scaleX: 0.9, scaleY: 0.8, z: 0.0, yOffset: 0.15 },
      { scaleX: 0.7, scaleY: 0.5, z: 0.3, yOffset: 0.25 },
      { scaleX: 0.4, scaleY: 0.3, z: 0.6, yOffset: 0.35 }
    ];
    const upwardTriangles = [
      { scaleX: 1.6, scaleY: 1.4, z: -0.45, yOffset: 0.1 },
      { scaleX: 1.1, scaleY: 1.0, z: -0.15, yOffset: -0.05 },
      { scaleX: 0.8, scaleY: 0.7, z: 0.15, yOffset: -0.2 },
      { scaleX: 0.5, scaleY: 0.4, z: 0.45, yOffset: -0.3 }
    ];

    const addYantraTriangle = (sX: number, sY: number, zVal: number, yOff: number, isUp: boolean) => {
      const pts = isUp ? [
        new THREE.Vector3(0, sY + yOff, zVal),
        new THREE.Vector3(sX, -sY + yOff, zVal),
        new THREE.Vector3(-sX, -sY + yOff, zVal),
        new THREE.Vector3(0, sY + yOff, zVal)
      ] : [
        new THREE.Vector3(0, -sY + yOff, zVal),
        new THREE.Vector3(sX, sY + yOff, zVal),
        new THREE.Vector3(-sX, sY + yOff, zVal),
        new THREE.Vector3(0, -sY + yOff, zVal)
      ];
      const triGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const triMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(activeColor),
        transparent: true,
        opacity: 0.15,
        blending: blendingMode
      });
      const line = new THREE.Line(triGeo, triMat);
      yantraGroup.add(line);
    };

    downwardTriangles.forEach(t => addYantraTriangle(t.scaleX, t.scaleY, t.z, t.yOffset, false));
    upwardTriangles.forEach(t => addYantraTriangle(t.scaleX, t.scaleY, t.z, t.yOffset, true));
    
    // 5. Central Bindu dot (offset forward)
    const binduSegs = 16;
    const binduPts: THREE.Vector3[] = [];
    const binduRadius = 0.08;
    for (let s = 0; s <= binduSegs; s++) {
      const t = (s / binduSegs) * Math.PI * 2;
      binduPts.push(new THREE.Vector3(binduRadius * Math.cos(t), binduRadius * Math.sin(t), 0.7));
    }
    const binduGeo = new THREE.BufferGeometry().setFromPoints(binduPts);
    const binduMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(activeColor),
      transparent: true,
      opacity: 0.5,
      blending: blendingMode
    });
    const binduLine = new THREE.Line(binduGeo, binduMat);
    yantraGroup.add(binduLine);

    scene.add(yantraGroup);

    // Dynamic astrological coordinates / planet orbit rings in background
    const ringsGroup = new THREE.Group();
    const ringColors = ['#f59e0b', '#d97706', '#f97316'];
    
    // Tilted ring mimicking ecliptic coordinate paths
    for (let i = 0; i < 2; i++) {
      const radius = 7.5 + i * 2.0;
      const segments = 64;
      const ringGeometry = new THREE.BufferGeometry();
      const ringPositions = new Float32Array((segments + 1) * 3);
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        ringPositions[s * 3] = radius * Math.cos(theta);
        ringPositions[s * 3 + 1] = radius * Math.sin(theta);
        ringPositions[s * 3 + 2] = 0;
      }
      ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
      const ringMaterial = new THREE.LineBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: 0.06,
        blending: blendingMode,
      });
      const line = new THREE.Line(ringGeometry, ringMaterial);
      line.rotation.x = (20 + i * 15) * (Math.PI / 180);
      line.rotation.y = (10 - i * 5) * (Math.PI / 180);
      ringsGroup.add(line);
    }
    scene.add(ringsGroup);

    // Mouse movement interaction tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 2;
      targetY = (y / rect.height) * 2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize Observer for fluid grid density
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: currentW, height: currentH } = entry.contentRect;
        renderer.setSize(currentW, currentH);
        camera.aspect = currentW / currentH;
        camera.updateProjectionMatrix();
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Observe theme toggling class changes on <html> element
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains('light');
      const nextColorStr = isLight ? '#9f6107' : color;
      const nextColor = new THREE.Color(nextColorStr);
      const nextBlending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

      // Update particle material in real-time
      particleMaterial.color.copy(nextColor);
      particleMaterial.blending = nextBlending;
      particleMaterial.needsUpdate = true;

      // Update constellation lines material
      constellationMat.color.copy(nextColor);
      constellationMat.blending = nextBlending;
      constellationMat.needsUpdate = true;

      // Update Yantra wireframes
      yantraGroup.children.forEach((child) => {
        if (child instanceof THREE.Line || child instanceof THREE.LineSegments) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.copy(nextColor);
          mat.blending = nextBlending;
          mat.needsUpdate = true;
        }
      });

      // Update astrological outer rings
      ringsGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.copy(nextColor);
          mat.blending = nextBlending;
          mat.needsUpdate = true;
        }
      });
      setIsLightMode(isLight);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Animation frames loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate particles (increased speed for visibility)
      starParticles.rotation.y = elapsedTime * 0.12;
      starParticles.rotation.x = elapsedTime * 0.04;

      // Slowly rotate 3D Sacred Yantra wireframe
      yantraGroup.rotation.y = elapsedTime * 0.18;
      yantraGroup.rotation.x = elapsedTime * 0.08;

      // Slowly rotate astrological coordinate rings
      ringsGroup.rotation.z = elapsedTime * 0.06;
      ringsGroup.rotation.y = elapsedTime * 0.03;

      // Organic camera sway even without mouse move + responsive mouse follow
      const swayX = Math.sin(elapsedTime * 0.4) * 1.0;
      const swayY = Math.cos(elapsedTime * 0.3) * 1.0;

      if (interactive) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        camera.position.x = (currentX * 2.0) + swayX;
        camera.position.y = (-currentY * 2.0) + swayY;
      } else {
        camera.position.x = swayX;
        camera.position.y = swayY;
      }
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      observer.disconnect();
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      constellationGeo.dispose();
      constellationMat.dispose();
      
      // Dispose Yantra elements
      yantraGroup.children.forEach((child) => {
        if (child instanceof THREE.Line || child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      // Dispose astrological rings
      ringsGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [color, particleCount, interactive]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ mixBlendMode: isLightMode ? 'normal' : 'screen' }}
    />
  );
}
