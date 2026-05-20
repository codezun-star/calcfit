import { useState } from 'react';
import { calcularFMIConSexo } from '../../lib/calculators';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { toKg, toCm } from '../../lib/units';

type Sexo = 'hombre' | 'mujer';

export default function IndiceMasaGrasaCalculator() {
  const [units, setUnits]       = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo]         = useState<Sexo>('hombre');
  const [peso, setPeso]         = useState('');
  const [altura, setAltura]     = useState('');
  const [alturaIn, setAlturaIn] = useState('');
  const [grasa, setGrasa]       = useState('');
  const [result, setResult]     = useState<ReturnType<typeof calcularFMIConSexo> | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const p = parseFloat(peso);
    const a = units === 'metric' ? parseFloat(altura) : 0;
    const aFt = units === 'imperial' ? parseFloat(altura) : 0;
    const aIn = units === 'imperial' ? parseFloat(alturaIn) || 0 : 0;
    const g = parseFloat(grasa);

    if (isNaN(p) || p < 20 || p > 300) errs.peso = units === 'metric' ? 'Entre 20 y 300 kg' : 'Entre 44 y 660 lb';
    if (units === 'metric' && (isNaN(a) || a < 100 || a > 250)) errs.altura = 'Entre 100 y 250 cm';
    if (units === 'imperial' && (isNaN(aFt) || aFt < 3 || aFt > 8)) errs.altura = 'Entre 3 y 8 pies';
    if (isNaN(g) || g < 1 || g > 70) errs.grasa = 'Entre 1 y 70%';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const pesoKg  = units === 'metric' ? p : toKg(p);
    const altCm   = units === 'metric' ? a : toCm(aFt, aIn);
    setResult(calcularFMIConSexo(pesoKg, altCm, g, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo biológico</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['hombre', 'mujer'] as Sexo[]).map(s => (
            <button
              key={s}
              onClick={() => setSexo(s)}
              style={{
                flex: 1, padding: '10px', border: '1px solid', borderRadius: '2px', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                background: sexo === s ? 'var(--ink)' : 'transparent',
                color:      sexo === s ? 'var(--acid)' : 'var(--muted)',
                borderColor: sexo === s ? 'var(--ink)' : 'var(--border)',
              }}
            >
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <Input label="Peso" value={peso} onChange={setPeso} suffix={units === 'metric' ? 'kg' : 'lb'} error={errors.peso} />
      {units === 'metric'
        ? <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Altura (pies)" value={altura}   onChange={setAltura}   suffix="pies" error={errors.altura} />
            <Input label="Pulgadas"      value={alturaIn} onChange={setAlturaIn} suffix="pulg" />
          </div>
        )
      }
      <Input label="Porcentaje de grasa corporal" value={grasa} onChange={setGrasa} suffix="%" error={errors.grasa} />

      <Button onClick={calcular}>Calcular FMI</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>FMI</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: 'var(--acid)', lineHeight: 1 }}>{result.fmi}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa' }}>kg/m²</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Masa grasa</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: '#ccc', lineHeight: 1 }}>{result.masaGrasaKg}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa' }}>kg</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — {result.descripcion}
          </div>

          <ShareButtons
            text={`Mi FMI (Índice de Masa Grasa) es ${result.fmi} kg/m² — categoría: ${result.categoria}. Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/indice-masa-grasa"
          />
        </div>
      )}
    </div>
  );
}
