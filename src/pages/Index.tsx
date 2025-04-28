
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StarField from '@/components/StarField';
import PlanetViewer from '@/components/PlanetViewer';
import PlanetInfo from '@/components/PlanetInfo';
import GalaxyMap from '@/components/GalaxyMap';
import { generatePlanets, generateStarterPlanet, Planet } from '@/utils/planetGenerator';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate planets on initial load
  useEffect(() => {
    const generateGalaxy = () => {
      const starter = generateStarterPlanet(); 
      const generatedPlanets = generatePlanets(5);
      setPlanets([starter, ...generatedPlanets]);
      setCurrentPlanet(starter);
      setIsLoading(false);
    };
    
    // Add small delay for loading effect
    const timer = setTimeout(generateGalaxy, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle planet selection
  const handleSelectPlanet = (planetId: string) => {
    const selected = planets.find(p => p.id === planetId);
    if (selected) {
      setCurrentPlanet(selected);
      toast.success(`Navigating to ${selected.name}`);
    }
  };
  
  // Generate a new random planet
  const handleGenerateNewPlanet = () => {
    const newPlanet = generateStarterPlanet();
    setPlanets([...planets, newPlanet]);
    setCurrentPlanet(newPlanet);
    toast.info("New planet discovered!");
  };
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background effects */}
      <StarField starCount={150} />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="container pt-20 px-4 pb-8 relative z-10">
        <div className="flex flex-col gap-12">
          {/* Header with title */}
          <div className="text-center pt-4 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cosmic-teal via-cosmic-purple to-cosmic-pink glow-text">
              COSMOS VOYAGER
            </h1>
            <p className="text-lg text-cosmic-teal/80 max-w-2xl mx-auto">
              Explore the vastness of procedurally generated worlds in this No Man's Sky inspired universe
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cosmic-purple"></div>
            </div>
          ) : (
            <>
              {/* Planet viewer section */}
              {currentPlanet && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="flex flex-col items-center">
                    <PlanetViewer planet={currentPlanet} />
                  </div>
                  <div>
                    <PlanetInfo planet={currentPlanet} />
                  </div>
                </div>
              )}
              
              {/* Galaxy map section */}
              <div className="glass py-6 px-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Rocket className="text-cosmic-teal" size={20} />
                  Galaxy Map
                </h2>
                <div className="h-64 md:h-80">
                  <GalaxyMap 
                    planets={planets} 
                    currentPlanetId={currentPlanet?.id || ''} 
                    onSelectPlanet={handleSelectPlanet} 
                  />
                </div>
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={handleGenerateNewPlanet}
                    className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white"
                  >
                    Discover New Planet
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        <p>Cosmos Voyager — Inspired by No Man's Sky</p>
      </footer>
    </div>
  );
};

export default Index;
