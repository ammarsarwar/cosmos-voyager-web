
import { Planet, generateRandomPlanet } from './planetGenerator';

export type GalaxyType = 'Euclid' | 'Hilbert' | 'Calypso' | 'Hesperius' | 'Hyades';

export interface StarSystem {
  id: string;
  name: string;
  planets: Planet[];
  position: { x: number; y: number };
  type: 'Yellow' | 'Red' | 'Green' | 'Blue' | 'Anomaly';
  discovered: boolean;
}

export interface Galaxy {
  id: string;
  name: string;
  type: GalaxyType;
  systems: StarSystem[];
  unlocked: boolean;
}

// Generate a random star system with 1-4 planets
export const generateStarSystem = (galaxyId: string): StarSystem => {
  const systemTypes = ['Yellow', 'Red', 'Green', 'Blue', 'Anomaly'] as const;
  const type = systemTypes[Math.floor(Math.random() * systemTypes.length)];
  
  // Generate system name using a pattern similar to NMS
  const prefixes = ['Al', 'Uy', 'Ge', 'No', 'Ka', 'Ix', 'Su'];
  const suffixes = ['III', 'IV', 'VII', '-16', '-42b', ' Sigma', ' Tau', ' Prime'];
  const name = prefixes[Math.floor(Math.random() * prefixes.length)] + 
               suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Random position within the galaxy map
  const position = {
    x: Math.random() * 100,
    y: Math.random() * 100
  };
  
  // Generate 1-4 planets for this system
  const planetCount = Math.floor(Math.random() * 4) + 1;
  const planets: Planet[] = [];
  
  for (let i = 0; i < planetCount; i++) {
    planets.push(generateRandomPlanet());
  }
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    planets,
    position,
    type,
    discovered: Math.random() > 0.7 // 30% chance of being discovered
  };
};

// Generate a galaxy with a specified number of star systems
export const generateGalaxy = (
  id: string,
  name: GalaxyType,
  systemCount: number,
  unlocked: boolean = false
): Galaxy => {
  const systems: StarSystem[] = [];
  
  for (let i = 0; i < systemCount; i++) {
    systems.push(generateStarSystem(id));
  }
  
  return {
    id,
    name,
    type: name,
    systems,
    unlocked
  };
};

export const generateInitialGalaxies = (): Galaxy[] => {
  return [
    generateGalaxy('g1', 'Euclid', 8, true),
    generateGalaxy('g2', 'Hilbert', 6),
    generateGalaxy('g3', 'Calypso', 7),
    generateGalaxy('g4', 'Hesperius', 9),
    generateGalaxy('g5', 'Hyades', 12)
  ];
};
