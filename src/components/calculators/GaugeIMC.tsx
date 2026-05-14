import { useEffect, useRef } from 'react';

interface GaugeIMCProps {
  imc: number;
}

const SEGMENTOS = [
  { label: 'Bajo peso',  color: '#60A5FA', min: 0,    max: 18.5 },
  { label: 'Normal',     color: '#34D399', min: 18.5, max: 25   },
  { label: 'Sobrepeso',  color: '#CAFF00', min: 25,   max: 30   },
  { label: 'Obesidad I', color: '#FB923C', min: 30,   max: 35   },
  { label: 'Obesidad II',color: '#F87171', min: 35,   max: 45   },
];

function imcToAngle(imc: number): number {
  const clamped = Math.min(Math.max(imc, 0), 45);
  return (clamped / 45) * 180 - 90;
}

function segmentPath(startPct: number, endPct: number, outerR: number, innerR: number): string {
  const startAngle = (startPct * Math.PI) - Math.PI;
  const endAngle   = (endPct   * Math.PI) - Math.PI;
  const cx = 150, cy = 140;

  const x1o = cx + outerR * Math.cos(startAngle);
  const y1o = cy + outerR * Math.sin(startAngle);
  const x2o = cx + outerR * Math.cos(endAngle);
  const y2o = cy + outerR * Math.sin(endAngle);

  const x1i = cx + innerR * Math.cos(endAngle);
  const y1i = cy + innerR * Math.sin(endAngle);
  const x2i = cx + innerR * Math.cos(startAngle);
  const y2i = cy + innerR * Math.sin(startAngle);

  const largeArc = endPct - startPct > 0.5 ? 1 : 0;

  return [
    `M ${x1o} ${y1o}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
    'Z',
  ].join(' ');
}

export default function GaugeIMC({ imc }: GaugeIMCProps) {
  const markerRef = useRef<SVGPolygonElement>(null);
  const MAX_IMC = 45;

  useEffect(() => {
    if (!markerRef.current) return;
    const angle = imcToAngle(imc);
    markerRef.current.style.transform = `rotate(${angle}deg)`;
    markerRef.current.style.transformOrigin = '150px 140px';
    markerRef.current.style.transition = 'transform 0.8s ease';
  }, [imc]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="300" height="170" viewBox="0 0 300 170" style={{ display: 'block', margin: '0 auto' }}>
        {SEGMENTOS.map((seg) => {
          const startPct = seg.min / MAX_IMC;
          const endPct   = seg.max / MAX_IMC;
          return (
            <path
              key={seg.label}
              d={segmentPath(startPct, endPct, 130, 80)}
              fill={seg.color}
              opacity={0.9}
            />
          );
        })}

        {/* Marcador triangular */}
        <polygon
          ref={markerRef}
          points="150,40 145,90 155,90"
          fill="white"
          style={{ transform: `rotate(${imcToAngle(imc)}deg)`, transformOrigin: '150px 140px', transition: 'transform 0.8s ease' }}
        />

        {/* Valor central */}
        <text x="150" y="130" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="48" fill="#CAFF00">
          {imc}
        </text>
        <text x="150" y="148" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="10" fill="#888" letterSpacing="1">
          IMC
        </text>
      </svg>
    </div>
  );
}
