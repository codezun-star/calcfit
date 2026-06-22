import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { convertirTiempo } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

type Unidad = 'segundos' | 'minutos' | 'horas' | 'dias' | 'semanas';

export default function ConversorTiempoCalculator() {
  const [valor, setValor]   = useState('90');
  const [unidad, setUnidad] = useState<Unidad>('minutos');
  const [res, setRes]       = useState<ReturnType<typeof convertirTiempo> | null>(null);
  const [error, setError]   = useState('');

  function calcular() {
    const v = parseFloat(valor);
    if (isNaN(v) || v < 0) { setError('Introduce un valor válido'); return; }
    setError('');
    setRes(convertirTiempo(v, unidad));
  }

  const filas: { label: string; key: keyof NonNullable<typeof res> }[] = [
    { label: 'Segundos', key: 'segundos' },
    { label: 'Minutos', key: 'minutos' },
    { label: 'Horas', key: 'horas' },
    { label: 'Días', key: 'dias' },
    { label: 'Semanas', key: 'semanas' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
        <Input label="Valor" value={valor} onChange={setValor} type="number" />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '4px' }}>Unidad de origen</div>
          <select value={unidad} onChange={e => setUnidad(e.target.value as Unidad)} style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '16px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }}>
            <option value="segundos">Segundos</option>
            <option value="minutos">Minutos</option>
            <option value="horas">Horas</option>
            <option value="dias">Días</option>
            <option value="semanas">Semanas</option>
          </select>
        </div>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Convertir</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            {filas.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: i < filas.length - 1 ? '1px solid #222220' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: f.key === unidad ? 'var(--acid)' : 'white', lineHeight: 1 }}>{res[f.key]}</span>
              </div>
            ))}
          </div>
          <ShareButtons text={`${valor} ${unidad} son ${res.horas} horas. Convierte tiempo en CalcFit:`} url="https://www.calcfit.com/conversor-tiempo" />
        </div>
      )}
    </div>
  );
}
