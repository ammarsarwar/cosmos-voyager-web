
import { useEffect, useRef, useState } from 'react';
import { Planet } from '../utils/planetGenerator';

interface PlanetViewerProps {
  planet: Planet;
}

const PlanetViewer = ({ planet }: PlanetViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Function to create a gradient style based on planet type
  const getPlanetGradient = (ctx: CanvasRenderingContext2D, width: number, height: number, planet: Planet) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, planet.mainColor);
    gradient.addColorStop(1, planet.secondaryColor);
    return gradient;
  };
  
  // Draw planet features based on type
  const drawPlanetFeatures = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    planet: Planet,
    rotationOffset: number
  ) => {
    const featureCount = Math.floor(Math.random() * 5) + 3;
    
    // Apply rotation to context for feature positioning
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationOffset);
    ctx.translate(-centerX, -centerY);
    
    // Draw features based on planet type
    switch (planet.type) {
      case 'Lush':
        // Draw continents
        for (let i = 0; i < featureCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.7;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          const featureSize = Math.random() * radius * 0.5 + radius * 0.2;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
          ctx.fillStyle = '#4ade80';
          ctx.globalAlpha = 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        break;
        
      case 'Desert':
        // Draw craters or dunes
        for (let i = 0; i < featureCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.7;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          const featureSize = Math.random() * radius * 0.2 + radius * 0.1;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        break;
        
      case 'Frozen':
        // Draw ice caps
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius * 0.7, radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Draw ice formations
        for (let i = 0; i < featureCount; i++) {
          const angle = Math.random() * Math.PI + Math.PI / 2; // Top half
          const distance = Math.random() * radius * 0.5;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, radius * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        break;
        
      case 'Toxic':
        // Draw toxic clouds
        for (let i = 0; i < featureCount + 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.8;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          const featureSize = Math.random() * radius * 0.3 + radius * 0.1;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
          ctx.fillStyle = '#84cc16';
          ctx.globalAlpha = 0.4;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        break;
        
      case 'Volcanic':
        // Draw lava streams
        for (let i = 0; i < featureCount; i++) {
          const startAngle = Math.random() * Math.PI * 2;
          const endAngle = startAngle + (Math.random() * Math.PI / 4) - Math.PI / 8;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * (0.7 + Math.random() * 0.3), startAngle, endAngle);
          ctx.lineWidth = radius * (0.05 + Math.random() * 0.05);
          ctx.strokeStyle = '#ef4444';
          ctx.stroke();
        }
        break;
        
      case 'Ocean':
        // Draw small islands
        for (let i = 0; i < featureCount - 1; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.7;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          const featureSize = Math.random() * radius * 0.15 + radius * 0.05;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
          ctx.fillStyle = '#a3a3a3';
          ctx.fill();
        }
        break;
        
      case 'Exotic':
        // Draw strange patterns
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const startRadius = radius * 0.2;
          const endRadius = radius * 0.9;
          
          const startX = centerX + Math.cos(angle) * startRadius;
          const startY = centerY + Math.sin(angle) * startRadius;
          const endX = centerX + Math.cos(angle) * endRadius;
          const endY = centerY + Math.sin(angle) * endRadius;
          
          const controlX1 = centerX + Math.cos(angle + 0.5) * radius * 0.5;
          const controlY1 = centerY + Math.sin(angle + 0.5) * radius * 0.5;
          const controlX2 = centerX + Math.cos(angle - 0.5) * radius * 0.6;
          const controlY2 = centerY + Math.sin(angle - 0.5) * radius * 0.6;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
          ctx.lineWidth = radius * 0.05;
          ctx.strokeStyle = '#a855f7';
          ctx.stroke();
        }
        break;
        
      default:
        // Draw generic craters for barren or irradiated planets
        for (let i = 0; i < featureCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius * 0.7;
          const featureX = centerX + Math.cos(angle) * distance;
          const featureY = centerY + Math.sin(angle) * distance;
          const featureSize = Math.random() * radius * 0.2 + radius * 0.05;
          
          ctx.beginPath();
          ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
          ctx.strokeStyle = '#a3a3a3';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
    }
    
    ctx.restore();
  };
  
  // Draw atmosphere glow
  const drawAtmosphere = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, planet: Planet) => {
    // Skip atmosphere for barren planets
    if (planet.type === 'Barren') return;
    
    const atmosphereGradient = ctx.createRadialGradient(
      centerX, centerY, radius,
      centerX, centerY, radius * 1.15
    );
    
    atmosphereGradient.addColorStop(0, `${planet.mainColor}55`);
    atmosphereGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = atmosphereGradient;
    ctx.fill();
  };
  
  // Draw rings for some planets
  const drawRings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, planet: Planet) => {
    // Only some planets have rings (exotic and randomly some others)
    if (planet.type === 'Exotic' || planet.id.charCodeAt(0) % 3 === 0) {
      ctx.beginPath();
      ctx.ellipse(
        centerX, centerY,
        radius * 1.8, radius * 0.4,
        Math.PI / 6,
        0, Math.PI * 2
      );
      const ringColor = planet.type === 'Exotic' ? '#c084fc' : '#a8a29e';
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animation frame ID for cleanup
    let animationFrameId: number;
    
    // For consistent planet features
    const seed = planet.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const drawPlanet = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Use 70% of the smaller dimension for planet radius
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Draw space background with stars
      ctx.fillStyle = 'rgba(4, 11, 26, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some stars in the background
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.fill();
      }
      
      // Draw rings for some planets (behind the planet)
      if (planet.type === 'Exotic' || planet.id.charCodeAt(0) % 3 === 0) {
        drawRings(ctx, centerX, centerY, radius, planet);
      }
      
      // Draw atmosphere glow
      drawAtmosphere(ctx, centerX, centerY, radius, planet);
      
      // Draw planet base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = getPlanetGradient(ctx, 0, canvas.height, planet);
      ctx.fill();
      
      // Draw planet features with current rotation
      drawPlanetFeatures(ctx, centerX, centerY, radius, planet, rotation);
      
      // Draw planet shadow/highlight for 3D effect
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
      
      // Add slight highlight on edge for atmospheric effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `${planet.mainColor}70`;
      ctx.stroke();
      
      // Update rotation for animation
      setRotation((prev) => prev + 0.001);
      
      // Continue animation
      animationFrameId = requestAnimationFrame(drawPlanet);
    };
    
    // Resize handler
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
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-lg"
      />
      
      {/* No Man's Sky style scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-scan-lines" />
      
      {/* Planet name overlay in NMS style */}
      <div className="absolute bottom-4 left-4 text-sm font-mono">
        <span className="text-cosmic-teal">[{planet.type}]</span>
      </div>
    </div>
  );
};

export default PlanetViewer;
