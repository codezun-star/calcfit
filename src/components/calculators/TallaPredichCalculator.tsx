import { useState } from 'react';
import { calcularTallaPredicha } from '../../lib/calculators';
import { toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function TallaPredichCalculator() {
  const [units,    setUnits]    = useState<'metric' | 'imperial'>('metric');
  const [sexo,     setSexo]     = useState<'hombre' | 'mujer'>('hombre');
  const [padreCm,  setPadreCm]  = useState('');
  const [madreCm,  setMadreCm]  = useState('');
  const [padreFt,  setPadreFt]  = useState('');
  const [padreIn,  setPadreIn]  = useState('');
  const [madreFt,  setMadreFt]  = useState('');
  const [madreIn,  setMadreIn]  = useState('');
  const [result,   setResult]   = useState<ReturnType<typeof calcularTallaPredicha> | null>(null);
  const [errors,   setErrors]   = useState<{ padre?: string; madre?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const padreC = units === 'metric' ? parseFloat(padreCm) : toCm(parseFloat(padreFt), parseFloat(padreIn));
    const madreC = units === 'metric' ? parseFloat(madreCm) : toCm(parseFloat(madreFt), parseFloat(madreIn));
    if (isNaN(padreC) || padreC < 130 || padreC > 230) errs.padre = 'Altura del padre entre 130 y 230 cm';
    if (isNaN(madreC) || madreC < 120 || madreC > 210) errs.madre = 'Altura de la madre entre 120 y 210 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularTallaPredicha(padreC, madreC, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Sexo del hijo/a</p>
        <div style={{ display: 'flex', gap: '1px', background: 'var(--border)' }}>
          {(['hombre', 'mujer'] as const).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', background: sexo === s ? 'var(--ink)' : 'var(--cream)', color: sexo === s ? 'white' : 'var(--ink)' }}>
              {s === 'hombre' ? 'Niño' : 'Niña'}
            </button>
          ))}
        </div>
      </div>

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Altura del padre" value={padreCm} onChange={setPadreCm} suffix="cm" error={errors.padre} />
          <Input label="Altura de la madre" value={madreCm} onChange={setMadreCm} suffix="cm" error={errors.madre} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Padre (pies)" value={padreFt} onChange={setPadreFt} suffix="pies" error={errors.padre} />
          <Input label="Padre (pulg)" value={padreIn} onChange={setPadreIn} suffix="pulg" />
          <Input label="Madre (pies)" value={madreFt} onChange={setMadreFt} suffix="pies" error={errors.madre} />
          <Input label="Madre (pulg)" value={madreIn} onChange={setMadreIn} suffix="pulg" />
        </div>
      )}

      <Button onClick={calcular}>Calcular talla predicha</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'var(--ink)', padding: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Talla adulta estimada</p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{result.tallaPredichaCm}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#999', marginTop: '4px' }}>
              cm &nbsp;·&nbsp; {result.tallaPredichaPies}' {result.tallaPredichaPulg}"
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rango mínimo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.rangoMinCm} <span style={{ fontSize: '12px' }}>cm</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rango máximo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.rangoMaxCm} <span style={{ fontSize: '12px' }}>cm</span></div>
            </div>
          </div>

          <div style={{ background: 'var(--cream)', padding: '14px', borderLeft: '3px solid var(--border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Fórmula mid-parental height (Tanner). El 95 % de los niños crecen dentro de ±8.5 cm de esta predicción. La talla real depende también de nutrición, salud y otros factores ambientales.
            </p>
          </div>

          <ShareButtons
            text={`La talla adulta predicha es ${result.tallaPredichaCm} cm (rango ${result.rangoMinCm}–${result.rangoMaxCm} cm). Calculado con CalcFit:`}
            url="https://www.calcfit.com/talla-predicha"
          />
        </div>
      )}
    </div>
  );
}
