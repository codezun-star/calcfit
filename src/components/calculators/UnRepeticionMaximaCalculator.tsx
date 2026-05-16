import { useState } from 'react';
import { calcularUnaRepeticionMaxima } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function UnRepeticionMaximaCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [reps, setReps] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularUnaRepeticionMaxima> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; reps?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const repsN  = parseInt(reps);
    if (isNaN(pesoKg) || pesoKg < 1 || pesoKg > 500) errs.peso = 'Peso entre 1 y 500 kg';
    if (isNaN(repsN)  || repsN < 1 || repsN > 36)    errs.reps = 'Entre 1 y 36 repeticiones';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularUnaRepeticionMaxima(pesoKg, repsN));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {units === 'metric'
          ? <Input label="Peso levantado" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          : <Input label="Peso levantado" value={lb}   onChange={setLb}   suffix="lb" error={errors.peso} />
        }
        <Input label="Repeticiones hechas" value={reps} onChange={setReps} suffix="reps" error={errors.reps} />
      </div>

      <Button onClick={calcular}>Calcular 1RM</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="1RM estimada" value={result.promedio} unit="kg" interpretation="Promedio de 3 fórmulas validadas" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Brzycki', val: result.brzycki },
              { label: 'Epley',   val: result.epley },
              { label: 'Lander',  val: result.lander },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: 'var(--cream)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{val} <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)' }}>kg</span></div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '300px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['% 1RM', 'Peso (kg)', 'Reps aprox.'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.tabla.map(row => {
                  const hl = row.porcentaje === 100;
                  return (
                    <tr key={row.porcentaje} style={{ borderBottom: '1px solid var(--border)', background: hl ? 'var(--ink)' : 'transparent' }}>
                      <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: hl ? 'var(--acid)' : 'var(--ink)' }}>{row.porcentaje}%</td>
                      <td style={{ padding: '8px', fontFamily: 'var(--font-display)', fontSize: '18px', color: hl ? 'var(--acid)' : 'var(--ink)' }}>{row.peso}</td>
                      <td style={{ padding: '8px', fontSize: '12px', color: hl ? '#aaa' : 'var(--muted)' }}>{row.reps} reps</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ShareButtons text={`Mi 1RM estimada es ${result.promedio} kg. Calculado en CalcFit:`} url="https://www.calcfit.com/1rm" />
        </div>
      )}
    </div>
  );
}
