import { useState } from 'react';
import { calcularCargaGlucemica } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function CargaGlucemicaCalculator() {
  const [ig,    setIg]    = useState('');
  const [carbs, setCarbs] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularCargaGlucemica> | null>(null);
  const [errors, setErrors] = useState<{ ig?: string; carbs?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const igVal    = parseFloat(ig);
    const carbsVal = parseFloat(carbs);
    if (isNaN(igVal)    || igVal < 1    || igVal > 100)  errs.ig    = 'Índice glucémico entre 1 y 100';
    if (isNaN(carbsVal) || carbsVal < 1 || carbsVal > 500) errs.carbs = 'Carbohidratos entre 1 y 500 g';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCargaGlucemica(igVal, carbsVal));
  };

  const IG_EJEMPLOS = [
    { alimento: 'Glucosa pura',     ig: 100 },
    { alimento: 'Pan blanco',       ig: 75 },
    { alimento: 'Arroz blanco',     ig: 72 },
    { alimento: 'Plátano maduro',   ig: 62 },
    { alimento: 'Pan integral',     ig: 51 },
    { alimento: 'Avena cocida',     ig: 55 },
    { alimento: 'Manzana',          ig: 36 },
    { alimento: 'Lentejas',         ig: 29 },
    { alimento: 'Brócoli',          ig: 10 },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Índice glucémico (IG)" value={ig} onChange={setIg} suffix="" error={errors.ig} />
        <Input label="Carbohidratos por porción" value={carbs} onChange={setCarbs} suffix="g" error={errors.carbs} />
      </div>

      <Button onClick={calcular}>Calcular carga glucémica</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Carga glucémica" value={result.cargaGlucemica} unit="CG" interpretation={result.categoriaNombre} color={result.color} />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Interpretación</p>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'CG baja',   valor: '< 10',    color: '#34D399' },
              { label: 'CG media',  valor: '10–19',   color: '#CAFF00' },
              { label: 'CG alta',   valor: '≥ 20',    color: '#F87171' },
            ].map(c => (
              <div key={c.label} style={{ background: 'var(--cream)', padding: '10px 12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: c.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>{c.valor}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`La carga glucémica de esta porción es ${result.cargaGlucemica} (${result.categoriaNombre}). Calculado con CalcFit:`}
            url="https://www.calcfit.com/carga-glucemica"
          />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Índice glucémico de referencia</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {IG_EJEMPLOS.map(e => (
            <button
              key={e.alimento}
              onClick={() => setIg(String(e.ig))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--cream)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{e.alimento}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>IG {e.ig}</span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>Toca un alimento para usar su IG.</p>
      </div>
    </div>
  );
}
