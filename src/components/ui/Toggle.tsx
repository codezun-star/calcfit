interface ToggleProps {
  value: 'metric' | 'imperial';
  onChange: (v: 'metric' | 'imperial') => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  const base: React.CSSProperties = {
    padding: '7px 18px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid var(--border)',
    transition: 'all 0.12s',
    letterSpacing: '0.5px',
  };
  const active: React.CSSProperties = {
    ...base,
    background: 'var(--ink)',
    color: 'var(--acid)',
    border: '1px solid var(--ink)',
  };
  const inactive: React.CSSProperties = {
    ...base,
    background: 'transparent',
    color: 'var(--muted)',
  };

  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--border)' }}>
      <button style={value === 'metric' ? active : inactive} onClick={() => onChange('metric')}>
        kg · cm
      </button>
      <button style={value === 'imperial' ? active : inactive} onClick={() => onChange('imperial')}>
        lb · pies
      </button>
    </div>
  );
}
