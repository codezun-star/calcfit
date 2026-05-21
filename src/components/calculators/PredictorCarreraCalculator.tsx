import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularPredictorCarrera } from '../../lib/calculators';

const DISTANCIAS = [
  { label: '5 km',      km: 5 },
  { label: '10 km',     km: 10 },
  { label: 'Media',     km: 21.1 },
  { label: 'Maratón',   km: 42.195 },
];

export default function PredictorCarreraCalculator() {
  const [tiempoMin, setTiempoMin]     = useState('');
  const [tiempoSeg, setTiempoSeg]     = useState('');
  const [dist1, setDist1]             = useState('10');
  const [dist2, setDist2]             = useState('42.195');
  const [dist1Custom, setDist1Custom] = useState('');
  const [dist2Custom, setDist2Custom] = useState('');
  const [resultado, setResultado]     = useState<ReturnType<typeof calcularPredictorCarrera> | null>(null);
  const [error, setError]             = useState('');

  function calcular() {
    const m  = parseFloat(tiempoMin) || 0;
    const s  = parseFloat(tiempoSeg) || 0;
    const d1 = parseFloat(dist1 === 'custom' ? dist1Custom : dist1);
    const d2 = parseFloat(dist2 === 'custom' ? dist2Custom : dist2);

    if (m + s <= 0)       { setError('Introduce el tiempo actual');         return; }
    if (!d1 || d1 <= 0)   { setError('Distancia origen inválida');          return; }
    if (!d2 || d2 <= 0)   { setError('Distancia destino inválida');         return; }
    if (d2 <= d1)         { setError('La distancia destino debe ser mayor'); return; }

    setError('');
    setResultado(calcularPredictorCarrera(m, s, d1, d2));
  }

  const buttonStyle = (active: boolean) => ({
    padding: '6px 14px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
    letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', background: 'var(--cream)' }}>
      {/* Tiempo actual */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Tiempo actual
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Minutos" value={tiempoMin} onChange={setTiempoMin} suffix="min" type="number" />
          <Input label="Segundos" value={tiempoSeg} onChange={setTiempoSeg} suffix="seg" type="number" />
        </div>
      </div>

      {/* Distancia origen */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Distancia origen
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {DISTANCIAS.map(d => (
            <button key={d.km} onClick={() => setDist1(String(d.km))} style={buttonStyle(dist1 === String(d.km))}>
              {d.label}
            </button>
          ))}
          <button onClick={() => setDist1('custom')} style={buttonStyle(dist1 === 'custom')}>Otra</button>
        </div>
        {dist1 === 'custom' && (
          <div style={{ marginTop: '8px' }}>
            <Input label="Distancia (km)" value={dist1Custom} onChange={setDist1Custom} suffix="km" type="number" />
          </div>
        )}
      </div>

      {/* Distancia destino */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Distancia a predecir
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {DISTANCIAS.map(d => (
            <button key={d.km} onClick={() => setDist2(String(d.km))} style={buttonStyle(dist2 === String(d.km))}>
              {d.label}
            </button>
          ))}
          <button onClick={() => setDist2('custom')} style={buttonStyle(dist2 === 'custom')}>Otra</button>
        </div>
        {dist2 === 'custom' && (
          <div style={{ marginTop: '8px' }}>
            <Input label="Distancia (km)" value={dist2Custom} onChange={setDist2Custom} suffix="km" type="number" />
          </div>
        )}
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Predecir tiempo</Button>

      {resultado && (
        <div style={{ marginTop: '32px', background: 'var(--ink)', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tiempo predicho</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.tiempoPredichoStr}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ritmo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.ritmoPredichoStr}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Velocidad</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.velocidadKmh}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>km/h</div>
            </div>
          </div>
          <div style={{ marginTop: '16px', borderTop: '1px solid #333', paddingTop: '12px' }}>
            <p style={{ fontSize: '11px', color: '#888', fontFamily: 'var(--font-mono)' }}>{resultado.formula}</p>
          </div>
        </div>
      )}
    </div>
  );
}
