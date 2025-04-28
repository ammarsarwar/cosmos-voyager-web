
import { useEffect, useRef, useState } from 'react';
import { Planet } from '@/utils/planetGenerator';
import { 
  getPlanetGradient,
  drawPlanetFeatures,
  drawAtmosphere,
  drawRings
} from '@/utils/planetRendering';

export const usePlanetAnimation = (planet: Planet) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const drawPlanet = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Draw space background with stars
      ctx.fillStyle = 'rgba(4, 11, 26, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.fill();
      }
      
      // Draw rings (behind planet)
      drawRings({ ctx, centerX, centerY, radius, planet });
      
      // Draw atmosphere
      drawAtmosphere({ ctx, centerX, centerY, radius, planet });
      
      // Draw planet base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = getPlanetGradient(ctx, 0, canvas.height, planet);
      ctx.fill();
      
      // Draw planet features
      drawPlanetFeatures({ ctx, centerX, centerY, radius, planet, rotationOffset: rotation });
      
      // Draw shadow/highlight for 3D effect
      const shadowGradient = ctx.createRadialGradient(
        centerX - radius * 0.5, centerY - radius * 0.5, 0,
        centerX, centerY, radius * 1.2
      );
      
      shadowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      shadowGradient.addColorStop(0.5, 'transparent');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = shadowGradient;
      ctx.fill();
      
      // Add atmospheric edge highlight
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `${planet.mainColor}70`;
      ctx.stroke();
      
      setRotation(prev => prev + 0.001);
      animationFrameId = requestAnimationFrame(drawPlanet);
    };
    
    const handleResize = () => {
      const containerRect = canvas.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      drawPlanet();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [planet, rotation]);

  return { canvasRef };
};
