import { useState } from 'react';
import { calcularHidratacionDeportiva } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Intensidad  = 'baja' | 'moderada' | 'alta' | 'muy_alta';
type Temperatura = 'fresco' | 'templado' | 'calido' | 'muy_calido';

const pillStyle = (active: boolean) => ({
  padding: '7px 12px', fontSize: '11px', fontFamily: 'var(--font-mono)',
  border: '1px solid', borderRadius: '2px', cursor: 'pointer',
  background: active ? 'var(--ink)' : 'transparent',
  color:      active ? 'var(--acid)' : 'var(--muted)',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
  letterSpacing: '0.5px',
});

const INTENSIDADES: { value: Intensidad; label: string }[] = [
  { value: 'baja',     label: 'Baja' },
  { value: 'moderada', label: 'Moderada' },
  { value: 'alta',     label: 'Alta' },
  { value: 'muy_alta', label: 'Muy alta' },
];

const TEMPERATURAS: { value: Temperatura; label: string }[] = [
  { value: 'fresco',     label: 'Fresco (<18°C)' },
  { value: 'templado',   label: 'Templado (18-25°C)' },
  { value: 'calido',     label: 'Cálido (25-32°C)' },
  { value: 'muy_calido', label: 'Muy cálido (>32°C)' },
];

export default function HidratacionDeportivaCalculator() {
  const [peso,        setPeso]        = useState('');
  const [duracion,    setDuracion]    = useState('');
  const [intensidad,  setIntensidad]  = useState<Intensidad>('moderada');
  const [temperatura, setTemperatura] = useState<Temperatura>('templado');
  const [result,      setResult]      = useState<ReturnType<typeof calcularHidratacionDeportiva> | null>(null);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const p = parseFloat(peso);
    const d = parseFloat(duracion);
    if (isNaN(p) || p < 30 || p > 250) errs.peso     = 'Entre 30 y 250 kg';
    if (isNaN(d) || d < 10 || d > 480) errs.duracion = 'Entre 10 y 480 min';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularHidratacionDeportiva(p, d, intensidad, temperatura));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Protocolo ACSM: hidratación antes, durante y después del ejercicio según tu peso, duración, intensidad y temperatura ambiente.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Peso corporal" value={peso}     onChange={setPeso}     suffix="kg"  error={errors.peso} />
        <Input label="Duración"      value={duracion} onChange={setDuracion} suffix="min" error={errors.duracion} />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Intensidad del ejercicio</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {INTENSIDADES.map(i => (
            <button key={i.value} onClick={() => setIntensidad(i.value)} style={pillStyle(intensidad === i.value)}>{i.label}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Temperatura ambiente</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TEMPERATURAS.map(t => (
            <button key={t.value} onClick={() => setTemperatura(t.value)} style={pillStyle(temperatura === t.value)}>{t.label}</button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular hidratación</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.totalMl}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa' }}>mL totales estimados</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Pre-ejercicio</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.aguaPreEjercicioMl} mL</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>4 horas antes</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Durante (c/15 min)</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.aguaDuranteML_15min} mL</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>cada 15 minutos</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Post-ejercicio</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.aguaPostEjercicioMl} mL</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>primeras 2 horas</div>
            </div>
          </div>

          {result.electrolitosNecesarios && (
            <div style={{ padding: '12px 16px', background: '#FB923C22', borderLeft: '3px solid #FB923C', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>Electrolitos necesarios</strong> — Sesión larga e intensa: añade sodio y potasio (bebida isotónica o pastillas de sales).
            </div>
          )}

          <div style={{ padding: '14px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Para mi sesión de ejercicio necesito ~${result.totalMl} mL de agua (${result.aguaPreEjercicioMl} pre + ${result.aguaPostEjercicioMl} post). Calcula la tuya en CalcFit:`}
            url="https://www.calcfit.com/hidratacion-deportiva"
          />
        </div>
      )}
    </div>
  );
}
