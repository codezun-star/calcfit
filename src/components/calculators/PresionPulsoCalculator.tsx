import { useState } from 'react';
import { calcularPresionPulso } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function PresionPulsoCalculator() {
  const [sistolica,   setSistolica]   = useState('');
  const [diastolica,  setDiastolica]  = useState('');
  const [result,      setResult]      = useState<ReturnType<typeof calcularPresionPulso> | null>(null);
  const [errors,      setErrors]      = useState<{ sistolica?: string; diastolica?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const sis = parseFloat(sistolica);
    const dia = parseFloat(diastolica);
    if (isNaN(sis) || sis < 60  || sis > 250)  errs.sistolica  = 'Entre 60 y 250 mmHg';
    if (isNaN(dia) || dia < 30  || dia > 150)   errs.diastolica = 'Entre 30 y 150 mmHg';
    if (!errs.sistolica && !errs.diastolica && dia >= sis) errs.diastolica = 'Debe ser menor a la sistólica';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularPresionPulso(sis, dia));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Presión sistólica" value={sistolica}  onChange={setSistolica}  suffix="mmHg" error={errors.sistolica} />
        <Input label="Presión diastólica" value={diastolica} onChange={setDiastolica} suffix="mmHg" error={errors.diastolica} />
      </div>

      <Button onClick={calcular}>Calcular presión de pulso</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Presión de pulso" value={result.pp} unit="mmHg" interpretation={result.categoria} color={result.color} />

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Interpretación</p>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Sistólica</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{sistolica} <span style={{ fontSize: '12px' }}>mmHg</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Diastólica</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{diastolica} <span style={{ fontSize: '12px' }}>mmHg</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>PP</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: result.color }}>{result.pp} <span style={{ fontSize: '12px' }}>mmHg</span></div>
            </div>
          </div>

          <ShareButtons
            text={`Mi presión de pulso es ${result.pp} mmHg — ${result.categoria}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/presion-pulso"
          />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Rangos de presión de pulso</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {[
            { label: 'Muy baja',    rango: '< 25 mmHg',  color: '#60A5FA' },
            { label: 'Baja',        rango: '25–39 mmHg', color: '#93C5FD' },
            { label: 'Normal',      rango: '40–60 mmHg', color: '#34D399' },
            { label: 'Elevada',     rango: '61–80 mmHg', color: '#FB923C' },
            { label: 'Muy elevada', rango: '> 80 mmHg',  color: '#F87171' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--cream)' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                {r.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>{r.rango}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
