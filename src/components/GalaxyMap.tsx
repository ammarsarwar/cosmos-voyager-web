
import { useEffect, useRef } from 'react';
import { Planet } from '../utils/planetGenerator';

interface GalaxyMapProps {
  planets: Planet[];
  currentPlanetId: string;
  onSelectPlanet: (planetId: string) => void;
}

const GalaxyMap = ({ planets, currentPlanetId, onSelectPlanet }: GalaxyMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate x, y position for each planet (pseudo-random but consistent)
  const getPlanetPosition = (planet: Planet, canvasWidth: number, canvasHeight: number) => {
    // Use planet id to generate a consistent position
    const idSum = planet.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const margin = 80; // Keep planets away from the edges
    const x = (idSum % 100 / 100) * (canvasWidth - margin * 2) + margin;
    const y = ((idSum * 13) % 100 / 100) * (canvasHeight - margin * 2) + margin;
    
    return { x, y };
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const containerRect = canvas.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      // For higher resolution
      canvas.width = containerRect.width * 2;
      canvas.height = containerRect.height * 2;
      ctx.scale(2, 2);
      
      drawGalaxyMap();
    };
    
    // Draw the galaxy map
    const drawGalaxyMap = () => {
      if (!canvas) return;
      
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw space background with stars
      ctx.fillStyle = '#040B1A';
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Add some stars
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * (canvas.width / 2);
        const y = Math.random() * (canvas.height / 2);
        const size = Math.random() * 1.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.fill();
      }
      
      // Draw nebula-like elements
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * (canvas.width / 2);
        const y = Math.random() * (canvas.height / 2);
        const radius = Math.random() * 70 + 30;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const hue = Math.random() * 60 + 240; // Blue to purple
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.1)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Draw connecting paths between planets
      ctx.beginPath();
      
      let firstPlanet = true;
      planets.forEach((planet) => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        
        if (firstPlanet) {
          ctx.moveTo(pos.x, pos.y);
          firstPlanet = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      });
      
      // Draw path with glow effect
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)'; // Cosmic teal with transparency
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#2DD4BF';
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw planets
      planets.forEach((planet) => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        const isCurrentPlanet = planet.id === currentPlanetId;
        
        // Planet glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isCurrentPlanet ? 15 : 10, 0, Math.PI * 2);
        const glowColor = isCurrentPlanet ? '#ffffff80' : `${planet.mainColor}40`;
        
        // Add shadow glow for selected planet
        if (isCurrentPlanet) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#2DD4BF';
        }
        
        ctx.fillStyle = glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Planet
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isCurrentPlanet ? 9 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isCurrentPlanet ? '#ffffff' : planet.mainColor;
        ctx.fill();
        
        // Planet outline for current planet
        if (isCurrentPlanet) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = '#2DD4BF';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Add selection indicator
          ctx.beginPath();
          const indicatorSize = 20;
          ctx.moveTo(pos.x, pos.y - indicatorSize);
          ctx.lineTo(pos.x + indicatorSize * 0.5, pos.y - indicatorSize * 0.5);
          ctx.lineTo(pos.x, pos.y - indicatorSize * 0.7);
          ctx.lineTo(pos.x - indicatorSize * 0.5, pos.y - indicatorSize * 0.5);
          ctx.closePath();
          ctx.fillStyle = '#2DD4BF';
          ctx.fill();
        }
        
        // Planet name with improved visibility
        ctx.font = isCurrentPlanet ? 'bold 14px Arial' : '12px Arial';
        ctx.fillStyle = isCurrentPlanet ? '#ffffff' : '#d4d4d4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Add text background for better readability
        const textWidth = ctx.measureText(planet.name).width;
        if (isCurrentPlanet) {
          ctx.fillStyle = 'rgba(10, 25, 47, 0.7)';
          ctx.fillRect(pos.x - textWidth/2 - 4, pos.y + 16, textWidth + 8, 20);
        }
        
        ctx.fillStyle = isCurrentPlanet ? '#ffffff' : '#d4d4d4';
        ctx.fillText(planet.name, pos.x, pos.y + 20);
        
        // Add planet type for current planet
        if (isCurrentPlanet) {
          ctx.font = '11px Arial';
          ctx.fillStyle = '#2DD4BF';
          ctx.fillText(planet.type, pos.x, pos.y + 36);
        }
      });
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Handle click on planet
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * 2;
      const y = (event.clientY - rect.top) * 2;
      
      // Check if click is on a planet
      planets.forEach(planet => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        const distance = Math.sqrt(Math.pow(x - pos.x * 2, 2) + Math.pow(y - pos.y * 2, 2));
        
        if (distance < 30) { // Increased detection radius
          onSelectPlanet(planet.id);
        }
      });
    };
    
    canvas.addEventListener('click', handleClick);
    
    // Add hover effect to change cursor
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * 2;
      const y = (event.clientY - rect.top) * 2;
      
      let isOverPlanet = false;
      
      planets.forEach(planet => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        const distance = Math.sqrt(Math.pow(x - pos.x * 2, 2) + Math.pow(y - pos.y * 2, 2));
        
        if (distance < 30) {
          isOverPlanet = true;
        }
      });
      
      canvas.style.cursor = isOverPlanet ? 'pointer' : 'default';
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [planets, currentPlanetId, onSelectPlanet]);
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-cosmic-teal px-2 py-1 rounded">
        {planets.length} systems discovered
      </div>
    </div>
  );
};

export default GalaxyMap;
