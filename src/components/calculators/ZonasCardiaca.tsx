interface Zona {
  nombre: string;
  min:    number;
  max:    number;
  color:  string;
}

interface ZonasCardiacaProps {
  fcm:   number;
  zonas: Zona[];
}

const DESCRIPCIONES: Record<string, string> = {
  'Recuperación':   'Calentamiento y recuperación activa',
  'Quema de grasa': 'Máxima oxidación de grasas',
  'Aeróbica':       'Mejora resistencia cardiovascular',
  'Anaeróbica':     'Aumenta velocidad y potencia',
  'Máxima':         'Esfuerzo máximo, intervalos cortos',
};

export default function ZonasCardiaca({ fcm, zonas }: ZonasCardiacaProps) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
        FCM: <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--acid)' }}>{fcm}</span> ppm
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {zonas.map((zona, i) => {
          const widthPct = ((zona.max - zona.min) / fcm) * 100 + i * 8;
          return (
            <div key={zona.nombre} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '90px', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--ink)' }}>
                  {zona.nombre}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)' }}>
                  {zona.min}–{zona.max} ppm
                </div>
              </div>
              <div style={{ flex: 1, position: 'relative', height: '28px', background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(widthPct, 100)}%`,
                  background: zona.color,
                  transition: 'width 0.6s ease',
                }} />
                <span style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--ink)',
                  fontWeight: 500,
                }}>
                  Zona {i + 1}
                </span>
              </div>
              <div style={{ width: '120px', flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--muted)', lineHeight: 1.3 }}>
                {DESCRIPCIONES[zona.nombre]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
