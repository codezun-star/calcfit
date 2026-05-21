import { useState } from 'react';
import { calcularOximetria } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function OximetriaCalculator() {
  const [spo2,    setSpo2]    = useState('');
  const [altitud, setAltitud] = useState('0');
  const [result,  setResult]  = useState<ReturnType<typeof calcularOximetria> | null>(null);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const s = parseFloat(spo2);
    const a = parseFloat(altitud);
    if (isNaN(s) || s < 50 || s > 100) errs.spo2    = 'SpO2 entre 50 y 100%';
    if (isNaN(a) || a < 0 || a > 9000) errs.altitud = 'Altitud entre 0 y 9000 m';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularOximetria(s, a));
  };

  const NIVELES = [
    { label: '≥ 95%',   desc: 'Normal',         color: '#34D399' },
    { label: '91–94%',  desc: 'Hipoxia leve',   color: '#CAFF00' },
    { label: '86–90%',  desc: 'Moderada',        color: '#FB923C' },
    { label: '< 86%',   desc: 'Grave',           color: '#F87171' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        La oximetría de pulso (SpO2) mide el porcentaje de hemoglobina saturada con oxígeno en sangre. A mayor altitud el valor esperado es menor.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="SpO2 medido"       value={spo2}    onChange={setSpo2}    suffix="%" error={errors.spo2} />
        <Input label="Altitud (opcional)" value={altitud} onChange={setAltitud} suffix="m" error={errors.altitud} />
      </div>

      <Button onClick={calcular}>Interpretar SpO2</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Tu SpO2</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{spo2}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa', marginLeft: '4px' }}>%</span>
            </div>
            {parseFloat(altitud) > 2500 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>SpO2 esperado a {altitud} m</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: '#888', lineHeight: 1 }}>{result.spo2AjustadoAltitud}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginLeft: '4px' }}>%</span>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — {result.recomendacion}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {NIVELES.map(n => (
              <div key={n.label} style={{ background: 'var(--cream)', padding: '10px 12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: n.color, fontWeight: 700, marginBottom: '2px' }}>{n.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{n.desc}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi SpO2 es ${spo2}% (${result.categoria}). Interpreta tu saturación de oxígeno en CalcFit:`}
            url="https://www.calcfit.com/oximetria"
          />
        </div>
      )}
    </div>
  );
}
