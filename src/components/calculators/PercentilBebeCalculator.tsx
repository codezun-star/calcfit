import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularPercentilBebe } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function PercentilBebeCalculator() {
  const [sexo, setSexo]   = useState<'nino' | 'nina'>('nino');
  const [meses, setMeses] = useState('6');
  const [tipo, setTipo]   = useState<'peso' | 'talla'>('peso');
  const [valor, setValor] = useState('7.5');
  const [res, setRes]     = useState<ReturnType<typeof calcularPercentilBebe> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const m = parseFloat(meses), v = parseFloat(valor);
    if (isNaN(m) || m < 0 || m > 24) { setError('Introduce la edad en meses (0–24)'); return; }
    if (!v || v <= 0) { setError('Introduce un valor válido'); return; }
    setError('');
    setRes(calcularPercentilBebe(sexo, m, v, tipo));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo del bebé</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setSexo('nino')} style={seg(sexo === 'nino')}>Niño</button>
          <button onClick={() => setSexo('nina')} style={seg(sexo === 'nina')}>Niña</button>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Medir</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setTipo('peso')} style={seg(tipo === 'peso')}>Peso (kg)</button>
          <button onClick={() => setTipo('talla')} style={seg(tipo === 'talla')}>Talla (cm)</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Edad" value={meses} onChange={setMeses} suffix="meses" type="number" />
        <Input label={tipo === 'peso' ? 'Peso' : 'Talla'} value={valor} onChange={setValor} suffix={tipo === 'peso' ? 'kg' : 'cm'} type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular percentil</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Percentil estimado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: 'var(--acid)', lineHeight: 1 }}>P{res.percentil}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{res.categoria} · mediana OMS {res.mediana} {tipo === 'peso' ? 'kg' : 'cm'}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              El percentil P{res.percentil} significa que tu bebé supera al {res.percentil}% de bebés de su edad y sexo. Lo importante no es el número, sino que la curva se mantenga estable en el tiempo. Es una <strong style={{ color: 'var(--ink)' }}>estimación</strong> basada en los estándares OMS; consulta siempre con tu pediatra.
            </p>
          </div>
          <ShareButtons text={`Mi bebé está en el percentil P${res.percentil} de ${tipo}. Calcula el del tuyo en CalcFit:`} url="https://www.calcfit.com/percentil-bebe" />
        </div>
      )}
    </div>
  );
}
