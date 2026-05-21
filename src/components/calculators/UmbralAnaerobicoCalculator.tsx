import { useState } from 'react';
import { calcularUmbralAnaerobico } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function UmbralAnaerobicoCalculator() {
  const [edad,     setEdad]     = useState('');
  const [fcReposo, setFcReposo] = useState('');
  const [fcMax,    setFcMax]    = useState('');
  const [result,   setResult]   = useState<ReturnType<typeof calcularUmbralAnaerobico> | null>(null);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const e  = parseFloat(edad);
    const fc = parseFloat(fcReposo);
    const fm = fcMax !== '' ? parseFloat(fcMax) : undefined;

    if (isNaN(e)  || e  < 15 || e  > 100) errs.edad     = 'Entre 15 y 100 años';
    if (isNaN(fc) || fc < 30 || fc > 100) errs.fcReposo = 'Entre 30 y 100 ppm';
    if (fm !== undefined && (isNaN(fm) || fm < 100 || fm > 230)) errs.fcMax = 'Entre 100 y 230 ppm';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularUmbralAnaerobico(e, fc, fm));
  };

  const ZONAS = [
    { nombre: 'Recuperación',  pct: '60–70%', color: '#60A5FA' },
    { nombre: 'Aeróbico base', pct: '70–80%', color: '#34D399' },
    { nombre: 'Umbral aeróbico', pct: '80–87%', color: '#CAFF00' },
    { nombre: 'Umbral anaeróbico', pct: '87–93%', color: '#FB923C' },
    { nombre: 'VO₂ máx',      pct: '93–100%', color: '#F87171' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        El umbral anaeróbico es la intensidad a partir de la cual el lactato se acumula más rápido de lo que el cuerpo lo elimina. Se estima con la fórmula de Karvonen al 87% de la FC máx.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Edad"            value={edad}     onChange={setEdad}     suffix="años" error={errors.edad} />
        <Input label="FC en reposo"    value={fcReposo} onChange={setFcReposo} suffix="ppm"  error={errors.fcReposo} />
        <Input label="FC máx (opc.)"  value={fcMax}    onChange={setFcMax}    suffix="ppm"  error={errors.fcMax} />
      </div>

      <Button onClick={calcular}>Calcular umbral</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>FC umbral anaeróbico</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.fcUmbral}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa', marginLeft: '6px' }}>ppm</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Rango</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#FB923C', lineHeight: 1 }}>
                {result.fcUmbralMin}–{result.fcUmbralMax}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginLeft: '4px' }}>ppm</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>FC máx usada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.fcMaxUsada} ppm</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>% FC máx</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.porcentajeFCmax}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ZONAS.map(z => (
              <div key={z.nombre} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--cream)', borderLeft: `3px solid ${z.color}` }}>
                <div style={{ flex: 1, fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>{z.nombre}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: z.color }}>{z.pct}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi umbral anaeróbico está en ${result.fcUmbral} ppm (${result.porcentajeFCmax}% FC máx). Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/umbral-anaerobico"
          />
        </div>
      )}
    </div>
  );
}
