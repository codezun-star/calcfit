import { useState } from 'react';
import { calcularTestRockport } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function TestRockportCalculator() {
  const [units,   setUnits]   = useState<'metric' | 'imperial'>('metric');
  const [sexo,    setSexo]    = useState<'hombre' | 'mujer'>('hombre');
  const [peso,    setPeso]    = useState('');
  const [lb,      setLb]      = useState('');
  const [edad,    setEdad]    = useState('');
  const [tiempo,  setTiempo]  = useState('');
  const [fc,      setFc]      = useState('');
  const [result,  setResult]  = useState<ReturnType<typeof calcularTestRockport> | null>(null);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const ed     = parseFloat(edad);
    const tMin   = parseFloat(tiempo);
    const fcVal  = parseFloat(fc);
    if (isNaN(pesoKg) || pesoKg < 20  || pesoKg > 300) errs.peso   = 'Peso entre 20 y 300 kg';
    if (isNaN(ed)     || ed < 18      || ed > 80)       errs.edad   = 'Edad entre 18 y 80 años';
    if (isNaN(tMin)   || tMin < 5     || tMin > 30)     errs.tiempo = 'Tiempo entre 5 y 30 min';
    if (isNaN(fcVal)  || fcVal < 60   || fcVal > 220)   errs.fc     = 'FC entre 60 y 220 ppm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularTestRockport(tMin, fcVal, pesoKg, ed, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ background: 'var(--cream)', padding: '14px', borderLeft: '3px solid var(--border)' }}>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Camina 1 milla (1.6 km) lo más rápido posible sin correr. Al finalizar, registra tu tiempo y tu frecuencia cardíaca inmediatamente.
        </p>
      </div>

      <Toggle value={units} onChange={setUnits} />

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
        {units === 'metric'
          ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          : <Input label="Peso" value={lb}   onChange={setLb}   suffix="lb" error={errors.peso} />
        }
        <Input label="Edad"           value={edad}   onChange={setEdad}   suffix="años" error={errors.edad} />
        <Input label="Tiempo 1 milla" value={tiempo} onChange={setTiempo} suffix="min"  error={errors.tiempo} />
        <Input label="FC al finalizar" value={fc}    onChange={setFc}     suffix="ppm"  error={errors.fc} />
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
            text={`Mi VO₂ máx estimado por el Test de Rockport es ${result.vo2max} ml/kg/min (${result.categoria}). Calculado con CalcFit:`}
            url="https://www.calcfit.com/test-rockport"
          />
        </div>
      )}
    </div>
  );
}
