import { useState } from 'react';
import { calcularTemperaturaCorporal } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function TemperaturaCorporalCalculator() {
  const [unidad,     setUnidad]     = useState<'c' | 'f'>('c');
  const [temperatura, setTemperatura] = useState('');
  const [result,     setResult]     = useState<ReturnType<typeof calcularTemperaturaCorporal> | null>(null);
  const [error,      setError]      = useState('');

  const calcular = () => {
    const val = parseFloat(temperatura);
    if (isNaN(val)) { setError('Ingresa una temperatura válida'); return; }
    const minC = unidad === 'c' ? 25 : 77;
    const maxC = unidad === 'c' ? 45 : 113;
    if (val < minC || val > maxC) { setError(`Temperatura entre ${minC} y ${maxC} °${unidad.toUpperCase()}`); return; }
    setError('');
    setResult(calcularTemperaturaCorporal(val, unidad));
  };

  const RANGOS = [
    { label: 'Hipotermia grave', rango: '< 32 °C', color: '#60A5FA' },
    { label: 'Hipotermia leve',  rango: '32–35 °C', color: '#93C5FD' },
    { label: 'Normal',           rango: '35–37.5 °C', color: '#34D399' },
    { label: 'Febrícula',        rango: '37.5–38 °C', color: '#CAFF00' },
    { label: 'Fiebre',           rango: '38–39 °C',   color: '#FB923C' },
    { label: 'Fiebre alta',      rango: '39–40 °C',   color: '#EF4444' },
    { label: 'Hiperpirexia',     rango: '> 40 °C',    color: '#DC2626' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Unidad de temperatura</p>
        <div style={{ display: 'flex', gap: '1px', background: 'var(--border)' }}>
          {(['c', 'f'] as const).map(u => (
            <button key={u} onClick={() => { setUnidad(u); setTemperatura(''); setResult(null); setError(''); }}
              style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', background: unidad === u ? 'var(--ink)' : 'var(--cream)', color: unidad === u ? 'white' : 'var(--ink)' }}>
              °{u.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Input
        label={`Temperatura corporal`}
        value={temperatura}
        onChange={setTemperatura}
        suffix={`°${unidad.toUpperCase()}`}
        error={error}
      />

      <Button onClick={calcular}>Interpretar temperatura</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard
            label="Temperatura"
            value={unidad === 'c' ? result.valorC : result.valorF}
            unit={`°${unidad.toUpperCase()}`}
            interpretation={result.categoria}
            color={result.color}
          />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              {result.valorC} °C = {result.valorF} °F
            </p>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <ShareButtons
            text={`Mi temperatura es ${result.valorC} °C — ${result.categoria}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/temperatura-corporal"
          />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Rangos de referencia</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {RANGOS.map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--cream)' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                {r.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>{r.rango}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
