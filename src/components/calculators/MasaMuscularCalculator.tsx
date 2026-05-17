import { useState } from 'react';
import { calcularMasaMuscular } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function MasaMuscularCalculator() {
  const [units,  setUnits]  = useState<'metric' | 'imperial'>('metric');
  const [sexo,   setSexo]   = useState<'hombre' | 'mujer'>('hombre');
  const [peso,   setPeso]   = useState('');
  const [altura, setAltura] = useState('');
  const [edad,   setEdad]   = useState('');
  const [lb,     setLb]     = useState('');
  const [ft,     setFt]     = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularMasaMuscular> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; altura?: string; edad?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg   = units === 'metric' ? parseFloat(peso)   : toKg(parseFloat(lb));
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const edadN    = parseFloat(edad);
    if (isNaN(pesoKg)   || pesoKg < 20 || pesoKg > 300)     errs.peso   = 'Peso entre 20 y 300 kg';
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (isNaN(edadN)    || edadN < 18 || edadN > 100)        errs.edad   = 'Edad entre 18 y 100 años';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularMasaMuscular(pesoKg, alturaCm, edadN, sexo));
  };

  const nivelColor: Record<string, string> = { bajo: '#F87171', normal: '#34D399', alto: '#CAFF00' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

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

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso"   value={peso}   onChange={setPeso}   suffix="kg"  error={errors.peso} />
          <Input label="Altura" value={altura} onChange={setAltura} suffix="cm"  error={errors.altura} />
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

      <Button onClick={calcular}>Calcular masa muscular</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard
            label="Masa muscular estimada"
            value={result.masaMuscularKg}
            unit="kg"
            interpretation={result.categoria}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Índice SMI</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.smi} <span style={{ fontSize: '12px' }}>kg/m²</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>% del peso</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{result.porcentaje}<span style={{ fontSize: '12px' }}>%</span></div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: nivelColor[result.nivel] + '22', borderLeft: `3px solid ${nivelColor[result.nivel]}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.descripcion}
          </div>

          <ShareButtons
            text={`Mi masa muscular esquelética estimada es ${result.masaMuscularKg} kg (${result.categoria}). Calculado con CalcFit:`}
            url="https://www.calcfit.com/masa-muscular"
          />
        </div>
      )}
    </div>
  );
}
