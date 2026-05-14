import { useState } from 'react';
import { calcularCaloriasEjercicio, METS, type ActividadFisica } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function CaloriasEjercicioCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [duracion, setDuracion] = useState('');
  const [actividad, setActividad] = useState<ActividadFisica>('caminar_rapido');
  const [result, setResult] = useState<ReturnType<typeof calcularCaloriasEjercicio> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; duracion?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg  = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const durMin   = parseFloat(duracion);
    if (isNaN(pesoKg) || pesoKg < 20 || pesoKg > 300)  errs.peso    = 'Peso entre 20 y 300 kg';
    if (isNaN(durMin)  || durMin  < 1  || durMin  > 600) errs.duracion = 'Duración entre 1 y 600 min';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCaloriasEjercicio({ pesoKg, duracionMin: durMin, actividad }));
  };

  const selStyle: React.CSSProperties = {
    width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric'
        ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
        : <Input label="Peso" value={lb}   onChange={setLb}   suffix="lb" error={errors.peso} />
      }

      <Input label="Duración" value={duracion} onChange={setDuracion} suffix="min" error={errors.duracion} />

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Tipo de actividad</p>
        <select value={actividad} onChange={e => setActividad(e.target.value as ActividadFisica)} style={selStyle}>
          {(Object.entries(METS) as [ActividadFisica, { met: number; nombre: string }][]).map(([key, { nombre, met }]) => (
            <option key={key} value={key}>{nombre} (MET {met})</option>
          ))}
        </select>
      </div>

      <Button onClick={calcular}>Calcular calorías</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Calorías quemadas" value={result.calorias} unit="kcal" interpretation={result.actividadNombre} />
          <div style={{ padding: '12px 16px', background: 'var(--acid)22', borderLeft: '3px solid var(--acid)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            MET de {result.actividadNombre}: <strong>{result.met}</strong> — El MET (Equivalente Metabólico de Tarea) indica qué tan intensa es la actividad respecto al reposo.
          </div>
          <ShareButtons text={`Quemé ${result.calorias} kcal con ${result.actividadNombre}. Lo calculé en CalcFit:`} url="https://www.calcfit.com/calorias-ejercicio" />
        </div>
      )}
    </div>
  );
}
