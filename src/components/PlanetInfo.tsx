
import { Planet } from '../utils/planetGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanetInfoProps {
  planet: Planet;
}

const PlanetInfo = ({ planet }: PlanetInfoProps) => {
  return (
    <Card className="glass border-none overflow-hidden">
      <CardHeader 
        className="pb-3" 
        style={{
          background: `linear-gradient(to right, ${planet.mainColor}80, ${planet.secondaryColor}80)`,
        }}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {planet.name}
          </CardTitle>
          <Badge
            className="uppercase font-medium px-2 py-1"
            style={{
              backgroundColor: planet.mainColor,
              color: '#fff'
            }}
          >
            {planet.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2 px-6">
        <p className="text-muted-foreground text-sm mb-6">{planet.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <InfoSection title="Atmosphere">
            <InfoItem label="Type" value={planet.atmosphere.type} />
            <InfoItem label="Weather" value={planet.atmosphere.weather} />
            <InfoItem label="Temperature" value={planet.temperature} />
          </InfoSection>
          
          <InfoSection title="Life">
            <InfoItem 
              label="Flora" 
              value={planet.flora.prevalence === 'None' ? 'None' : planet.flora.name}
              subValue={planet.flora.prevalence === 'None' ? '' : planet.flora.prevalence}
            />
            <InfoItem 
              label="Fauna" 
              value={planet.fauna.prevalence === 'None' ? 'None' : planet.fauna.name}
              subValue={planet.fauna.prevalence === 'None' ? '' : planet.fauna.temperament}
            />
          </InfoSection>
          
          <InfoSection title="Resources" className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {planet.resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-lg">{resource.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">{resource.rarity}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoSection = ({ title, children, className = '' }: InfoSectionProps) => {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  subValue?: string;
}

const InfoItem = ({ label, value, subValue }: InfoItemProps) => {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-1">
      <p className="text-sm text-muted-foreground">{label}:</p>
      <div>
        <p className="text-sm font-medium">{value}</p>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  );
};

export default PlanetInfo;
