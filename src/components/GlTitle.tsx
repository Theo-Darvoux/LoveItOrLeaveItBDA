import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/title.vert?raw';
import fragmentShader from '../shaders/title.frag?raw';

export function GlTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const titleLove = 'LOVE IT';
  const titleOr = 'OR';
  const titleLeave = 'LEAVE IT';

  useEffect(() => {
    let frameId: number;
    let renderer: THREE.WebGLRenderer;
    let texture: THREE.CanvasTexture;
    let textCanvas: HTMLCanvasElement;
    
    const timeoutId = setTimeout(() => {
      if (!canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        precision: 'mediump',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const scale = 2;
      textCanvas = document.createElement('canvas');
      const ctx = textCanvas.getContext('2d')!;
      textCanvas.width = 1024 * scale;
      textCanvas.height = 480 * scale;

      const drawText = () => {
        const w = textCanvas.width;
        const h = textCanvas.height;
        ctx.clearRect(0, 0, w, h);

        const mainFont = "'Cinzel', serif";
        const orFont = "'Playfair Display', serif";

        const mainSize = 148 * scale;
        const orSize = 64 * scale;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const yLove = h * 0.30;  
        const yLeave = h * 0.60; 
        const yOr = h * 0.42; 

        const drawWithGlow = (
          text: string,
          x: number,
          y: number,
          font: string,
          size: number,
          weight: string,
          depth: number = 12 * scale,
          isOr: boolean = false
        ) => {
          ctx.save();
          ctx.font = `${weight} ${size}px ${font}`;

          const steps = Math.ceil(depth);
          for (let i = steps; i >= 1; i--) {
            const t = i / steps;
            const intensity = Math.floor(60 + (1 - t) * 80);
            ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(text, x + i * 0.7, y + i * 0.7);
          }

          ctx.shadowColor = isOr ? 'rgba(0, 0, 0, 1.0)' : 'rgba(255, 255, 255, 0.5)';
          ctx.shadowBlur = (isOr ? 12 : 6) * scale;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, x, y);

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, x, y);

          if (isOr) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = .5 * scale;
            ctx.strokeText(text, x, y);
          }

          ctx.restore();
        };

        drawWithGlow(titleLove, w * 0.5, yLove, mainFont, mainSize, '900', 12 * scale);
        drawWithGlow(titleLeave, w * 0.5, yLeave, mainFont, mainSize, '900', 12 * scale);
        drawWithGlow(titleOr, w * 0.5, yOr, orFont, orSize, 'italic 700', 4 * scale, true);
      };

      texture = new THREE.CanvasTexture(textCanvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const drawAndRefresh = () => {
        drawText();
        texture.needsUpdate = true;
      };

      if (document.fonts) {
        document.fonts.ready.then(drawAndRefresh);
      }
      drawText();

      const material = new THREE.ShaderMaterial({
        uniforms: {
          tText: { value: texture },
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const textAspect = 1024 / 600;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(textAspect, 1), material);
      scene.add(mesh);

      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const { clientWidth, clientHeight } = containerRef.current;
        renderer.setSize(clientWidth, clientHeight);
        
        const aspect = clientWidth / clientHeight;
        
        if (aspect > textAspect) {
          camera.left = -aspect / 2;
          camera.right = aspect / 2;
          camera.top = 0.5;
          camera.bottom = -0.5;
        } else {
          camera.left = -textAspect / 2;
          camera.right = textAspect / 2;
          camera.top = (textAspect / aspect) / 2;
          camera.bottom = -(textAspect / aspect) / 2;
        }
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const animate = (time: number) => {
        material.uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', () => {});
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer) renderer.dispose();
      if (texture) texture.dispose();
      if (textCanvas) textCanvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="gl-title-container"
      style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
