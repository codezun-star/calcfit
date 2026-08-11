import { useState } from 'react';
import { calcularHOMAIR } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function ResistenciaInsulinaCalculator() {
  const [glucosa, setGlucosa]   = useState('');
  const [insulina, setInsulina] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularHOMAIR> | null>(null);
  const [errors, setErrors] = useState<{ glucosa?: string; insulina?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const g = parseFloat(glucosa);
    const i = parseFloat(insulina);
    if (isNaN(g) || g < 50 || g > 500)   errs.glucosa  = 'Glucosa entre 50 y 500 mg/dL';
    if (isNaN(i) || i < 0.5 || i > 300)  errs.insulina = 'Insulina entre 0.5 y 300 μU/mL';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularHOMAIR(g, i));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Introduce los valores de tu análisis de sangre en ayunas (mínimo 8 horas sin comer). Los datos son procesados localmente — no se envían a ningún servidor.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
        <Input label="Glucosa en ayunas"  value={glucosa}  onChange={setGlucosa}  suffix="mg/dL" error={errors.glucosa} />
        <Input label="Insulina en ayunas" value={insulina} onChange={setInsulina} suffix="μU/mL" error={errors.insulina} />
      </div>

      <Button onClick={calcular}>Calcular HOMA-IR</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Índice HOMA-IR" value={result.homaIR} unit="" interpretation={result.categoria} />
          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.descripcion}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: '< 1.0',  cat: 'Alta sensibilidad', activo: result.riesgo === 'sensible',   color: '#34D399' },
              { label: '1.0–2.0', cat: 'Normal',            activo: result.riesgo === 'normal',     color: '#CAFF00' },
              { label: '2.0–3.0', cat: 'En límite',         activo: result.riesgo === 'limite',     color: '#FB923C' },
              { label: '≥ 3.0',  cat: 'Resistencia',        activo: result.riesgo === 'resistente', color: '#F87171' },
            ].map(({ label, cat, activo, color }) => (
              <div key={label} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activo ? color : 'var(--border)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: activo ? '#ccc' : 'var(--muted)' }}>{cat}</div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi índice HOMA-IR es ${result.homaIR} (${result.categoria}). Calculado en CalcFit:`} url="https://www.calcfit.com/resistencia-insulina" />
        </div>
      )}
    </div>
  );
}
