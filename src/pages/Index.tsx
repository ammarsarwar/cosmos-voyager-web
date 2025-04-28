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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'planet' | 'galaxy'>('planet');
  
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
  
  const handleSelectPlanet = (planetId: string) => {
    const selected = planets.find(p => p.id === planetId);
    if (selected) {
      setCurrentPlanet(selected);
      setActiveTab('planet');
      toast.success(`Navigating to ${selected.name}`);
    }
  };
  
  const handleGenerateNewPlanet = () => {
    const newPlanet = generateStarterPlanet();
    setPlanets([...planets, newPlanet]);
    setCurrentPlanet(newPlanet);
    setActiveTab('planet');
    toast.info("New planet discovered!");
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <StarField starCount={150} />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="text-center pt-4 pb-6">
            <h1 className="nms-title mb-4">COSMOS VOYAGER</h1>
            <p className="text-cosmic-teal/80 nms-text">
              ATLAS INTERFACE v1.0 // SYSTEM SCAN ACTIVE
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[500px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-cosmic-teal/30 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-t-4 border-cosmic-teal rounded-full animate-spin-slow"></div>
                </div>
                <p className="nms-text text-cosmic-teal animate-pulse">INITIALIZING ATLAS INTERFACE...</p>
              </div>
            </div>
          ) : (
            <>
              <Tabs defaultValue="planet" className="w-full">
                <TabsList className="w-full hud-element justify-center bg-transparent p-1 gap-1">
                  <TabsTrigger 
                    value="planet"
                    className="nms-text data-[state=active]:bg-cosmic-teal/20 data-[state=active]:text-cosmic-teal"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Planet Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="galaxy"
                    className="nms-text data-[state=active]:bg-cosmic-teal/20 data-[state=active]:text-cosmic-teal"
                  >
                    <Compass className="mr-2 h-4 w-4" />
                    Galaxy Map
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="planet" className="mt-6">
                  {currentPlanet && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="planet-card">
                        <div className="absolute top-4 left-4 z-10">
                          <h2 className="nms-text text-lg text-cosmic-teal flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {currentPlanet.name}
                          </h2>
                        </div>
                        <div className="h-[400px] md:h-[500px] relative">
                          <PlanetViewer planet={currentPlanet} />
                          <div className="bg-scan-lines absolute inset-0 pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <PlanetInfo planet={currentPlanet} />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="galaxy" className="mt-6">
                  <div className="planet-card">
                    <h2 className="nms-text text-lg text-cosmic-teal mb-4 flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      Navigation System
                    </h2>
                    <div className="h-[600px] relative">
                      <GalaxyMap 
                        planets={planets}
                        currentPlanetId={currentPlanet?.id || ''}
                        onSelectPlanet={handleSelectPlanet}
                      />
                      <div className="bg-scan-lines absolute inset-0 pointer-events-none"></div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleGenerateNewPlanet}
                  className="nms-button"
                >
                  Initiate Planet Discovery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center nms-text text-sm text-cosmic-teal/60">
        <p>ATLAS TERMINAL v1.0 // CONNECTION STABLE</p>
      </footer>
    </div>
  );
};

export default Index;
