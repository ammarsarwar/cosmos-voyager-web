
// Planet types based on No Man's Sky
export type PlanetType = 
  | 'Lush' 
  | 'Desert' 
  | 'Toxic' 
  | 'Irradiated' 
  | 'Frozen' 
  | 'Barren' 
  | 'Exotic' 
  | 'Ocean'
  | 'Volcanic';

export type Resource = {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra-rare';
  icon: string;
};

export type Flora = {
  name: string;
  description: string;
  prevalence: 'Abundant' | 'Common' | 'Infrequent' | 'Sparse' | 'None';
};

export type Fauna = {
  name: string;
  temperament: 'Docile' | 'Skittish' | 'Defensive' | 'Aggressive' | 'None';
  prevalence: 'Flourishing' | 'Ample' | 'Irregular' | 'Limited' | 'None';
};

export type Atmosphere = {
  type: string;
  weather: string;
  color: string;
};

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  description: string;
  size: number; // 1-10 scale
  resources: Resource[];
  flora: Flora;
  fauna: Fauna;
  atmosphere: Atmosphere;
  temperature: string;
  mainColor: string;
  secondaryColor: string;
}

// Lists for procedural generation
const planetPrefixes = ['Al', 'No', 'Ke', 'Zo', 'Ek', 'Ix', 'Ur', 'Ty', 'Vi', 'Ra'];
const planetSuffixes = ['lar', 'mus', 'rin', 'phor', 'tis', 'gon', 'lex', 'dor', 'kan', 'plex'];
const planetMiddles = ['ta', 'vi', 'ku', 'lo', 'ni', 'sha', 'ma', 'ra', 'di', 'xi'];

const resourceNames = [
  'Copper', 'Emeril', 'Indium', 'Gold', 'Silver', 'Platinum', 
  'Uranium', 'Dioxite', 'Ammonia', 'Phosphorus', 'Pyrite', 
  'Cadmium', 'Activated Copper', 'Activated Emeril',
  'Activated Indium', 'Magnetized Ferrite', 'Rusted Metal',
  'Star Bulb', 'Frost Crystal', 'Cactus Flesh', 'Solanium',
  'Gravitino Ball', 'Storm Crystal', 'Hexite'
];

const floraDescriptions = [
  'Bioluminescent plants that glow with ethereal light',
  'Mushroom-like structures with vibrant caps',
  'Tall, slender crystalline formations that shimmer',
  'Low-lying moss that pulses with electric energy',
  'Floating seed pods that drift through the air',
  'Tentacle-like vines that sway in the breeze',
  'Bubble-producing fungi that pop with musical tones',
  'Palm-like trees with spiral growth patterns',
  'Carnivorous plants with slowly moving appendages',
  'Grass that changes color according to temperature'
];

const weatherTypes = [
  'Boiling Monsoons', 'Firestorms', 'Freezing', 'Toxic Rain', 
  'Radioactive Storms', 'Scalding Heat', 'Pleasant', 
  'Refreshing Breeze', 'Humid', 'Dusty', 'Foggy',
  'Superheated Rain', 'Extreme Wind', 'Blissful',
  'Anomalous', 'Clear', 'Corrupted Blood Storms'
];

const atmosphereTypes = [
  'Nitrogen-rich', 'Oxygen-abundant', 'Neon-infused', 
  'Argon-heavy', 'Methane-dense', 'Helium-rich', 
  'Sulfuric', 'Carbon-rich', 'Chlorine-heavy',
  'Ammonia-dense', 'Absent'
];

// Helper functions
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generatePlanetName = (): string => {
  if (Math.random() > 0.7) {
    // Three-part name
    return getRandomItem(planetPrefixes) + getRandomItem(planetMiddles) + getRandomItem(planetSuffixes);
  } else {
    // Two-part name
    return getRandomItem(planetPrefixes) + getRandomItem(planetSuffixes);
  }
};

const generateResource = (): Resource => {
  const rarities: Resource['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Ultra-rare'];
  const rarity = getRandomItem(rarities);
  const rarityWeight = {
    'Common': 0.6,
    'Uncommon': 0.3,
    'Rare': 0.08,
    'Ultra-rare': 0.02
  };
  
  // Assign icons based on rarity
  const iconMap = {
    'Common': '🔹',
    'Uncommon': '🔸',
    'Rare': '💎',
    'Ultra-rare': '✨'
  };
  
  return {
    name: getRandomItem(resourceNames),
    rarity,
    icon: iconMap[rarity]
  };
};

const generateResources = (count: number): Resource[] => {
  const resources: Resource[] = [];
  for (let i = 0; i < count; i++) {
    resources.push(generateResource());
  }
  return resources;
};

