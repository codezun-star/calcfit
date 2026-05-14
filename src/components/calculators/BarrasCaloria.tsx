interface BarrasCaloriaProps {
  tdee: number;
}

export default function BarrasCaloria({ tdee }: BarrasCaloriaProps) {
  const deficit   = tdee - 500;
  const superavit = tdee + 500;
  const maxVal    = superavit;
  const maxHeight = 160;

  const bars = [
    { label: 'Déficit',        value: deficit,   color: 'var(--border)' },
    { label: 'Mantenimiento',  value: tdee,       color: 'var(--acid)'   },
    { label: 'Superávit',      value: superavit,  color: 'var(--border)' },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', padding: '20px 0' }}>
      {bars.map((bar) => {
        const height = Math.round((bar.value / maxVal) * maxHeight);
        return (
          <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>
              {bar.value}
            </span>
            <div style={{
              width: '100%',
              height: `${height}px`,
              background: bar.color,
              border: bar.color === 'var(--border)' ? '1px solid var(--border)' : 'none',
              transition: 'height 0.6s ease',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>
              {bar.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textAlign: 'center' }}>
              kcal/día
            </span>
          </div>
        );
      })}
    </div>
  );
}
