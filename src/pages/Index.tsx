
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StarField from '@/components/StarField';
import PlanetViewer from '@/components/PlanetViewer';
import PlanetInfo from '@/components/PlanetInfo';
import GalaxyMap from '@/components/GalaxyMap';
import WarpDriveMinigame from '@/components/WarpDriveMinigame';
import { generatePlanets, generateStarterPlanet, Planet } from '@/utils/planetGenerator';
import { Galaxy, StarSystem, generateInitialGalaxies } from '@/utils/galaxyModels';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Compass, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Index = () => {
  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [currentGalaxy, setCurrentGalaxy] = useState<Galaxy | null>(null);
  const [currentSystem, setCurrentSystem] = useState<StarSystem | null>(null);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'planet' | 'galaxy'>('planet');
  const [isWarpDriveActive, setIsWarpDriveActive] = useState(false);
  const [targetGalaxyId, setTargetGalaxyId] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeGalaxy = () => {
      // Generate all galaxies, systems, and planets
      const generatedGalaxies = generateInitialGalaxies();
      setGalaxies(generatedGalaxies);
      
      // Set Euclid as the current galaxy (first one)
      const startGalaxy = generatedGalaxies[0];
      setCurrentGalaxy(startGalaxy);
      
      // Set the first discovered system as current
      const startSystem = startGalaxy.systems.find(s => s.discovered) || startGalaxy.systems[0];
      setCurrentSystem(startSystem);
      
      // Set the first planet as current
      setCurrentPlanet(startSystem.planets[0]);
      
      setIsLoading(false);
    };
    
    const timer = setTimeout(initializeGalaxy, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectPlanet = (planetId: string, systemId: string, galaxyId: string) => {
    // First ensure we're in the right galaxy and system
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (!galaxy) return;
    
    const system = galaxy.systems.find(s => s.id === systemId);
    if (!system) return;
    
    const planet = system.planets.find(p => p.id === planetId);
    if (!planet) return;
    
    setCurrentGalaxy(galaxy);
    setCurrentSystem(system);
    setCurrentPlanet(planet);
    setActiveTab('planet');
    toast.success(`Navigating to ${planet.name}`);
  };
  
  const handleSelectSystem = (systemId: string, galaxyId: string) => {
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (!galaxy) return;
    
    const system = galaxy.systems.find(s => s.id === systemId);
    if (!system) return;
    
    setCurrentGalaxy(galaxy);
    setCurrentSystem(system);
    
    // Set the first planet of the system as current
    if (system.planets.length > 0) {
      setCurrentPlanet(system.planets[0]);
    }
  };
  
  const handleSelectGalaxy = (galaxyId: string) => {
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (!galaxy) return;
    
    setCurrentGalaxy(galaxy);
    
    // Select the first discovered system in this galaxy
    const firstDiscoveredSystem = galaxy.systems.find(s => s.discovered);
    if (firstDiscoveredSystem) {
      setCurrentSystem(firstDiscoveredSystem);
      if (firstDiscoveredSystem.planets.length > 0) {
        setCurrentPlanet(firstDiscoveredSystem.planets[0]);
      }
    } else {
      setCurrentSystem(galaxy.systems[0]);
      setCurrentPlanet(galaxy.systems[0].planets[0]);
    }
    
    toast.success(`Navigated to ${galaxy.name} Galaxy`);
  };
  
  const handleGenerateNewPlanet = () => {
    if (!currentGalaxy || !currentSystem) return;
    
    const newPlanet = generateStarterPlanet();
    
    // Add the new planet to the current system
    const updatedSystem = {
      ...currentSystem,
      planets: [...currentSystem.planets, newPlanet]
    };
    
    // Update the system in the galaxy
    const updatedSystems = currentGalaxy.systems.map(s => 
      s.id === currentSystem.id ? updatedSystem : s
    );
    
    // Update the galaxy
    const updatedGalaxy = {
      ...currentGalaxy,
      systems: updatedSystems
    };
    
    // Update all galaxies
    const updatedGalaxies = galaxies.map(g =>
      g.id === currentGalaxy.id ? updatedGalaxy : g
    );
    
    // Update state
    setGalaxies(updatedGalaxies);
    setCurrentGalaxy(updatedGalaxy);
    setCurrentSystem(updatedSystem);
    setCurrentPlanet(newPlanet);
    setActiveTab('planet');
    
    toast.info("New planet discovered!");
  };
  
  const handleInitiateWarp = (galaxyId: string) => {
    setTargetGalaxyId(galaxyId);
    setIsWarpDriveActive(true);
  };
  
  const handleWarpComplete = () => {
    if (!targetGalaxyId) return;
    
    // Find the target galaxy
    const targetGalaxy = galaxies.find(g => g.id === targetGalaxyId);
    if (!targetGalaxy) return;
    
    // Unlock the target galaxy
    const updatedGalaxies = galaxies.map(galaxy => 
      galaxy.id === targetGalaxyId ? { ...galaxy, unlocked: true } : galaxy
    );
    
    // Update state
    setGalaxies(updatedGalaxies);
    setCurrentGalaxy(targetGalaxy);
    setCurrentSystem(targetGalaxy.systems[0]);
    setCurrentPlanet(targetGalaxy.systems[0].planets[0]);
    
    // Close the minigame
    setIsWarpDriveActive(false);
    setTargetGalaxyId(null);
  };
  
  const handleWarpCancel = () => {
    setIsWarpDriveActive(false);
    setTargetGalaxyId(null);
    toast.error("Warp drive sequence aborted");
  };
  
  const getTargetGalaxyName = () => {
    if (!targetGalaxyId) return "Unknown";
    const targetGalaxy = galaxies.find(g => g.id === targetGalaxyId);
    return targetGalaxy ? targetGalaxy.name : "Unknown";
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
              <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'planet' | 'galaxy')} className="w-full">
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
                    Galaxy Navigation
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
                          {currentSystem && (
                            <p className="text-sm text-gray-400">{currentSystem.name} System • {currentGalaxy?.name} Galaxy</p>
                          )}
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
                    <div className="h-[600px] relative">
                      {currentGalaxy && (
                        <GalaxyMap 
                          galaxies={galaxies}
                          currentGalaxy={currentGalaxy}
                          currentSystem={currentSystem}
                          currentPlanet={currentPlanet}
                          onSelectPlanet={handleSelectPlanet}
                          onSelectSystem={handleSelectSystem}
                          onSelectGalaxy={handleSelectGalaxy}
                          onInitiateWarp={handleInitiateWarp}
                        />
                      )}
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
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center nms-text text-sm text-cosmic-teal/60">
        <p>ATLAS TERMINAL v1.0 // CONNECTION STABLE</p>
      </footer>
      
      {/* Warp Drive Minigame Modal */}
      <Dialog open={isWarpDriveActive} onOpenChange={setIsWarpDriveActive}>
        <DialogContent className="max-w-2xl bg-transparent border-0 shadow-none p-0">
          <WarpDriveMinigame
            onComplete={handleWarpComplete}
            onCancel={handleWarpCancel}
            targetGalaxy={getTargetGalaxyName()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
