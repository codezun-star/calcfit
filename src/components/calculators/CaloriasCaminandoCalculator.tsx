import { useState } from 'react';
import { calcularCaloriasCaminando, VELOCIDADES_CAMINATA, type VelocidadCaminata } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function CaloriasCaminandoCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [duracion, setDuracion] = useState('');
  const [velocidad, setVelocidad] = useState<VelocidadCaminata>('moderado');
  const [result, setResult] = useState<ReturnType<typeof calcularCaloriasCaminando> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; duracion?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const minN   = parseFloat(duracion);
    if (isNaN(pesoKg) || pesoKg < 20 || pesoKg > 300) errs.peso    = 'Peso entre 20 y 300 kg';
    if (isNaN(minN)   || minN < 1  || minN > 600)     errs.duracion = 'Duración entre 1 y 600 min';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCaloriasCaminando(pesoKg, minN, velocidad));
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Velocidad / ritmo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(Object.keys(VELOCIDADES_CAMINATA) as VelocidadCaminata[]).map(v => (
            <button key={v} onClick={() => setVelocidad(v)} style={{ textAlign: 'left', padding: '10px 12px', border: '1px solid', borderColor: velocidad === v ? 'var(--ink)' : 'var(--border)', background: velocidad === v ? 'var(--ink)' : 'transparent', color: velocidad === v ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer' }}>
              {VELOCIDADES_CAMINATA[v].nombre}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular calorías</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Calorías quemadas" value={result.calorias} unit="kcal" interpretation={result.velocidadNombre} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Distancia', val: result.km,    suf: 'km' },
              { label: 'Pasos est.', val: result.pasos, suf: 'pasos' },
            ].map(({ label, val, suf }) => (
              <div key={label} style={{ background: 'var(--cream)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{val.toLocaleString()} <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)' }}>{suf}</span></div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Quemé ${result.calorias} kcal caminando. Calculado en CalcFit:`} url="https://www.calcfit.com/calorias-caminando" />
        </div>
      )}
    </div>
  );
}
