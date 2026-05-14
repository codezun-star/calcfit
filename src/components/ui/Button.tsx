interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'dark';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ variant = 'primary', size = 'md', onClick, disabled, children, type = 'button' }: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'opacity 0.12s',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '0.2px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  };

  const sizes = {
    sm: { fontSize: '11px', padding: '7px 14px' },
    md: { fontSize: '13px', padding: '11px 22px' },
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--acid)', color: 'var(--ink)', ...sizes[size] },
    ghost:   { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)', ...sizes[size] },
    dark:    { background: 'var(--ink)', color: 'var(--acid)', ...sizes[size] },
  };

  return (
    <button type={type} style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
