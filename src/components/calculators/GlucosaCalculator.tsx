import { useState } from 'react';
import { calcularGlucosa, type TipoMedicionGlucosa } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

const TIPOS: { value: TipoMedicionGlucosa; label: string; suffix: string; min: number; max: number; placeholder: string }[] = [
  { value: 'ayunas',        label: 'Glucosa en ayunas',   suffix: 'mg/dL', min: 50,  max: 400, placeholder: 'ej. 95' },
  { value: 'postprandial',  label: 'Glucosa postprandial', suffix: 'mg/dL', min: 50,  max: 600, placeholder: 'ej. 130' },
  { value: 'hba1c',         label: 'Hemoglobina A1c',      suffix: '%',     min: 3.5, max: 15,  placeholder: 'ej. 5.4' },
];

export default function GlucosaCalculator() {
  const [tipo, setTipo]     = useState<TipoMedicionGlucosa>('ayunas');
  const [valor, setValor]   = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularGlucosa> | null>(null);
  const [error, setError]   = useState('');

  const tipoActual = TIPOS.find(t => t.value === tipo)!;

  const calcular = () => {
    const v = parseFloat(valor);
    if (isNaN(v) || v < tipoActual.min || v > tipoActual.max) {
      setError(`Valor entre ${tipoActual.min} y ${tipoActual.max} ${tipoActual.suffix}`);
      return;
    }
    setError('');
    setResult(calcularGlucosa(v, tipo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Introduce el valor de tu análisis de sangre. Para glucosa en ayunas es necesario no haber comido al menos 8 horas.
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {TIPOS.map(t => (
          <button
            key={t.value}
            onClick={() => { setTipo(t.value); setValor(''); setResult(null); setError(''); }}
            style={{
              padding: '7px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)',
              border: '1px solid', borderRadius: '2px', cursor: 'pointer',
              background: tipo === t.value ? 'var(--ink)' : 'transparent',
              color:      tipo === t.value ? 'var(--acid)' : 'var(--muted)',
              borderColor: tipo === t.value ? 'var(--ink)' : 'var(--border)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Input
        label={tipoActual.label}
        value={valor}
        onChange={setValor}
        suffix={tipoActual.suffix}
        error={error}
      />

      <Button onClick={calcular}>Interpretar resultado</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label={tipoActual.label} value={result.valor} unit={tipoActual.suffix} interpretation={result.categoria} />

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {(tipo === 'ayunas'
              ? [{ label: '< 100',    cat: 'Normal',      activo: result.riesgo === 'normal',      color: '#34D399' },
                 { label: '100–125',  cat: 'Prediabetes', activo: result.riesgo === 'prediabetes', color: '#FB923C' },
                 { label: '≥ 126',    cat: 'Diabetes',    activo: result.riesgo === 'diabetes',    color: '#F87171' }]
              : tipo === 'postprandial'
              ? [{ label: '< 140',    cat: 'Normal',      activo: result.riesgo === 'normal',      color: '#34D399' },
                 { label: '140–199',  cat: 'Prediabetes', activo: result.riesgo === 'prediabetes', color: '#FB923C' },
                 { label: '≥ 200',    cat: 'Diabetes',    activo: result.riesgo === 'diabetes',    color: '#F87171' }]
              : [{ label: '< 5.7%',  cat: 'Normal',      activo: result.riesgo === 'normal',      color: '#34D399' },
                 { label: '5.7–6.4%', cat: 'Prediabetes', activo: result.riesgo === 'prediabetes', color: '#FB923C' },
                 { label: '≥ 6.5%',  cat: 'Diabetes',    activo: result.riesgo === 'diabetes',    color: '#F87171' }]
            ).map(({ label, cat, activo, color }) => (
              <div key={label} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activo ? color : 'var(--border)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: activo ? '#ccc' : 'var(--muted)' }}>{cat}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi glucosa ${tipo === 'hba1c' ? 'HbA1c' : tipo === 'ayunas' ? 'en ayunas' : 'postprandial'} es ${result.valor} ${tipoActual.suffix} (${result.categoria}). Lo interpreté con CalcFit:`}
            url="https://www.calcfit.com/glucosa"
          />
        </div>
      )}
    </div>
  );
}
