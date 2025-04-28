
import { useState } from 'react';
import { Navigation, Globe, Rocket, Star, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="text-cosmic-teal" size={28} />
          <span className="text-xl font-bold tracking-wider glow-text text-white">
            COSMOS VOYAGER
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavItem icon={<Globe size={18} />} label="Planets" />
          <NavItem icon={<Star size={18} />} label="Discoveries" />
          <NavItem icon={<Navigation size={18} />} label="Galaxy Map" />
          <NavItem icon={<Rocket size={18} />} label="Expeditions" />
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-2 rounded-lg mx-4">
          <div className="flex flex-col py-2">
            <MobileNavItem icon={<Globe size={18} />} label="Planets" />
            <MobileNavItem icon={<Star size={18} />} label="Discoveries" />
            <MobileNavItem icon={<Navigation size={18} />} label="Galaxy Map" />
            <MobileNavItem icon={<Rocket size={18} />} label="Expeditions" />
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => {
  return (
    <a 
      href="#" 
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
    >
      <span className="text-cosmic-teal">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
};

const MobileNavItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => {
  return (
    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10">
      <span className="text-cosmic-teal">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
};

export default Navbar;
