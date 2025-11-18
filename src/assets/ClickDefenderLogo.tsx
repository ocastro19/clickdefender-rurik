import React from 'react';

interface ClickDefenderLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  centered?: boolean;
  scale?: number; // Fator de escala adicional (1.2 = 20% maior, 1.3 = 30% maior)
}

export const ClickDefenderLogo: React.FC<ClickDefenderLogoProps> = ({
  size = 56,
  className = "",
  showText = true,
  centered = false,
  scale = 1.25 // 25% maior por padrão
}) => {
  // Aplicar fator de escala para aumentar o tamanho em 20-30%
  const scaledSize = Math.round(size * scale);
  
  if (!showText) {
    return (
      <img 
        src="/lovable-uploads/45217eb6-b8c9-49ab-9e93-45a451ab735c.png" 
        alt="Click Defender" 
        width={scaledSize} 
        height={scaledSize} 
        className={`${className} ${centered ? 'mx-auto' : ''}`}
        style={{
          width: scaledSize,
          height: scaledSize,
          objectFit: 'contain',
          imageRendering: 'crisp-edges' // Mantém qualidade ao redimensionar
        }} 
      />
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className} ${centered ? 'text-center' : ''}`} 
         style={{ gap: `${scaledSize * 0.15}px` }}> {/* Espaçamento proporcional ao tamanho */}
      <img 
        src="/lovable-uploads/45217eb6-b8c9-49ab-9e93-45a451ab735c.png" 
        alt="Click Defender" 
        width={scaledSize} 
        height={scaledSize}
        style={{
          width: scaledSize,
          height: scaledSize,
          objectFit: 'contain',
          imageRendering: 'crisp-edges'
        }} 
      />
      <span 
        className="font-ubuntu font-bold text-foreground whitespace-nowrap tracking-wide"
        style={{
          fontSize: Math.max(scaledSize * 0.35, 16), // Aumentado proporcionalmente
          lineHeight: 1,
          letterSpacing: centered ? '0.05em' : 'normal'
        }}
      >
        CLICK DEFENDER
      </span>
    </div>
  );
};