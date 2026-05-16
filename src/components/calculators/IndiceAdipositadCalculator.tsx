import { useState } from 'react';
import { calcularBAI } from '../../lib/calculators';
import { toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function IndiceAdipositadCalculator() {
  const [units, setUnits]   = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo]     = useState<'hombre' | 'mujer'>('hombre');
  const [altura, setAltura] = useState('');
  const [cadera, setCadera] = useState('');
  const [ft, setFt]         = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularBAI> | null>(null);
  const [errors, setErrors] = useState<{ altura?: string; cadera?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const caderaN  = parseFloat(cadera);
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (isNaN(caderaN)  || caderaN < 50   || caderaN > 200)  errs.cadera = 'Cadera entre 50 y 200 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularBAI(alturaCm, caderaN, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'flex', gap: '8px' }}>
        {(['hombre', 'mujer'] as const).map(s => (
          <button key={s} onClick={() => setSexo(s)} style={{ flex: 1, padding: '10px', border: '1px solid', borderColor: sexo === s ? 'var(--ink)' : 'var(--border)', background: sexo === s ? 'var(--ink)' : 'transparent', color: sexo === s ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            {s === 'hombre' ? 'Hombre' : 'Mujer'}
          </button>
        ))}
      </div>

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Altura"           value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
          <Input label="Circ. de cadera" value={cadera} onChange={setCadera} suffix="cm" error={errors.cadera} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '20px' }}>
          <Input label="Pies"             value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas"         value={inches} onChange={setInches} suffix="pulg" />
          <Input label="Circ. de cadera" value={cadera} onChange={setCadera} suffix="cm"   error={errors.cadera} />
        </div>
      )}

      <div style={{ padding: '10px 12px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Mide la cadera en su punto más ancho, con la cinta métrica horizontal y paralela al suelo.
      </div>

      <Button onClick={calcular}>Calcular índice BAI</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Índice BAI" value={result.bai} unit="" interpretation={result.categoria} />
          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — El BAI estima la grasa corporal a partir de la cadera y la altura sin necesidad de peso. Formula: (Cadera / Altura<sup>1.5</sup>) − 18.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {(sexo === 'hombre'
              ? [{ l: 'Bajo peso', r: '< 8', a: result.riesgo === 'bajo' },      { l: 'Normal', r: '8–21', a: result.riesgo === 'normal' },    { l: 'Sobrepeso', r: '21–26', a: result.riesgo === 'sobrepeso' }, { l: 'Obesidad', r: '> 26', a: result.riesgo === 'obeso' }]
              : [{ l: 'Bajo peso', r: '< 21', a: result.riesgo === 'bajo' },     { l: 'Normal', r: '21–33', a: result.riesgo === 'normal' },   { l: 'Sobrepeso', r: '33–39', a: result.riesgo === 'sobrepeso' }, { l: 'Obesidad', r: '> 39', a: result.riesgo === 'obeso' }]
            ).map(({ l, r, a }) => (
              <div key={l} style={{ background: a ? 'var(--ink)' : 'var(--cream)', padding: '12px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: a ? 'var(--acid)' : 'var(--muted)', marginBottom: '2px' }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: a ? '#aaa' : 'var(--border)' }}>{r}</div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi índice BAI es ${result.bai} (${result.categoria}). Calculado en CalcFit:`} url="https://www.calcfit.com/indice-adiposidad" />
        </div>
      )}
    </div>
  );
}
