
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface WarpDriveMinigameProps {
  onComplete: () => void;
  onCancel: () => void;
  targetGalaxy: string;
}

const WarpDriveMinigame = ({ onComplete, onCancel, targetGalaxy }: WarpDriveMinigameProps) => {
  const [warpCharge, setWarpCharge] = useState(0);
  const [stabilityLevel, setStabilityLevel] = useState(50);
  const [clickCount, setClickCount] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);
  
  useEffect(() => {
    // Warp drive loses stability over time
    const stabilityInterval = setInterval(() => {
      setStabilityLevel(prev => {
        const newLevel = prev - (Math.random() * 3);
        if (newLevel <= 0) {
          toast.error("Warp drive failure! Stabilizers offline.");
          clearInterval(stabilityInterval);
          onCancel();
          return 0;
        }
        return newLevel;
      });
    }, 800);
    
    return () => clearInterval(stabilityInterval);
  }, [onCancel]);
  
  // When charge reaches 100, the warp is complete
  useEffect(() => {
    if (warpCharge >= 100) {
      toast.success(`Warp jump to ${targetGalaxy} completed!`);
      onComplete();
    }
  }, [warpCharge, onComplete, targetGalaxy]);
  
  const handleChargeWarpDrive = () => {
    setWarpCharge(prev => Math.min(prev + 10, 100));
    setClickCount(prev => prev + 1);
    
    // Add small random instability with each charge
    setStabilityLevel(prev => Math.max(prev - (Math.random() * 5), 0));
    
    // Feedback for user
    if (clickCount % 2 === 0) {
      toast.info("Charging warp drive...", { duration: 1000 });
    }
  };
  
  const handleStabilize = () => {
    setIsStabilizing(true);
    setStabilityLevel(prev => Math.min(prev + 30, 100));
    
    setTimeout(() => {
      setIsStabilizing(false);
    }, 2000);
  };
  
  return (
    <div className="hud-element p-6 space-y-6">
      <h2 className="nms-title text-center">WARP DRIVE SEQUENCE</h2>
      <p className="nms-text text-cosmic-teal/80 text-center">
        Target: {targetGalaxy} Galaxy
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="data-label">WARP CHARGE</span>
          <span className="data-value">{warpCharge.toFixed(0)}%</span>
        </div>
        <Progress value={warpCharge} className="h-2 bg-cosmic-teal/20" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="data-label">STABILITY</span>
          <span className="data-value" style={{
            color: stabilityLevel < 30 ? '#ef4444' : 
                  stabilityLevel < 60 ? '#f59e0b' : '#4ade80'
          }}>
            {stabilityLevel.toFixed(0)}%
          </span>
        </div>
        <Progress 
          value={stabilityLevel} 
          className="h-2"
          style={{
            backgroundColor: 'rgba(45, 212, 191, 0.2)',
            '--progress-color': stabilityLevel < 30 ? '#ef4444' : 
                               stabilityLevel < 60 ? '#f59e0b' : '#4ade80'
          } as any}
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          className="nms-button" 
          onClick={handleChargeWarpDrive}
          disabled={warpCharge >= 100}
        >
          Charge Warp Drive
        </Button>
        <Button 
          className="nms-button" 
          onClick={handleStabilize}
          disabled={isStabilizing || stabilityLevel > 90}
        >
          Stabilize
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button variant="destructive" onClick={onCancel} className="bg-red-700/50 text-white/90 hover:bg-red-700/70">
          Abort Jump Sequence
        </Button>
      </div>
      
      <div className="nms-text text-xs text-cosmic-teal/60 text-center animate-pulse">
        {isStabilizing ? 'STABILIZING WARP MATRIX...' : 'READY'}
      </div>
    </div>
  );
};

export default WarpDriveMinigame;
