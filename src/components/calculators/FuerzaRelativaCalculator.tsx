import { useState } from 'react';
import { calcularFuerzaRelativa, type EjercicioFuerza } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

const EJERCICIOS: { value: EjercicioFuerza; label: string }[] = [
  { value: 'press_banca',   label: 'Press de banca' },
  { value: 'sentadilla',    label: 'Sentadilla' },
  { value: 'peso_muerto',   label: 'Peso muerto' },
  { value: 'press_militar', label: 'Press militar' },
];

export default function FuerzaRelativaCalculator() {
  const [units,     setUnits]     = useState<'metric' | 'imperial'>('metric');
  const [sexo,      setSexo]      = useState<'hombre' | 'mujer'>('hombre');
  const [ejercicio, setEjercicio] = useState<EjercicioFuerza>('press_banca');
  const [pesoC,     setPesoC]     = useState('');
  const [pesoL,     setPesoL]     = useState('');
  const [lbC,       setLbC]       = useState('');
  const [lbL,       setLbL]       = useState('');
  const [result,    setResult]    = useState<ReturnType<typeof calcularFuerzaRelativa> | null>(null);
  const [errors,    setErrors]    = useState<{ pesoC?: string; pesoL?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pC = units === 'metric' ? parseFloat(pesoC) : toKg(parseFloat(lbC));
    const pL = units === 'metric' ? parseFloat(pesoL) : toKg(parseFloat(lbL));
    if (isNaN(pC) || pC < 20 || pC > 300)  errs.pesoC = 'Peso corporal entre 20 y 300 kg';
    if (isNaN(pL) || pL < 1  || pL > 500)  errs.pesoL = 'Peso levantado entre 1 y 500 kg';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularFuerzaRelativa(pC, pL, ejercicio, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'flex', gap: '8px' }}>
        {(['hombre', 'mujer'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSexo(s)}
            style={{
              padding: '7px 20px', fontSize: '12px', fontFamily: 'var(--font-mono)',
              border: '1px solid', borderRadius: '2px', cursor: 'pointer',
              background: sexo === s ? 'var(--ink)' : 'transparent',
              color:      sexo === s ? 'var(--acid)' : 'var(--muted)',
              borderColor: sexo === s ? 'var(--ink)' : 'var(--border)',
            }}
          >
            {s === 'hombre' ? 'Hombre' : 'Mujer'}
          </button>
        ))}
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Ejercicio (1RM)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1px', background: 'var(--border)' }}>
          {EJERCICIOS.map(ej => (
            <button
              key={ej.value}
              onClick={() => setEjercicio(ej.value)}
              style={{
                padding: '10px 12px', fontSize: '12px', border: 'none', cursor: 'pointer',
                background: ejercicio === ej.value ? 'var(--ink)' : 'var(--cream)',
                color:      ejercicio === ej.value ? 'var(--acid)' : 'var(--ink)',
              }}
            >
              {ej.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {units === 'metric' ? (
          <>
            <Input label="Peso corporal" value={pesoC} onChange={setPesoC} suffix="kg" error={errors.pesoC} />
            <Input label="Peso levantado (1RM)" value={pesoL} onChange={setPesoL} suffix="kg" error={errors.pesoL} />
          </>
        ) : (
          <>
            <Input label="Peso corporal" value={lbC} onChange={setLbC} suffix="lb" error={errors.pesoC} />
            <Input label="Peso levantado (1RM)" value={lbL} onChange={setLbL} suffix="lb" error={errors.pesoL} />
          </>
        )}
      </div>

      <Button onClick={calcular}>Calcular fuerza relativa</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Fuerza relativa" value={result.ratio} unit="× PC" interpretation={result.nivelNombre} />

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.descripcion}
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Estándares de fuerza relativa</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {result.estandares.map(std => (
                <div key={std.nivel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--cream)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{std.nivel}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: std.color, fontWeight: 600 }}>≥ {std.ratio}× PC</span>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Mi fuerza relativa en ${EJERCICIOS.find(e => e.value === ejercicio)?.label} es ${result.ratio}× (${result.nivelNombre}). Calculé con CalcFit:`}
            url="https://www.calcfit.com/fuerza-relativa"
          />
        </div>
      )}
    </div>
  );
}
