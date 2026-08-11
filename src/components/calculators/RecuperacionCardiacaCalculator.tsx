import { useState } from 'react';
import { calcularRecuperacionCardiaca } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function RecuperacionCardiacaCalculator() {
  const [fcPico, setFcPico] = useState('');
  const [fc1Min, setFc1Min] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularRecuperacionCardiaca> | null>(null);
  const [errors, setErrors] = useState<{ fcPico?: string; fc1Min?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pico = parseFloat(fcPico);
    const min1 = parseFloat(fc1Min);
    if (isNaN(pico) || pico < 60  || pico > 230) errs.fcPico = 'FC pico entre 60 y 230 ppm';
    if (isNaN(min1) || min1 < 30  || min1 > 220) errs.fc1Min = 'FC al minuto entre 30 y 220 ppm';
    if (!errs.fcPico && !errs.fc1Min && min1 >= pico) errs.fc1Min = 'Debe ser menor a la FC pico';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularRecuperacionCardiaca(pico, min1));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ background: 'var(--cream)', padding: '14px', borderLeft: '3px solid var(--border)' }}>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Registra tu frecuencia cardíaca inmediatamente al terminar el ejercicio (FC pico) y de nuevo exactamente 1 minuto después (FC al 1 min).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="FC al finalizar (pico)" value={fcPico} onChange={setFcPico} suffix="ppm" error={errors.fcPico} />
        <Input label="FC al minuto" value={fc1Min} onChange={setFc1Min} suffix="ppm" error={errors.fc1Min} />
      </div>

      <Button onClick={calcular}>Calcular recuperación</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Recuperación cardíaca (HRR)" value={result.diferencia} unit="ppm/min" interpretation={result.categoria} color={result.color} />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Interpretación</p>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <ShareButtons
            text={`Mi recuperación cardíaca es ${result.diferencia} ppm/min — nivel ${result.categoria}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/recuperacion-cardiaca"
          />
        </div>
      )}
    </div>
  );
}
