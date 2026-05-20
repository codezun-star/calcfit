import { useState } from 'react';
import { calcularIndiceConicidad } from '../../lib/calculators';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { toKg, toCm } from '../../lib/units';

type Sexo = 'hombre' | 'mujer';

export default function IndiceConicidadCalculator() {
  const [units, setUnits]       = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo]         = useState<Sexo>('hombre');
  const [cintura, setCintura]   = useState('');
  const [peso, setPeso]         = useState('');
  const [altura, setAltura]     = useState('');
  const [alturaIn, setAlturaIn] = useState('');
  const [result, setResult]     = useState<ReturnType<typeof calcularIndiceConicidad> | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const c = parseFloat(cintura);
    const p = parseFloat(peso);
    const a = units === 'metric' ? parseFloat(altura) : 0;
    const aFt = units === 'imperial' ? parseFloat(altura) : 0;
    const aIn = units === 'imperial' ? parseFloat(alturaIn) || 0 : 0;

    if (isNaN(c) || c < 40 || c > 200) errs.cintura = 'Entre 40 y 200 cm';
    if (isNaN(p) || p < 20 || p > 300) errs.peso = units === 'metric' ? 'Entre 20 y 300 kg' : 'Entre 44 y 660 lb';
    if (units === 'metric' && (isNaN(a) || a < 100 || a > 250)) errs.altura = 'Entre 100 y 250 cm';
    if (units === 'imperial' && (isNaN(aFt) || aFt < 3 || aFt > 8)) errs.altura = 'Entre 3 y 8 pies';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const pesoKg = units === 'metric' ? p : toKg(p);
    const altCm  = units === 'metric' ? a : toCm(aFt, aIn);
    setResult(calcularIndiceConicidad(c, pesoKg, altCm, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        El Índice de Conicidad (IC) mide la distribución de grasa corporal. Un valor alto indica forma de tonel (más grasa central), asociada a mayor riesgo cardiovascular.
      </div>

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

      <Input label="Perímetro de cintura" value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
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

      <Button onClick={calcular}>Calcular índice</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.ic}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa' }}>IC</span>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — {result.recomendacion}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: sexo === 'hombre' ? '< 1.25' : '< 1.18', cat: 'Bajo riesgo',     color: '#34D399', activo: result.riesgo === 'bajo' },
              { label: sexo === 'hombre' ? '1.25–1.35' : '1.18–1.28', cat: 'Moderado',  color: '#FB923C', activo: result.riesgo === 'moderado' },
              { label: sexo === 'hombre' ? '> 1.35' : '> 1.28', cat: 'Alto riesgo',     color: '#F87171', activo: result.riesgo === 'alto' },
            ].map(({ label, cat, color, activo }) => (
              <div key={cat} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activo ? color : 'var(--border)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: activo ? '#ccc' : 'var(--muted)' }}>{cat}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi Índice de Conicidad es ${result.ic} (${result.categoria}). Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/indice-conicidad"
          />
        </div>
      )}
    </div>
  );
}
