import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularCadenciaCarrera } from '../../lib/calculators';

export default function CadenciaCarreraCalculator() {
  const [cadencia, setCadencia] = useState('');
  const [velocidad, setVelocidad] = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularCadenciaCarrera> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const c = parseFloat(cadencia);
    if (!cadencia || isNaN(c) || c <= 0 || c > 300) {
      setError('Introduce una cadencia válida (ppm)');
      return;
    }
    setError('');
    const v = velocidad && !isNaN(parseFloat(velocidad)) && parseFloat(velocidad) > 0
      ? parseFloat(velocidad)
      : undefined;
    setResultado(calcularCadenciaCarrera(c, v));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', background: 'var(--cream)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input label="Cadencia (pasos/min)" value={cadencia} onChange={setCadencia} suffix="ppm" type="number" />
        <Input label="Velocidad (opcional)" value={velocidad} onChange={setVelocidad} suffix="km/h" type="number" />
      </div>

      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
        La velocidad es opcional. Si la introduces, se calcula la longitud de zancada.
      </p>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Analizar cadencia</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Cadencia</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.cadencia}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>pasos/min</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Categoría</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', lineHeight: 1, color: resultado.color }}>{resultado.categoria}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Eficiencia: {resultado.eficiencia}</div>
            </div>
            {resultado.longitudZancadaCm !== null && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Longitud zancada</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.longitudZancadaCm}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>cm</div>
              </div>
            )}
          </div>

          {/* Barra de referencia */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>
              <span>150 ppm</span><span>180 ppm (óptimo)</span><span>200 ppm</span>
            </div>
            <div style={{ background: 'var(--border)', height: '8px', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${Math.min(100, Math.max(0, ((resultado.cadencia - 150) / 50) * 100))}%`,
                width: '3px', background: resultado.color,
                transform: 'translateX(-50%)',
              }} />
              {/* Zona óptima */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: '14%', background: 'rgba(52,211,153,0.25)' }} />
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
