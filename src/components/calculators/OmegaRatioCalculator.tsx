import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularOmegaRatio } from '../../lib/calculators';

export default function OmegaRatioCalculator() {
  const [omega3, setOmega3]   = useState('');
  const [omega6, setOmega6]   = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularOmegaRatio> | null>(null);
  const [error, setError]     = useState('');

  function calcular() {
    const o3 = parseFloat(omega3);
    const o6 = parseFloat(omega6);
    if (!omega3 || isNaN(o3) || o3 < 0) { setError('Introduce la cantidad de omega-3 (g/día)'); return; }
    if (!omega6 || isNaN(o6) || o6 < 0) { setError('Introduce la cantidad de omega-6 (g/día)'); return; }
    setError('');
    setResultado(calcularOmegaRatio(o3, o6));
  }

  const FUENTES_O3 = [
    { ali: 'Salmón (100g)',    g: '2.2' },
    { ali: 'Sardinas (100g)',  g: '1.5' },
    { ali: 'Nueces (28g)',     g: '2.6' },
    { ali: 'Semillas chía (28g)', g: '5.1' },
    { ali: 'Supl. EPA/DHA',   g: '1.0' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <Input label="Omega-3 diario" value={omega3} onChange={setOmega3} suffix="g/día" type="number" />
        <Input label="Omega-6 diario" value={omega6} onChange={setOmega6} suffix="g/día" type="number" />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          Referencia omega-3 por alimento
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {FUENTES_O3.map(f => (
            <button key={f.ali} onClick={() => setOmega3(f.g)} style={{ padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer' }}>
              {f.ali} = {f.g} g
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Calcular ratio</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ratio ω6 : ω3</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.ratio}:1</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Categoría</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', lineHeight: 1.2, color: resultado.color }}>{resultado.categoriaRatio}</div>
            </div>
            {resultado.deficit !== null && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Déficit omega-3</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: '#F87171', lineHeight: 1 }}>{resultado.deficit} g</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>para llegar a {resultado.omega3Recomendado} g/día</div>
              </div>
            )}
          </div>
          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>

          {/* Visualización del ratio */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>
              <span>Óptimo (4:1)</span><span>Occidental (15–20:1)</span>
            </div>
            <div style={{ background: 'var(--border)', height: '8px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '20%', background: 'rgba(52,211,153,0.4)' }} />
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${Math.min(100, (resultado.ratio / 20) * 100)}%`,
                width: '3px', background: resultado.color,
                transform: 'translateX(-50%)',
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
