import { useState } from 'react';
import { calcularTestCooper } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function TestCooperCalculator() {
  const [sexo,      setSexo]      = useState<'hombre' | 'mujer'>('hombre');
  const [edad,      setEdad]      = useState('');
  const [distancia, setDistancia] = useState('');
  const [result,    setResult]    = useState<ReturnType<typeof calcularTestCooper> | null>(null);
  const [errors,    setErrors]    = useState<{ edad?: string; distancia?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const ed  = parseFloat(edad);
    const dis = parseFloat(distancia);
    if (isNaN(ed)  || ed < 10  || ed > 80)    errs.edad      = 'Edad entre 10 y 80 años';
    if (isNaN(dis) || dis < 505 || dis > 5000) errs.distancia = 'Distancia entre 505 y 5000 m';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularTestCooper(dis, sexo, ed));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Sexo biológico</p>
        <div style={{ display: 'flex', gap: '1px', background: 'var(--border)' }}>
          {(['hombre', 'mujer'] as const).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', background: sexo === s ? 'var(--ink)' : 'var(--cream)', color: sexo === s ? 'white' : 'var(--ink)' }}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" error={errors.edad} />
        <Input label="Distancia corrida (12 min)" value={distancia} onChange={setDistancia} suffix="m" error={errors.distancia} />
      </div>

      <Button onClick={calcular}>Calcular VO₂ máx</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="VO₂ máx estimado" value={result.vo2max} unit="ml/kg/min" interpretation={result.categoria} color={result.color} />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Nivel aeróbico</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: result.color }}>{result.categoria}</p>
          </div>

          <ShareButtons
            text={`Mi VO₂ máx estimado por el Test de Cooper es ${result.vo2max} ml/kg/min (${result.categoria}). Calculado con CalcFit:`}
            url="https://www.calcfit.com/test-cooper"
          />
        </div>
      )}
    </div>
  );
}
