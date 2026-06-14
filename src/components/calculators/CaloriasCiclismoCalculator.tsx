import { useState } from 'react';
import { calcularCaloriasCiclismo, INTENSIDADES_CICLISMO, type IntensidadCiclismo } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

const INTENSIDADES = Object.entries(INTENSIDADES_CICLISMO) as [IntensidadCiclismo, { kmh: number; met: number; nombre: string }][];

export default function CaloriasCiclismoCalculator() {
  const [units,      setUnits]      = useState<'metric' | 'imperial'>('metric');
  const [peso,       setPeso]       = useState('');
  const [lb,         setLb]         = useState('');
  const [duracion,   setDuracion]   = useState('');
  const [intensidad, setIntensidad] = useState<IntensidadCiclismo>('moderado');
  const [result,     setResult]     = useState<ReturnType<typeof calcularCaloriasCiclismo> | null>(null);
  const [errors,     setErrors]     = useState<{ peso?: string; duracion?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const dur    = parseFloat(duracion);
    if (isNaN(pesoKg) || pesoKg < 20 || pesoKg > 300) errs.peso     = 'Peso entre 20 y 300 kg';
    if (isNaN(dur)    || dur < 1     || dur > 600)     errs.duracion = 'Duración entre 1 y 600 min';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCaloriasCiclismo(pesoKg, dur, intensidad));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {units === 'metric'
          ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          : <Input label="Peso" value={lb}   onChange={setLb}   suffix="lb" error={errors.peso} />
        }
        <Input label="Duración" value={duracion} onChange={setDuracion} suffix="min" error={errors.duracion} />
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Intensidad</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {INTENSIDADES.map(([key, info]) => (
            <button
              key={key}
              onClick={() => setIntensidad(key)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', fontSize: '13px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: intensidad === key ? 'var(--ink)' : 'var(--cream)',
                color:      intensidad === key ? 'white' : 'var(--ink)',
              }}
            >
              <span>{info.nombre}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: intensidad === key ? 'var(--acid)' : 'var(--muted)' }}>MET {info.met}</span>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular calorías</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Calorías quemadas" value={result.calorias} unit="kcal" interpretation={result.intensidadNombre} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Distancia</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.km} <span style={{ fontSize: '12px' }}>km</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>MET</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.met}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>kcal/min</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{Math.round(result.calorias / parseFloat(duracion) * 10) / 10}</div>
            </div>
          </div>

          <ShareButtons
            text={`Pedaleé ${result.km} km y quemé ${result.calorias} kcal. Calculado con CalcFit:`}
            url="https://www.calcfit.com/calorias-ciclismo"
          />
        </div>
      )}
    </div>
  );
}
