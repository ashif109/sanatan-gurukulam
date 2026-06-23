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

    // Astro-particles (glowing stars)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scaleFactors = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Celestial spherical distribution for realistic orbital shapes
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 4 + Math.random() * 8; // distributed shell

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      scaleFactors[i] = 0.5 + Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom shader material for beautiful soft round aura-like golden stars
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.15,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const starParticles = new THREE.Points(geometry, particleMaterial);
    scene.add(starParticles);

    // Creating neat outer connecting orbital rings (represented in screenshots)
    const ringsGroup = new THREE.Group();
    const ringColors = ['#f59e0b', '#d97706', '#f97316'];
    
    for (let r = 0; r < 3; r++) {
      const radius = 5 + r * 2.2;
      const segments = 64;
      const ringGeometry = new THREE.BufferGeometry();
      const ringPositions = new Float32Array((segments + 1) * 3);

      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        ringPositions[s * 3] = radius * Math.cos(theta);
        ringPositions[s * 3 + 1] = radius * Math.sin(theta);
        ringPositions[s * 3 + 2] = (Math.random() - 0.5) * 0.1; // flat with slight wobble
      }

      ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
      const ringMaterial = new THREE.LineBasicMaterial({
        color: ringColors[r % ringColors.length],
        transparent: true,
        opacity: r === 0 ? 0.25 : r === 1 ? 0.12 : 0.06,
        blending: THREE.AdditiveBlending,
      });

      const ringLine = new THREE.Line(ringGeometry, ringMaterial);
      // Give them distinctive rotation angles
      ringLine.rotation.x = Math.random() * Math.PI;
      ringLine.rotation.y = Math.random() * Math.PI;
      ringsGroup.add(ringLine);
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
    resizeObserver.observe(containerRef.current);

    // Animation frames loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow elegant astronomical rotates
      starParticles.rotation.y = elapsedTime * 0.05;
      starParticles.rotation.x = elapsedTime * 0.02;

      ringsGroup.children.forEach((ring, idx) => {
        ring.rotation.z += 0.002 * (idx + 1);
        ring.rotation.y += 0.001 * (idx + 1);
      });

      // Smooth camera sway with mouse influence
      if (interactive) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        camera.position.x = currentX * 1.5;
        camera.position.y = -currentY * 1.5;
        camera.lookAt(scene.position);
      }

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
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
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
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