const getPlanetDescription = (type: PlanetType): string => {
  switch (type) {
    case 'Lush':
      return "A vibrant world teeming with life and abundant resources.";
    case 'Desert':
      return "An arid planet with vast expanses of sand and minimal vegetation.";
    case 'Toxic':
      return "A hazardous world with poisonous atmosphere and dangerous flora.";
    case 'Irradiated':
      return "A radiation-soaked planet with unique mutated lifeforms.";
    case 'Frozen':
      return "A frigid world covered in ice and snow with rare crystalline formations.";
    case 'Barren':
      return "A lifeless rock with minimal atmosphere but potential mineral wealth.";
    case 'Exotic':
      return "A strange anomalous planet defying conventional classification.";
    case 'Ocean':
      return "A world covered almost entirely by vast seas and scattered islands.";
    case 'Volcanic':
      return "An unstable planet with active volcanoes and rivers of magma.";
    default:
      return "A mysterious world awaiting exploration.";
  }
};

// Get appropriate colors based on planet type
const getPlanetColors = (type: PlanetType): { main: string, secondary: string } => {
  switch (type) {
    case 'Lush':
      return { main: '#4ade80', secondary: '#22c55e' }; // Green
    case 'Desert':
      return { main: '#fbbf24', secondary: '#f59e0b' }; // Yellow/orange
    case 'Toxic':
      return { main: '#84cc16', secondary: '#65a30d' }; // Yellow-green
    case 'Irradiated':
      return { main: '#fb923c', secondary: '#f97316' }; // Orange
    case 'Frozen':
      return { main: '#93c5fd', secondary: '#60a5fa' }; // Light blue
    case 'Barren':
      return { main: '#a8a29e', secondary: '#78716c' }; // Gray
    case 'Exotic':
      return { main: '#c084fc', secondary: '#a855f7' }; // Purple
    case 'Ocean':
      return { main: '#38bdf8', secondary: '#0ea5e9' }; // Blue
    case 'Volcanic':
      return { main: '#f87171', secondary: '#ef4444' }; // Red
    default:
      return { main: '#a3a3a3', secondary: '#737373' }; // Default gray
  }
};

// Generate a random planet
export const generateRandomPlanet = (): Planet => {
  const planetTypes: PlanetType[] = [
    'Lush', 'Desert', 'Toxic', 'Irradiated', 
    'Frozen', 'Barren', 'Exotic', 'Ocean', 'Volcanic'
  ];
  
  const type = getRandomItem(planetTypes);
  const colors = getPlanetColors(type);
  
  // Create mutable arrays from the readonly arrays to avoid type errors
  const prevalenceTypes = ['Abundant', 'Common', 'Infrequent', 'Sparse', 'None'] as const;
  const prevalenceTypesArray = [...prevalenceTypes];
  
  const temperaments = ['Docile', 'Skittish', 'Defensive', 'Aggressive', 'None'] as const;
  const temperamentsArray = [...temperaments];
  
  const faunaTypes = ['Flourishing', 'Ample', 'Irregular', 'Limited', 'None'] as const;
  const faunaTypesArray = [...faunaTypes];
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    name: generatePlanetName(),
    type,
    description: getPlanetDescription(type),
    size: Math.floor(Math.random() * 10) + 1,
    resources: generateResources(Math.floor(Math.random() * 3) + 2),
    flora: {
      name: type === 'Barren' ? 'None' : generatePlanetName() + 'weed',
      description: type === 'Barren' ? 'None' : getRandomItem(floraDescriptions),
      prevalence: type === 'Barren' ? 'None' : getRandomItem(prevalenceTypesArray)
    },
    fauna: {
      name: type === 'Barren' ? 'None' : generatePlanetName() + 'oid',
      temperament: type === 'Barren' ? 'None' : getRandomItem(temperamentsArray),
      prevalence: type === 'Barren' ? 'None' : getRandomItem(faunaTypesArray)
    },
    atmosphere: {
      type: type === 'Barren' ? 'Absent' : getRandomItem(atmosphereTypes),
      weather: getRandomItem(weatherTypes),
      color: colors.main
    },
    temperature: (() => {
      switch(type) {
        case 'Frozen': return `${Math.floor(Math.random() * 100) - 200}°C`;
        case 'Lush': return `${Math.floor(Math.random() * 15) + 15}°C`;
        case 'Desert': 
        case 'Volcanic': return `${Math.floor(Math.random() * 100) + 40}°C`;
        default: return `${Math.floor(Math.random() * 80) - 20}°C`;
      }
    })(),
    mainColor: colors.main,
    secondaryColor: colors.secondary
  };
};

// Generate a list of planets
export const generatePlanets = (count: number): Planet[] => {
  const planets: Planet[] = [];
  for (let i = 0; i < count; i++) {
    planets.push(generateRandomPlanet());
  }
  return planets;
};

// Generate a single "starter" planet
export const generateStarterPlanet = (): Planet => {
  const planet = generateRandomPlanet();
  planet.name = "Alixia Prime"; // Fixed name for starter planet
  planet.type = "Lush"; // Always a lush (habitable) planet to start
  return planet;
};
