import { useState } from 'react';
import { evaluarContracciones } from '../../lib/calculators';

type Contraccion = { start: number; durationSec: number };

export default function ContadorContraccionesCalculator() {
  const [contracciones, setContracciones] = useState<Contraccion[]>([]);
  const [enCurso, setEnCurso] = useState<number | null>(null);

  function toggle() {
    if (enCurso === null) {
      setEnCurso(Date.now());
    } else {
      const durationSec = Math.max(1, Math.round((Date.now() - enCurso) / 1000));
      setContracciones(prev => [...prev, { start: enCurso, durationSec }]);
      setEnCurso(null);
    }
  }
  function reiniciar() { setContracciones([]); setEnCurso(null); }

  const r = evaluarContracciones(contracciones);
  const faseColor: Record<string, string> = {
    'sin-datos': 'var(--muted)', temprana: '#16a34a', activa: '#d97706', hospital: '#dc2626',
  };
  const hhmm = (ms: number) => {
    const d = new Date(ms);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <button onClick={toggle} style={{
        padding: '22px', border: 'none', cursor: 'pointer',
        background: enCurso !== null ? '#dc2626' : 'var(--acid)',
        color: enCurso !== null ? 'white' : 'var(--ink)',
        fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '1px',
      }}>
        {enCurso !== null ? '■ Finalizar contracción' : '● Iniciar contracción'}
      </button>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        Pulsa al empezar una contracción y de nuevo al terminar. Se registran la duración y la frecuencia automáticamente. Los datos no se guardan ni se envían a ningún servidor.
      </p>

      {contracciones.length > 0 && (
        <>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Frecuencia</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{r.frecuenciaMin || '—'}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>min entre contracciones</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Duración media</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'white', lineHeight: 1 }}>{r.duracionSeg || '—'}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>segundos</div>
            </div>
          </div>
          <div style={{ border: `1px solid ${faseColor[r.fase]}`, padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: faseColor[r.fase], lineHeight: 1.7, fontWeight: 600 }}>{r.mensaje}</p>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Registro ({contracciones.length})</span>
              <button onClick={reiniciar} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reiniciar</button>
            </div>
            {contracciones.slice().reverse().slice(0, 8).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink)' }}>Inicio {hhmm(c.start)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>{c.durationSec}s</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
