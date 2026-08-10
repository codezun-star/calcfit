interface ResultCardProps {
  label: string;
  value: string | number;
  unit: string;
  interpretation?: string;
  /** Color del valor. Por defecto acid; se usa para señalar categorías de resultado. */
  color?: string;
}

export default function ResultCard({ label, value, unit, interpretation, color }: ResultCardProps) {
  return (
    <div style={{
      background: 'var(--ink)',
      padding: '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '72px',
          color: color ?? 'var(--acid)',
          lineHeight: '1',
        }}>
          {value}
        </span>
        <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'var(--font-mono)' }}>
          {unit}
        </span>
      </div>
      {interpretation && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#888',
          marginTop: '4px',
          lineHeight: '1.5',
        }}>
          {interpretation}
        </span>
      )}
    </div>
  );
}
