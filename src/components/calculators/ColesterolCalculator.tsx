import { useState } from 'react';
import { calcularColesterol } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function ColesterolCalculator() {
  const [sexo,          setSexo]          = useState<'hombre' | 'mujer'>('hombre');
  const [total,         setTotal]         = useState('');
  const [hdl,           setHdl]           = useState('');
  const [trigliceridos, setTrigliceridos] = useState('');
  const [result,        setResult]        = useState<ReturnType<typeof calcularColesterol> | null>(null);
  const [errors,        setErrors]        = useState<{ total?: string; hdl?: string; tg?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const t = parseFloat(total);
    const h = parseFloat(hdl);
    const tg = parseFloat(trigliceridos);
    if (isNaN(t) || t < 100 || t > 500)  errs.total = 'Colesterol entre 100 y 500 mg/dL';
    if (isNaN(h) || h < 10  || h > 150)  errs.hdl   = 'HDL entre 10 y 150 mg/dL';
    if (isNaN(tg) || tg < 20 || tg > 1000) errs.tg  = 'Triglicéridos entre 20 y 1000 mg/dL';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularColesterol(t, h, tg, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Introduce los valores de tu análisis de sangre. El LDL se calcula con la fórmula de Friedewald (requiere triglicéridos &lt; 400 mg/dL).
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Colesterol total" value={total}         onChange={setTotal}         suffix="mg/dL" error={errors.total} />
        <Input label="HDL"              value={hdl}           onChange={setHdl}           suffix="mg/dL" error={errors.hdl} />
        <Input label="Triglicéridos"    value={trigliceridos} onChange={setTrigliceridos} suffix="mg/dL" error={errors.tg} />
      </div>

      <Button onClick={calcular}>Calcular perfil lipídico</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="LDL calculado" value={result.ldl} unit="mg/dL" interpretation={result.riesgoNombre} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Total', data: result.clasificacion.total },
              { label: 'HDL',   data: result.clasificacion.hdl },
              { label: 'LDL',   data: result.clasificacion.ldl },
              { label: 'TG',    data: result.clasificacion.trigliceridos },
            ].map(({ label, data }) => (
              <div key={label} style={{ background: 'var(--cream)', padding: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', lineHeight: 1 }}>{data.valor}</div>
                <div style={{ fontSize: '10px', color: data.color, marginTop: '4px', fontWeight: 600 }}>{data.categoria}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>No-HDL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.noHdl} <span style={{ fontSize: '12px' }}>mg/dL</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ratio Total/HDL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.ratioTotal}</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi LDL es ${result.ldl} mg/dL (${result.riesgoNombre}). Calculé mi perfil lipídico en CalcFit:`}
            url="https://www.calcfit.com/colesterol"
          />
        </div>
      )}
    </div>
  );
}
