
import { Planet } from '@/utils/planetGenerator';
import { usePlanetAnimation } from '@/hooks/usePlanetAnimation';

interface PlanetViewerProps {
  planet: Planet;
}

const PlanetViewer = ({ planet }: PlanetViewerProps) => {
  const { canvasRef } = usePlanetAnimation(planet);
  
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
