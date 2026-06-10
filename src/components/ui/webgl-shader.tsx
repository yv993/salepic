"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Chromatic sine-filament shader, adapted for the postcard brand:
 *  - SCOPED to its container (sized to the parent via ResizeObserver, not the
 *    window); canvas is absolute + pointer-events-none.
 *  - RECOLORED: the three line intensities map onto brand clay/gold/steel, so
 *    it reads as glowing red/gold/steel filaments on near-black (not neon RGB).
 *  - REDUCED-MOTION: renders a single static frame, no RAF loop.
 *  - PAUSES offscreen via IntersectionObserver (battery/perf).
 *  - GLSL1 RawShaderMaterial (compiles under WebGL2); full dispose on unmount.
 */
export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let mesh: THREE.Mesh | null = null;
    let raf: number | null = null;
    let running = false;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const uniforms = {
      resolution: { value: [1, 1] as [number, number] },
      time: { value: 0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.06 },
      // Obsidian Atelier palette: terracotta clay, burnished gold, slate steel.
      uClay: { value: new THREE.Vector3(193 / 255, 84 / 255, 58 / 255) },
      uGold: { value: new THREE.Vector3(217 / 255, 164 / 255, 65 / 255) },
      uSteel: { value: new THREE.Vector3(93 / 255, 111 / 255, 116 / 255) },
      uMouse: { value: [0, 0] as [number, number] },
    };
    // Smoothed pointer target in shader space (set on pointermove, lerped in loop).
    const mouseTarget: [number, number] = [0, 0];

    const vertexShader = `
      attribute vec3 position;
      void main() { gl_Position = vec4(position, 1.0); }
    `;
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform vec3 uClay;
      uniform vec3 uGold;
      uniform vec3 uSteel;
      uniform vec2 uMouse;
      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        // filaments drift gently toward the cursor
        vec2 q = p - uMouse * 0.18;
        float d = length(q) * distortion;
        float rx = q.x * (1.0 + d);
        float gx = q.x;
        float bx = q.x * (1.0 - d);
        float r = 0.05 / abs(q.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(q.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(q.y + sin((bx + time) * xScale) * yScale);
        vec3 col = r * uClay + g * uGold + b * uSteel;
        // soft gold glow that follows the cursor
        float mg = 0.045 / (length(p - uMouse) + 0.16);
        col += mg * uGold * 0.6;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const sizeToParent = () => {
      if (!renderer) return;
      const w = parent?.clientWidth || canvas.clientWidth || 1;
      const h = parent?.clientHeight || canvas.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      uniforms.resolution.value = [canvas.width, canvas.height];
    };

    const renderOnce = () => {
      if (renderer && scene && camera) renderer.render(scene, camera);
    };
    const loop = () => {
      if (!running) return;
      uniforms.time.value += 0.01;
      // ease the mouse uniform toward its target for buttery reactivity
      const m = uniforms.uMouse.value;
      m[0] += (mouseTarget[0] - m[0]) * 0.08;
      m[1] += (mouseTarget[1] - m[1]) * 0.08;
      renderOnce();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const host = parent || canvas;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const minSide = Math.min(rect.width, rect.height);
      // map pointer into the shader's p-space (matches the resolution norm)
      mouseTarget[0] = ((e.clientX - rect.left) * 2 - rect.width) / minSide;
      mouseTarget[1] = -(((e.clientY - rect.top) * 2 - rect.height) / minSide);
    };
    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(new THREE.Color(0x0b0b0d));
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      const position = [
        -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0,
      ];
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(position), 3),
      );
      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        glslVersion: THREE.GLSL1, // ensure it compiles under WebGL2
        side: THREE.DoubleSide,
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      sizeToParent();
      renderOnce();

      if (!prefersReduced) {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) start();
              else stop();
            }
          },
          { threshold: 0 },
        );
        io.observe(parent || canvas);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }
      ro = new ResizeObserver(() => {
        sizeToParent();
        if (prefersReduced) renderOnce();
      });
      ro.observe(parent || canvas);
    } catch (err) {
      console.error("WebGLShader: init failed —", err);
    }

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      io?.disconnect();
      ro?.disconnect();
      if (mesh) {
        scene?.remove(mesh);
        mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) mesh.material.dispose();
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full pointer-events-none"
    />
  );
}

export default WebGLShader;
