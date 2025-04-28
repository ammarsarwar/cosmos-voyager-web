
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
      canvas.width = canvas.clientWidth * 2; // For higher resolution
      canvas.height = canvas.clientHeight * 2;
      ctx.scale(2, 2);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Draw the galaxy map
    const drawGalaxyMap = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw connecting lines
      ctx.beginPath();
      
      let firstPlanet = true;
      planets.forEach((planet, index) => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        
        if (firstPlanet) {
          ctx.moveTo(pos.x, pos.y);
          firstPlanet = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      });
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw planets
      planets.forEach((planet, index) => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        
        // Planet glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, planet.id === currentPlanetId ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = `${planet.mainColor}40`;
        ctx.fill();
        
        // Planet
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, planet.id === currentPlanetId ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = planet.id === currentPlanetId ? '#ffffff' : planet.mainColor;
        ctx.fill();
        
        // Planet outline for current planet
        if (planet.id === currentPlanetId) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Planet name
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, pos.x, pos.y + 20);
      });
    };
    
    drawGalaxyMap();
    
    // Handle click on planet
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * 2;
      const y = (event.clientY - rect.top) * 2;
      
      // Check if click is on a planet
      planets.forEach(planet => {
        const pos = getPlanetPosition(planet, canvas.width / 2, canvas.height / 2);
        const distance = Math.sqrt(Math.pow(x - pos.x * 2, 2) + Math.pow(y - pos.y * 2, 2));
        
        if (distance < 20) { // Detection radius
          onSelectPlanet(planet.id);
        }
      });
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
    };
  }, [planets, currentPlanetId, onSelectPlanet]);
  
  return (
    <div className="relative w-full h-64 md:h-full rounded-lg overflow-hidden glass">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
      />
    </div>
  );
};

export default GalaxyMap;
