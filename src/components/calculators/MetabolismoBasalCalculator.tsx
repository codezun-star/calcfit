import { useState } from 'react';
import { calcularMetabolismoBasal } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function MetabolismoBasalCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo] = useState<'hombre' | 'mujer'>('hombre');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [lb, setLb] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [edad, setEdad] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularMetabolismoBasal> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; altura?: string; edad?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg   = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const edadN    = parseInt(edad);
    if (isNaN(pesoKg)   || pesoKg < 20 || pesoKg > 300)     errs.peso   = 'Peso entre 20 y 300 kg';
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (isNaN(edadN)    || edadN < 10 || edadN > 100)        errs.edad   = 'Edad entre 10 y 100 años';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularMetabolismoBasal(pesoKg, alturaCm, edadN, sexo));
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

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
          <Input label="Peso"   value={peso}   onChange={setPeso}   suffix="kg" error={errors.peso} />
          <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
          <Input label="Edad"   value={edad}   onChange={setEdad}   suffix="años" error={errors.edad} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso"     value={lb}     onChange={setLb}     suffix="lb"   error={errors.peso} />
          <Input label="Pies"     value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas" value={inches} onChange={setInches} suffix="pulg" />
          <Input label="Edad"     value={edad}   onChange={setEdad}   suffix="años" error={errors.edad} />
        </div>
      )}

      <Button onClick={calcular}>Calcular metabolismo basal</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="TMB promedio" value={result.promedio} unit="kcal/día" interpretation={result.categoria} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Mifflin-St Jeor', val: result.mifflin, nota: 'Más precisa' },
              { label: 'Harris-Benedict', val: result.harris,  nota: 'Revisada 1984' },
              { label: 'Schofield',       val: result.schofield, nota: 'OMS' },
            ].map(({ label, val, nota }) => (
              <div key={label} style={{ background: 'var(--cream)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border)', marginBottom: '6px' }}>{nota}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{val} <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)' }}>kcal</span></div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 16px', background: '#CAFF0022', borderLeft: '3px solid var(--acid)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            La TMB es el gasto calórico en reposo total. Para calcular tus calorías totales (TDEE), multiplica por tu factor de actividad: sedentario ×1.2, ligero ×1.375, moderado ×1.55, activo ×1.725.
          </div>
          <ShareButtons text={`Mi metabolismo basal (TMB) es ${result.promedio} kcal/día. Calculado en CalcFit:`} url="https://www.calcfit.com/metabolismo-basal" />
        </div>
      )}
    </div>
  );
}
