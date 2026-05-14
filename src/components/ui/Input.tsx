interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: string;
  type?: string;
  placeholder?: string;
}

export default function Input({ label, value, onChange, error, suffix, type = 'text', placeholder }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      <label style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.3px' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
            padding: '10px 0',
            fontSize: '16px',
            fontFamily: 'var(--font-body)',
            color: 'var(--ink)',
            outline: 'none',
            paddingRight: suffix ? '40px' : '0',
            transition: 'border-color 0.12s',
          }}
          onFocus={(e) => { e.target.style.borderBottomColor = error ? '#ef4444' : 'var(--acid)'; }}
          onBlur={(e) => { e.target.style.borderBottomColor = error ? '#ef4444' : 'var(--border)'; }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 0, fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '11px', color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
          {error}
        </span>
      )}
    </div>
  );
}
