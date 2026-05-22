import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularProteinaPorComida } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

type Objetivo = 'mantenimiento' | 'hipertrofia' | 'perdida_grasa';

export default function ProteinaPorComidaCalculator() {
  const [peso, setPeso]         = useState('');
  const [objetivo, setObjetivo] = useState<Objetivo>('hipertrofia');
  const [comidas, setComidas]   = useState('4');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularProteinaPorComida> | null>(null);
  const [error, setError]       = useState('');

  function calcular() {
    const kg = parseFloat(peso);
    const n  = parseInt(comidas);
    if (!peso || isNaN(kg) || kg < 20 || kg > 300) { setError('Introduce un peso válido');                 return; }
    if (isNaN(n) || n < 1 || n > 8)                { setError('Las comidas deben estar entre 1 y 8');     return; }
    setError('');
    setResultado(calcularProteinaPorComida(kg, objetivo, n));
  }

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
    letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input label="Peso corporal" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Número de comidas
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['2', '3', '4', '5', '6'].map(n => (
              <button key={n} onClick={() => setComidas(n)} style={btnStyle(comidas === n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Objetivo
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['mantenimiento', 'Mantenimiento (1.6 g/kg)'], ['hipertrofia', 'Hipertrofia (2.0 g/kg)'], ['perdida_grasa', 'Pérdida de grasa (2.4 g/kg)']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setObjetivo(val)} style={btnStyle(objetivo === val)}>{label}</button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Calcular distribución</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total diario</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.totalDiarioG}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g proteína/día</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Por comida</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.porComidaG}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g por toma</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Máx. absorción</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: '#aaa', lineHeight: 1 }}>{resultado.maximoAbsorcionG}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/toma (~0.4 g/kg)</div>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '12px' }}>Distribución sugerida</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {resultado.distribucion.map(d => (
              <div key={d.comida} style={{ border: '1px solid var(--border)', padding: '12px 16px', display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--muted)' }}>#{d.comida}</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{d.ejemplos}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{d.gramos} g</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
          <ShareButtons
            text={`Mi distribución de proteína: ${resultado.totalDiarioG} g/día, ${resultado.porComidaG} g por comida. Calcula la tuya en CalcFit:`}
            url="https://www.calcfit.com/proteina-por-comida"
          />
        </div>
      )}
    </div>
  );
}
