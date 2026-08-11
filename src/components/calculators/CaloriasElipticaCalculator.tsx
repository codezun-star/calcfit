import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularCaloriasEliptica } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function CaloriasElipticaCalculator() {
  const [peso, setPeso]       = useState('70');
  const [minutos, setMinutos] = useState('30');
  const [intensidad, setIntensidad] = useState<'suave' | 'moderada' | 'intensa'>('moderada');
  const [res, setRes]         = useState<ReturnType<typeof calcularCaloriasEliptica> | null>(null);
  const [error, setError]     = useState('');

  function calcular() {
    const p = parseFloat(peso), m = parseFloat(minutos);
    if (!p || p < 25 || p > 250) { setError('Introduce un peso entre 25 y 250 kg'); return; }
    if (!m || m <= 0 || m > 600) { setError('Introduce los minutos (1–600)'); return; }
    setError('');
    setRes(calcularCaloriasEliptica(p, m, intensidad));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Tiempo" value={minutos} onChange={setMinutos} suffix="min" type="number" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Intensidad</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setIntensidad('suave')} style={seg(intensidad === 'suave')}>Suave</button>
          <button onClick={() => setIntensidad('moderada')} style={seg(intensidad === 'moderada')}>Moderada</button>
          <button onClick={() => setIntensidad('intensa')} style={seg(intensidad === 'intensa')}>Intensa</button>
        </div>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular calorías</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Calorías quemadas</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.calorias}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>kcal · {minutos} min · MET {res.met}</div>
          </div>
          <ShareButtons text={`En la elíptica quemé ${res.calorias} kcal en ${minutos} min. Calcula las tuyas en CalcFit:`} url="https://www.calcfit.com/calorias-eliptica" />
        </div>
      )}
    </div>
  );
}
