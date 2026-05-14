interface BadgeProps {
  variant: 'popular' | 'new' | 'essential';
}

const labels: Record<string, string> = {
  popular:   'Popular',
  new:       'Nuevo',
  essential: 'Esencial',
};

const styles: Record<string, React.CSSProperties> = {
  popular: {
    background: 'var(--acid)',
    color: '#1a1a00',
    border: 'none',
  },
  new: {
    background: 'var(--ink)',
    color: 'var(--acid)',
    border: 'none',
  },
  essential: {
    background: 'transparent',
    color: 'var(--ink)',
    border: '1px solid var(--ink)',
  },
};

export default function Badge({ variant }: BadgeProps) {
  return (
    <span style={{
      ...styles[variant],
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      fontWeight: 500,
      padding: '2px 7px',
      letterSpacing: '0.8px',
      textTransform: 'uppercase',
      display: 'inline-block',
    }}>
      {labels[variant]}
    </span>
  );
}
