
interface PlanetRenderingProps {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  radius: number;
  planet: Planet;
  rotationOffset: number;
}

export const getPlanetGradient = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  planet: Planet
) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, planet.mainColor);
  gradient.addColorStop(1, planet.secondaryColor);
  return gradient;
};

export const drawPlanetFeatures = ({
  ctx,
  centerX,
  centerY,
  radius,
  planet,
  rotationOffset
}: PlanetRenderingProps) => {
  const featureCount = Math.floor(Math.random() * 5) + 3;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotationOffset);
  ctx.translate(-centerX, -centerY);
  
  switch (planet.type) {
    case 'Lush':
      drawLushFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Desert':
      drawDesertFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Frozen':
      drawFrozenFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Toxic':
      drawToxicFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Volcanic':
      drawVolcanicFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Ocean':
      drawOceanFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    case 'Exotic':
      drawExoticFeatures(ctx, centerX, centerY, radius, featureCount);
      break;
    default:
      drawDefaultFeatures(ctx, centerX, centerY, radius, featureCount);
  }
  
  ctx.restore();
};

const drawLushFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.7;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    const featureSize = Math.random() * radius * 0.5 + radius * 0.2;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
};

const drawDesertFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.7;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    const featureSize = Math.random() * radius * 0.2 + radius * 0.1;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const drawFrozenFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  ctx.beginPath();
  ctx.arc(centerX, centerY - radius * 0.7, radius * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
  
  for (let i = 0; i < featureCount; i++) {
    const angle = Math.random() * Math.PI + Math.PI / 2;
    const distance = Math.random() * radius * 0.5;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, radius * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
};

const drawToxicFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount + 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.8;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    const featureSize = Math.random() * radius * 0.3 + radius * 0.1;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
    ctx.fillStyle = '#84cc16';
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
};

const drawVolcanicFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount; i++) {
    const startAngle = Math.random() * Math.PI * 2;
    const endAngle = startAngle + (Math.random() * Math.PI / 4) - Math.PI / 8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (0.7 + Math.random() * 0.3), startAngle, endAngle);
    ctx.lineWidth = radius * (0.05 + Math.random() * 0.05);
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();
  }
};

const drawOceanFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount - 1; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.7;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    const featureSize = Math.random() * radius * 0.15 + radius * 0.05;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
    ctx.fillStyle = '#a3a3a3';
    ctx.fill();
  }
};

const drawExoticFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const startRadius = radius * 0.2;
    const endRadius = radius * 0.9;
    
    const startX = centerX + Math.cos(angle) * startRadius;
    const startY = centerY + Math.sin(angle) * startRadius;
    const endX = centerX + Math.cos(angle) * endRadius;
    const endY = centerY + Math.sin(angle) * endRadius;
    
    const controlX1 = centerX + Math.cos(angle + 0.5) * radius * 0.5;
    const controlY1 = centerY + Math.sin(angle + 0.5) * radius * 0.5;
    const controlX2 = centerX + Math.cos(angle - 0.5) * radius * 0.6;
    const controlY2 = centerY + Math.sin(angle - 0.5) * radius * 0.6;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.lineWidth = radius * 0.05;
    ctx.strokeStyle = '#a855f7';
    ctx.stroke();
  }
};

const drawDefaultFeatures = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  featureCount: number
) => {
  for (let i = 0; i < featureCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.7;
    const featureX = centerX + Math.cos(angle) * distance;
    const featureY = centerY + Math.sin(angle) * distance;
    const featureSize = Math.random() * radius * 0.2 + radius * 0.05;
    
    ctx.beginPath();
    ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
    ctx.strokeStyle = '#a3a3a3';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

export const drawAtmosphere = ({
  ctx,
  centerX,
  centerY,
  radius,
  planet
}: Omit<PlanetRenderingProps, 'rotationOffset'>) => {
  if (planet.type === 'Barren') return;
  
  const atmosphereGradient = ctx.createRadialGradient(
    centerX, centerY, radius,
    centerX, centerY, radius * 1.15
  );
  
  atmosphereGradient.addColorStop(0, `${planet.mainColor}55`);
  atmosphereGradient.addColorStop(1, 'transparent');
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = atmosphereGradient;
  ctx.fill();
};

export const drawRings = ({
  ctx,
  centerX,
  centerY,
  radius,
  planet
}: Omit<PlanetRenderingProps, 'rotationOffset'>) => {
  if (planet.type === 'Exotic' || planet.id.charCodeAt(0) % 3 === 0) {
    ctx.beginPath();
    ctx.ellipse(
      centerX, centerY,
      radius * 1.8, radius * 0.4,
      Math.PI / 6,
      0, Math.PI * 2
    );
    const ringColor = planet.type === 'Exotic' ? '#c084fc' : '#a8a29e';
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
  }
};
