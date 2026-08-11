import { useState } from 'react';
import { calcularPresionArterial } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function PresionArterialCalculator() {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularPresionArterial> | null>(null);
  const [errors, setErrors] = useState<{ sistolica?: string; diastolica?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const sis = parseFloat(sistolica);
    const dia = parseFloat(diastolica);
    if (!sistolica  || isNaN(sis) || sis < 50 || sis > 300) errs.sistolica  = 'Valor entre 50 y 300 mmHg';
    if (!diastolica || isNaN(dia) || dia < 30 || dia > 200) errs.diastolica = 'Valor entre 30 y 200 mmHg';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularPresionArterial(sis, dia));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--ink)', borderLeft: '3px solid var(--acid)', fontSize: '12px', color: '#888', lineHeight: 1.6 }}>
        Mida su presión arterial en reposo, sentado, con el brazo a la altura del corazón. Tome dos mediciones con 1-2 minutos de diferencia.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Presión sistólica (alta)"  value={sistolica}  onChange={setSistolica}  suffix="mmHg" error={errors.sistolica} />
        <Input label="Presión diastólica (baja)" value={diastolica} onChange={setDiastolica} suffix="mmHg" error={errors.diastolica} />
      </div>

      <Button onClick={calcular}>Clasificar presión arterial</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>Clasificación AHA</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: result.color, lineHeight: 1 }}>{sistolica}/{diastolica}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>mmHg</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginTop: '4px' }}>{result.categoria}</div>
          </div>
          <div style={{ padding: '12px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            {result.recomendacion}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Hipotensión',         rango: '< 90 / < 60',   color: '#60A5FA' },
              { label: 'Normal',              rango: '< 120 / < 80',  color: '#34D399' },
              { label: 'Presión elevada',     rango: '120–129 / <80', color: '#CAFF00' },
              { label: 'Hipertensión grado 1',rango: '130–139 / 80–89', color: '#FB923C' },
              { label: 'Hipertensión grado 2',rango: '140–179 / 90–119', color: '#F87171' },
              { label: 'Crisis hipertensiva', rango: '≥180 / ≥120',   color: '#DC2626' },
            ].map(row => (
              <div key={row.label} style={{ background: 'var(--cream)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', flexShrink: 0, background: row.color }} />
                <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>{row.rango}</span>
              </div>
            ))}
          </div>

          <ShareButtons text={`Mi presión arterial es ${sistolica}/${diastolica} mmHg (${result.categoria}). Clasificado en CalcFit:`} url="https://www.calcfit.com/presion-arterial" />
        </div>
      )}
    </div>
  );
}
