import { useState } from 'react';
import { calcularMasaOsea } from '../../lib/calculators';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { toKg, toCm } from '../../lib/units';

type Sexo = 'hombre' | 'mujer';

export default function MasaOseaCalculator() {
  const [units, setUnits]       = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo]         = useState<Sexo>('hombre');
  const [peso, setPeso]         = useState('');
  const [altura, setAltura]     = useState('');
  const [alturaIn, setAlturaIn] = useState('');
  const [result, setResult]     = useState<ReturnType<typeof calcularMasaOsea> | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const p = parseFloat(peso);
    const a = units === 'metric' ? parseFloat(altura) : 0;
    const aFt = units === 'imperial' ? parseFloat(altura) : 0;
    const aIn = units === 'imperial' ? parseFloat(alturaIn) || 0 : 0;

    if (units === 'metric' ? (isNaN(p) || p < 20 || p > 300) : (isNaN(p) || p < 44 || p > 660))
      errs.peso = units === 'metric' ? 'Entre 20 y 300 kg' : 'Entre 44 y 660 lb';
    if (units === 'metric' && (isNaN(a) || a < 100 || a > 250)) errs.altura = 'Entre 100 y 250 cm';
    if (units === 'imperial' && (isNaN(aFt) || aFt < 3 || aFt > 8)) errs.altura = 'Entre 3 y 8 pies';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const pesoKg = units === 'metric' ? p : toKg(p);
    const altCm  = units === 'metric' ? a : toCm(aFt, aIn);
    setResult(calcularMasaOsea(pesoKg, altCm, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Estimación de masa ósea basada en la fórmula de Kim et al. (2002) validada contra absortometría de rayos X de doble energía (DEXA). Los resultados son una estimación, no un diagnóstico clínico.
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

      <Button onClick={calcular}>Calcular masa ósea</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Masa ósea</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: 'var(--acid)', lineHeight: 1 }}>{result.masaOseaKg}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>kg</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>% corporal</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: '#ccc', lineHeight: 1 }}>{result.porcentajeCorporal}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>%</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — {result.descripcion}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: sexo === 'hombre' ? '< 12%' : '< 10%', cat: 'Baja',   color: '#F87171', activo: result.categoria === 'Baja' },
              { label: sexo === 'hombre' ? '12–16%' : '10–14%', cat: 'Normal', color: '#34D399', activo: result.categoria === 'Normal' },
              { label: sexo === 'hombre' ? '> 16%' : '> 14%', cat: 'Alta',    color: '#60A5FA', activo: result.categoria === 'Alta' },
            ].map(({ label, cat, color, activo }) => (
              <div key={cat} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activo ? color : 'var(--border)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: activo ? '#ccc' : 'var(--muted)' }}>{cat}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi masa ósea estimada es ${result.masaOseaKg} kg (${result.porcentajeCorporal}% del peso corporal) — ${result.categoria}. CalcFit:`}
            url="https://www.calcfit.com/masa-osea"
          />
        </div>
      )}
    </div>
  );
}
