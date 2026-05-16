import { useState } from 'react';
import { calcularRiesgoCardiovascular, calcularIMC } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function RiesgoCardiovascularCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo]   = useState<'hombre' | 'mujer'>('hombre');
  const [edad, setEdad]   = useState('');
  const [peso, setPeso]   = useState('');
  const [lb, setLb]       = useState('');
  const [altura, setAltura] = useState('');
  const [ft, setFt]         = useState('');
  const [inches, setInches] = useState('');
  const [sistolica, setSistolica] = useState('');
  const [fumador, setFumador]     = useState(false);
  const [diabetes, setDiabetes]   = useState(false);
  const [antecedentes, setAntecedentes] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calcularRiesgoCardiovascular> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const edadN    = parseInt(edad);
    const pesoKg   = units === 'metric' ? parseFloat(peso)   : toKg(parseFloat(lb));
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const sistN    = parseFloat(sistolica);
    if (isNaN(edadN)    || edadN < 20 || edadN > 79)          errs.edad     = 'Edad entre 20 y 79 años';
    if (isNaN(pesoKg)   || pesoKg < 20 || pesoKg > 300)       errs.peso     = 'Peso entre 20 y 300 kg';
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250)  errs.altura   = 'Altura entre 100 y 250 cm';
    if (isNaN(sistN)    || sistN < 70 || sistN > 250)          errs.sistolica = 'Presión entre 70 y 250 mmHg';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { imc } = calcularIMC(pesoKg, alturaCm);
    setResult(calcularRiesgoCardiovascular({ edad: edadN, sexo, sistolica: sistN, imc, fumador, diabetes, antecedentes }));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'flex', gap: '8px' }}>
        {(['hombre', 'mujer'] as const).map(s => (
          <button key={s} onClick={() => setSexo(s)} style={{ flex: 1, padding: '10px', border: '1px solid', borderColor: sexo === s ? 'var(--ink)' : 'var(--border)', background: sexo === s ? 'var(--ink)' : 'transparent', color: sexo === s ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            {s === 'hombre' ? 'Hombre' : 'Mujer'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" error={errors.edad} />
        {units === 'metric' ? (
          <>
            <Input label="Peso"   value={peso}   onChange={setPeso}   suffix="kg" error={errors.peso} />
            <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
          </>
        ) : (
          <>
            <Input label="Peso"    value={lb}     onChange={setLb}     suffix="lb"   error={errors.peso} />
            <Input label="Pies"    value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
            <Input label="Pulg."   value={inches} onChange={setInches} suffix="pulg" />
          </>
        )}
        <Input label="Presión sistólica" value={sistolica} onChange={setSistolica} suffix="mmHg" error={errors.sistolica} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Factores de riesgo</div>
        {[
          { val: fumador,      set: setFumador,      label: 'Fumador activo' },
          { val: diabetes,     set: setDiabetes,     label: 'Diabetes diagnosticada' },
          { val: antecedentes, set: setAntecedentes, label: 'Antecedentes familiares de enfermedad cardiovascular' },
        ].map(({ val, set, label }) => (
          <button key={label} onClick={() => set(!val)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid', borderColor: val ? 'var(--ink)' : 'var(--border)', background: val ? 'var(--ink)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ width: '14px', height: '14px', border: '1px solid', borderColor: val ? 'var(--acid)' : 'var(--border)', background: val ? 'var(--acid)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {val && <span style={{ width: '6px', height: '6px', background: 'var(--ink)', display: 'block' }} />}
            </span>
            <span style={{ fontSize: '13px', color: val ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-body)' }}>{label}</span>
          </button>
        ))}
      </div>

      <Button onClick={calcular}>Calcular riesgo cardiovascular</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Riesgo a 10 años" value={`${result.riesgo10Anios}%`} unit="" interpretation={result.categoriaNombre} />
          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Bajo',     umbral: '< 5%',  activo: result.categoria === 'bajo',     color: '#34D399' },
              { label: 'Moderado', umbral: '5–10%', activo: result.categoria === 'moderado', color: '#CAFF00' },
              { label: 'Alto',     umbral: '10–20%',activo: result.categoria === 'alto',     color: '#FB923C' },
              { label: 'Muy alto', umbral: '≥ 20%', activo: result.categoria === 'muy_alto', color: '#F87171' },
            ].map(({ label, umbral, activo, color }) => (
              <div key={label} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: activo ? color : 'var(--muted)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: activo ? '#aaa' : 'var(--border)' }}>{umbral}</div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi riesgo cardiovascular a 10 años es ${result.riesgo10Anios}% (${result.categoriaNombre}). CalcFit:`} url="https://www.calcfit.com/riesgo-cardiovascular" />
        </div>
      )}
    </div>
  );
}
