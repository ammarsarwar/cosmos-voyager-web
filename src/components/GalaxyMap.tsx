
import { useEffect, useRef, useState } from 'react';
import { Galaxy, StarSystem } from '@/utils/galaxyModels';
import { Planet } from '@/utils/planetGenerator';
import { Button } from '@/components/ui/button';
import { Compass, ChevronDown, ChevronUp, Globe, Star } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface GalaxyMapProps {
  galaxies: Galaxy[];
  currentGalaxy: Galaxy;
  currentSystem: StarSystem | null;
  currentPlanet: Planet | null;
  onSelectPlanet: (planetId: string, systemId: string, galaxyId: string) => void;
  onSelectSystem: (systemId: string, galaxyId: string) => void;
  onSelectGalaxy: (galaxyId: string) => void;
  onInitiateWarp: (galaxyId: string) => void;
}

const GalaxyMap = ({ 
  galaxies,
  currentGalaxy,
  currentSystem,
  currentPlanet,
  onSelectPlanet,
  onSelectSystem,
  onSelectGalaxy,
  onInitiateWarp
}: GalaxyMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);
  
  // Get star system color based on type
  const getSystemColor = (type: string): string => {
    switch(type) {
      case 'Yellow': return '#fbbf24';
      case 'Red': return '#ef4444';
      case 'Green': return '#4ade80';
      case 'Blue': return '#3b82f6';
      case 'Anomaly': return '#c084fc';
      default: return '#ffffff';
    }
  };
  
  // Draw the galaxy map
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
      
      // Draw space background
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
      
      // Draw systems for the current galaxy
      currentGalaxy.systems.forEach((system) => {
        const margin = 60;
        // Use the system's position scaled to canvas size
        const x = (system.position.x / 100) * ((canvas.width / 2) - margin * 2) + margin;
        const y = (system.position.y / 100) * ((canvas.height / 2) - margin * 2) + margin;
        
        const isCurrentSystem = currentSystem && system.id === currentSystem.id;
        const isHovered = hoveredSystem && system.id === hoveredSystem.id;
        
        // Draw system connection lines
        if (system.discovered) {
          const nearestSystems = currentGalaxy.systems
            .filter(s => s.discovered && s.id !== system.id)
            .sort((a, b) => {
              const distA = Math.hypot(system.position.x - a.position.x, system.position.y - a.position.y);
              const distB = Math.hypot(system.position.x - b.position.x, system.position.y - b.position.y);
              return distA - distB;
            })
            .slice(0, 2); // Connect to closest 2 systems
            
          nearestSystems.forEach(nearSystem => {
            const nearX = (nearSystem.position.x / 100) * ((canvas.width / 2) - margin * 2) + margin;
            const nearY = (nearSystem.position.y / 100) * ((canvas.width / 2) - margin * 2) + margin;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nearX, nearY);
            ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        }
        
        // Draw system glow
        ctx.beginPath();
        ctx.arc(x, y, isCurrentSystem || isHovered ? 12 : 8, 0, Math.PI * 2);
        const systemColor = getSystemColor(system.type);
        const glowColor = system.discovered ? `${systemColor}80` : '#a3a3a380';
        
        // Add shadow glow for selected system
        if (isCurrentSystem) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = systemColor;
        }
        
        ctx.fillStyle = glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw system
        ctx.beginPath();
        ctx.arc(x, y, isCurrentSystem ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = system.discovered ? systemColor : '#a3a3a3';
        ctx.fill();
        
        // Draw system info for current or hovered system
        if (isCurrentSystem || isHovered) {
          // System name
          ctx.font = isCurrentSystem ? 'bold 12px Arial' : '11px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          
          // Add text background
          const nameText = system.name + (system.discovered ? '' : ' [?]');
          const textWidth = ctx.measureText(nameText).width;
          ctx.fillStyle = 'rgba(10, 25, 47, 0.8)';
          ctx.fillRect(x - textWidth/2 - 4, y + 16, textWidth + 8, system.discovered ? 36 : 20);
          
          // Draw name and info
          ctx.fillStyle = system.discovered ? '#ffffff' : '#a3a3a3';
          ctx.fillText(nameText, x, y + 20);
          
          if (system.discovered) {
            ctx.font = '10px Arial';
            ctx.fillStyle = systemColor;
            ctx.fillText(`${system.type} System • ${system.planets.length} ${system.planets.length === 1 ? 'Planet' : 'Planets'}`, x, y + 36);
          }
        }
      });
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Handle click on system
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * 2;
      const y = (event.clientY - rect.top) * 2;
      
      const margin = 60;
      // Check if click is on a system
      currentGalaxy.systems.forEach(system => {
        const systemX = (system.position.x / 100) * ((canvas.width / 2) - margin * 2) + margin;
        const systemY = (system.position.y / 100) * ((canvas.width / 2) - margin * 2) + margin;
        
        const distance = Math.sqrt(Math.pow(x - systemX * 2, 2) + Math.pow(y - systemY * 2, 2));
        
        if (distance < 30) { // Detection radius
          if (system.discovered) {
            onSelectSystem(system.id, currentGalaxy.id);
            toast.success(`Navigating to ${system.name}`);
          } else {
            toast.info("Unknown system - requires discovery");
          }
        }
      });
    };
    
    // Add hover effect
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * 2;
      const y = (event.clientY - rect.top) * 2;
      
      let foundHoveredSystem = null;
      let isOverSystem = false;
      
      const margin = 60;
      currentGalaxy.systems.forEach(system => {
        const systemX = (system.position.x / 100) * ((canvas.width / 2) - margin * 2) + margin;
        const systemY = (system.position.y / 100) * ((canvas.width / 2) - margin * 2) + margin;
        
        const distance = Math.sqrt(Math.pow(x - systemX * 2, 2) + Math.pow(y - systemY * 2, 2));
        
        if (distance < 30) {
          isOverSystem = true;
          foundHoveredSystem = system;
        }
      });
      
      canvas.style.cursor = isOverSystem ? 'pointer' : 'default';
      setHoveredSystem(foundHoveredSystem);
      
      // Redraw if hover state changed
      if ((hoveredSystem && !foundHoveredSystem) || 
          (!hoveredSystem && foundHoveredSystem) || 
          (hoveredSystem && foundHoveredSystem && hoveredSystem.id !== foundHoveredSystem.id)) {
        drawGalaxyMap();
      }
    };
    
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentGalaxy, currentSystem, hoveredSystem, onSelectSystem]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="nms-text text-lg text-cosmic-teal flex items-center gap-2">
          <Compass className="h-5 w-5" />
          Galaxy Navigation
        </h2>
        
        <div className="flex gap-2">
          {galaxies.map(galaxy => (
            <Button 
              key={galaxy.id}
              onClick={() => galaxy.unlocked ? onSelectGalaxy(galaxy.id) : onInitiateWarp(galaxy.id)}
              className={`text-xs px-3 py-1 h-auto ${currentGalaxy.id === galaxy.id ? 
                'nms-button bg-cosmic-teal/30' : 
                galaxy.unlocked ? 'nms-button' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'}`}
              disabled={!galaxy.unlocked && currentGalaxy.id !== galaxy.id}
            >
              {galaxy.name}
              {!galaxy.unlocked && <span className="ml-1 text-xs">🔒</span>}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-3 h-full relative">
          <div className="h-full relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-cosmic-teal px-2 py-1 rounded">
              {currentGalaxy.systems.filter(s => s.discovered).length} systems discovered
            </div>
          </div>
        </div>
        
        <div className="hud-element p-4">
          <h3 className="text-sm font-bold text-cosmic-teal mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            {currentSystem ? 'System Data' : 'Select a System'}
          </h3>
          
          {currentSystem ? (
            <>
              <div className="p-2 bg-cosmic-teal/10 rounded mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{currentSystem.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded" 
                    style={{ 
                      backgroundColor: `${getSystemColor(currentSystem.type)}30`,
                      color: getSystemColor(currentSystem.type)
                    }}>
                    {currentSystem.type}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {currentSystem.planets.length} {currentSystem.planets.length === 1 ? 'planet' : 'planets'}
                </div>
              </div>
              
              <h4 className="text-xs uppercase text-cosmic-teal/60 mb-1 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Planets
              </h4>
              
              <div className="space-y-1">
                {currentSystem.planets.map(planet => (
                  <Collapsible key={planet.id}>
                    <div className={`flex justify-between items-center p-2 rounded text-sm
                      ${currentPlanet && planet.id === currentPlanet.id ? 
                        'bg-cosmic-teal/20 text-white' : 'hover:bg-black/20'}`}>
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => onSelectPlanet(planet.id, currentSystem.id, currentGalaxy.id)}
                      >
                        {planet.name}
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ChevronDown className="h-4 w-4 text-cosmic-teal" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="pl-4 pr-2 pb-2">
                      <div className="text-xs space-y-1 text-gray-400">
                        <div className="flex justify-between">
                          <span>Type</span>
                          <span className="text-cosmic-teal">{planet.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size</span>
                          <span>{planet.size}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature</span>
                          <span>{planet.temperature}</span>
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-2">
                          <span>Resources</span>
                          <div className="flex gap-1">
                            {planet.resources.map((resource, idx) => (
                              <span key={idx} title={`${resource.name} (${resource.rarity})`}>
                                {resource.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-cosmic-teal/50 text-sm">
              Select a system on the map
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalaxyMap;
