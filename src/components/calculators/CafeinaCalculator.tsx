import { useState } from 'react';
import { calcularCafeina } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function CafeinaCalculator() {
  const [units,  setUnits]  = useState<'metric' | 'imperial'>('metric');
  const [peso,   setPeso]   = useState('');
  const [lb,     setLb]     = useState('');
  const [mg,     setMg]     = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularCafeina> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; mg?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const mgVal  = parseFloat(mg);
    if (isNaN(pesoKg) || pesoKg < 20  || pesoKg > 300)  errs.peso = 'Peso entre 20 y 300 kg';
    if (isNaN(mgVal)  || mgVal < 1    || mgVal > 2000)   errs.mg   = 'Consumo entre 1 y 2000 mg';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCafeina(pesoKg, mgVal));
  };

  const FUENTES = [
    { nombre: 'Café espresso (30 ml)',      mg: 63 },
    { nombre: 'Café de filtro (240 ml)',    mg: 95 },
    { nombre: 'Café americano (240 ml)',    mg: 77 },
    { nombre: 'Té negro (240 ml)',          mg: 47 },
    { nombre: 'Red Bull (250 ml)',          mg: 80 },
    { nombre: 'Refresco cola (330 ml)',     mg: 35 },
    { nombre: 'Pastilla cafeína (200 mg)',  mg: 200 },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {units === 'metric'
          ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          : <Input label="Peso" value={lb}   onChange={setLb}   suffix="lb" error={errors.peso} />
        }
        <Input label="Cafeína consumida/día" value={mg} onChange={setMg} suffix="mg" error={errors.mg} />
      </div>

      <Button onClick={calcular}>Calcular dosis</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Dosis de cafeína" value={result.dosisPorKg} unit="mg/kg" interpretation={result.nivelNombre} color={result.color} />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Interpretación</p>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Equivalencias</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {result.equivalencias.map(e => (
                <div key={e.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--cream)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{e.nombre}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--acid)', background: 'var(--ink)', padding: '2px 8px' }}>{e.cantidad} <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>{e.unidad}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Máx. recomendado</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>400 <span style={{ fontSize: '12px' }}>mg/día</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tu consumo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: result.color }}>{mg} <span style={{ fontSize: '12px' }}>mg/día</span></div>
            </div>
          </div>

          <ShareButtons
            text={`Mi consumo de cafeína es ${result.dosisPorKg} mg/kg — nivel ${result.nivelNombre}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/cafeina"
          />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Cafeína por bebida</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {FUENTES.map(f => (
            <button
              key={f.nombre}
              onClick={() => setMg(String(parseFloat(mg || '0') + f.mg))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--cream)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{f.nombre}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>+{f.mg} mg</span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>Toca una bebida para sumar su cafeína al total.</p>
      </div>
    </div>
  );
}
