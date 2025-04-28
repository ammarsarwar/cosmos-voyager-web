
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StarField from '@/components/StarField';
import PlanetViewer from '@/components/PlanetViewer';
import PlanetInfo from '@/components/PlanetInfo';
import GalaxyMap from '@/components/GalaxyMap';
import { generatePlanets, generateStarterPlanet, Planet } from '@/utils/planetGenerator';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Compass, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'planet' | 'galaxy'>('planet');
  
  // Generate planets on initial load
  useEffect(() => {
    const generateGalaxy = () => {
      const starter = generateStarterPlanet(); 
      const generatedPlanets = generatePlanets(5);
      setPlanets([starter, ...generatedPlanets]);
      setCurrentPlanet(starter);
      setIsLoading(false);
    };
    
    const timer = setTimeout(generateGalaxy, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle planet selection
  const handleSelectPlanet = (planetId: string) => {
    const selected = planets.find(p => p.id === planetId);
    if (selected) {
      setCurrentPlanet(selected);
      setActiveTab('planet');
      toast.success(`Navigating to ${selected.name}`);
    }
  };
  
  // Generate a new random planet
  const handleGenerateNewPlanet = () => {
    const newPlanet = generateStarterPlanet();
    setPlanets([...planets, newPlanet]);
    setCurrentPlanet(newPlanet);
    setActiveTab('planet');
    toast.info("New planet discovered!");
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background effects */}
      <StarField starCount={150} />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-8">
          {/* Header with title */}
          <div className="text-center pt-4 pb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cosmic-teal via-cosmic-purple to-cosmic-pink glow-text">
              COSMOS VOYAGER
            </h1>
            <p className="text-lg text-cosmic-teal/80 max-w-2xl mx-auto">
              Explore the vastness of procedurally generated worlds in this No Man's Sky inspired universe
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[500px]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cosmic-purple"></div>
                <p className="text-cosmic-teal animate-pulse">Initializing universe...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab navigation */}
              <div className="flex justify-center mb-2">
                <div className="glass rounded-lg p-1 flex space-x-1">
                  <Button 
                    variant={activeTab === 'planet' ? 'default' : 'ghost'}
                    className={activeTab === 'planet' ? 'bg-cosmic-purple text-white' : 'text-muted-foreground'}
                    onClick={() => setActiveTab('planet')}
                    size="sm"
                  >
                    <Globe className="mr-1 h-4 w-4" />
                    Planet View
                  </Button>
                  <Button 
                    variant={activeTab === 'galaxy' ? 'default' : 'ghost'}
                    className={activeTab === 'galaxy' ? 'bg-cosmic-purple text-white' : 'text-muted-foreground'}
                    onClick={() => setActiveTab('galaxy')}
                    size="sm"
                  >
                    <Compass className="mr-1 h-4 w-4" />
                    Galaxy Map
                  </Button>
                </div>
              </div>
              
              {/* Content based on active tab */}
              {activeTab === 'planet' && currentPlanet && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="glass p-6 rounded-lg neon-border h-[400px] md:h-[500px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                      <Globe className="text-cosmic-teal h-5 w-5" />
                      {currentPlanet.name}
                    </h2>
                    <div className="flex-grow relative">
                      <PlanetViewer planet={currentPlanet} />
                    </div>
                  </div>
                  <div className="h-full">
                    <PlanetInfo planet={currentPlanet} />
                  </div>
                </div>
              )}
              
              {activeTab === 'galaxy' && (
                <div className="glass p-6 rounded-lg neon-border">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Rocket className="text-cosmic-teal" size={20} />
                    Galaxy Map
                  </h2>
                  <div className="h-[500px]">
                    <GalaxyMap 
                      planets={planets} 
                      currentPlanetId={currentPlanet?.id || ''} 
                      onSelectPlanet={handleSelectPlanet} 
                    />
                  </div>
                </div>
              )}
              
              {/* Controls */}
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleGenerateNewPlanet}
                  className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white neon-border"
                  size="lg"
                >
                  Discover New Planet
                  <ArrowRight size={16} className="ml-2" />
                </Button>
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
