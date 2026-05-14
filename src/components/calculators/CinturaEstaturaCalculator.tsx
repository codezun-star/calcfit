import { useState } from 'react';
import { calcularCinturaEstatura } from '../../lib/calculators';
import { toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function CinturaEstaturaCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [cintura, setCintura] = useState('');
  const [altura, setAltura] = useState('');
  const [cinturaIn, setCinturaIn] = useState('');
  const [ft, setFt] = useState('');
  const [inchesH, setInchesH] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularCinturaEstatura> | null>(null);
  const [errors, setErrors] = useState<{ cintura?: string; altura?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const cinturaCm = units === 'metric' ? parseFloat(cintura) : parseFloat(cinturaIn) * 2.54;
    const alturaCm  = units === 'metric' ? parseFloat(altura)  : toCm(parseFloat(ft), parseFloat(inchesH));
    if (isNaN(cinturaCm) || cinturaCm < 40 || cinturaCm > 200) errs.cintura = 'Cintura entre 40 y 200 cm';
    if (isNaN(alturaCm)  || alturaCm < 100 || alturaCm > 250)  errs.altura  = 'Altura entre 100 y 250 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCinturaEstatura(cinturaCm, alturaCm));
  };

  const riesgoColor: Record<string, string> = {
    bajo: '#60A5FA', saludable: '#34D399', sobrepeso: '#FB923C', obeso: '#F87171',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Cintura" value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
          <Input label="Altura"  value={altura}  onChange={setAltura}  suffix="cm" error={errors.altura} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Cintura"   value={cinturaIn} onChange={setCinturaIn} suffix="pulg"  error={errors.cintura} />
          <Input label="Pies"      value={ft}        onChange={setFt}        suffix="pies"  error={errors.altura} />
          <Input label="Pulgadas"  value={inchesH}   onChange={setInchesH}  suffix="pulg" />
        </div>
      )}

      <Button onClick={calcular}>Calcular índice</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Índice cintura-estatura" value={result.ratio} unit="" interpretation={result.categoria} />
          <div style={{ padding: '12px 16px', background: riesgoColor[result.riesgo] + '22', borderLeft: `3px solid ${riesgoColor[result.riesgo]}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong>{result.categoria}</strong> — {result.recomendacion}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Bajo peso',  rango: '< 0.40', color: '#60A5FA' },
              { label: 'Saludable',  rango: '0.40 – 0.50', color: '#34D399' },
              { label: 'Sobrepeso',  rango: '0.50 – 0.60', color: '#FB923C' },
              { label: 'Obesidad',   rango: '> 0.60', color: '#F87171' },
            ].map(row => (
              <div key={row.label} style={{ background: 'var(--cream)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', flexShrink: 0, background: row.color }} />
                <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>{row.rango}</span>
              </div>
            ))}
          </div>

          <ShareButtons text={`Mi índice cintura-estatura es ${result.ratio} (${result.categoria}). Calculado en CalcFit:`} url="https://www.calcfit.com/cintura-estatura" />
        </div>
      )}
    </div>
  );
}
