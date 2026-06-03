import { useState, useMemo, useEffect } from 'react';

const HASH_MAP: Record<string, string> = {
  'fitness':   'Fitness & salud',
  'embarazo':  'Embarazo & fertilidad',
  'fechas':    'Fechas & tiempo',
  'nutricion': 'Nutrición & bienestar',
};

type Calc = {
  slug: string;
  nombre: string;
  desc: string;
  badge: string | null;
  destacada: boolean;
  num: string;
  icon: string;
  categoria: string;
};

export default function CalculatorBrowser({
  calculadoras,
  categorias,
  limit,
  categoryPageUrls,
}: {
  calculadoras: Calc[];
  categorias: string[];
  limit?: number;
  categoryPageUrls?: Record<string, string>;
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categorias[0] ?? '');
  const [focusedSearch, setFocusedSearch] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      const mapped = HASH_MAP[hash];
      if (mapped && categorias.includes(mapped)) {
        setActiveCategory(mapped);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const allInCategory = useMemo(
    () => calculadoras.filter(c => c.categoria === activeCategory),
    [calculadoras, activeCategory],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return allInCategory.filter(
        c => c.nombre.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q),
      );
    }
    return limit ? allInCategory.slice(0, limit) : allInCategory;
  }, [allInCategory, query, limit]);

  const isSearching = query.trim().length > 0;
  const hasMore = !isSearching && limit != null && allInCategory.length > limit;
  const categoryPageUrl = categoryPageUrls?.[activeCategory];

  const pills = [...categorias];

  return (
    <div>
      {/* Barra de búsqueda */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted)',
          pointerEvents: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7.5" cy="7.5" r="5.5" />
            <line x1="11.5" y1="11.5" x2="16" y2="16" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar calculadora…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocusedSearch(true)}
          onBlur={() => setFocusedSearch(false)}
          style={{
            width: '100%',
            padding: '10px 32px 10px 24px',
            border: 'none',
            borderBottom: `1px solid ${focusedSearch ? 'var(--acid)' : 'var(--border)'}`,
            background: 'transparent',
            fontSize: 14,
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              padding: 4,
              lineHeight: 1,
            }}
            aria-label="Limpiar búsqueda"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        )}
      </div>

      {/* Pills de categoría */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {pills.map(pill => {
          const isActive = activeCategory === pill;
          return (
            <button
              key={pill}
              onClick={() => setActiveCategory(pill)}
              style={{
                padding: '5px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                border: isActive ? '1px solid var(--ink)' : '1px solid var(--border)',
                background: isActive ? 'var(--ink)' : 'transparent',
                color: isActive ? 'var(--acid)' : 'var(--muted)',
                transition: 'all 0.1s',
                whiteSpace: 'nowrap',
              }}
            >
              {pill}
            </button>
          );
        })}
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          alignSelf: 'center',
        }}>
          {isSearching ? `${filtered.length} resultados` : `${allInCategory.length} herramientas`}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '56px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--border)', marginBottom: 8 }}>0</div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            No hay calculadoras que coincidan con <em>"{query}"</em>
          </p>
          <button
            onClick={() => { setQuery(''); setActiveCategory(categorias[0] ?? ''); }}
            style={{
              marginTop: 12,
              padding: '6px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--muted)',
            }}
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1,
          background: 'var(--border)',
        }}>
          {filtered.map(calc => (
            <a
              key={calc.slug}
              href={calc.slug}
              style={{
                background: 'var(--cream)',
                padding: 20,
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#EDE9E0')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  background: calc.destacada ? 'var(--acid)' : 'var(--ink)',
                  color: calc.destacada ? 'var(--ink)' : 'var(--acid)',
                  flexShrink: 0,
                }}
                dangerouslySetInnerHTML={{ __html: calc.icon }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                {calc.nombre}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>
                {calc.desc}
              </div>
              {calc.badge && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  padding: '2px 7px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  ...(calc.badge === 'popular'
                    ? { background: 'var(--acid)', color: '#1a1a00' }
                    : calc.badge === 'essential'
                    ? { border: '1px solid var(--ink)', color: 'var(--ink)' }
                    : { background: 'var(--ink)', color: 'var(--acid)' }),
                }}>
                  {calc.badge === 'popular' ? 'Popular' : calc.badge === 'essential' ? 'Esencial' : 'Nuevo'}
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Enlace "Ver todas" cuando hay límite */}
      {hasMore && categoryPageUrl && (
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 1, padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Mostrando {limit} de {allInCategory.length}
          </span>
          <a
            href={categoryPageUrl}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--ink)',
              textDecoration: 'none',
              padding: '6px 14px',
              border: '1px solid var(--ink)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--ink)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--acid)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)';
            }}
          >
            Ver las {allInCategory.length - limit!} restantes →
          </a>
        </div>
      )}
    </div>
  );
}
