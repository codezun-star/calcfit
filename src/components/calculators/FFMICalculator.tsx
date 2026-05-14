import { useState } from 'react';
import { calcularFFMI } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function FFMICalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [lb, setLb] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [grasa, setGrasa] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularFFMI> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; altura?: string; grasa?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg   = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const grasaP   = parseFloat(grasa);
    if (isNaN(pesoKg)   || pesoKg < 20 || pesoKg > 300)     errs.peso   = 'Peso entre 20 y 300 kg';
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (!grasa || isNaN(grasaP) || grasaP < 2 || grasaP > 60) errs.grasa = '% grasa entre 2 y 60';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularFFMI(pesoKg, alturaCm, grasaP));
  };

  const nivelColor: Record<string, string> = {
    bajo: '#60A5FA', normal: '#34D399', encima_media: '#CAFF00', atletico: '#FB923C', avanzado: '#F87171',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Peso"   value={peso}   onChange={setPeso}   suffix="kg" error={errors.peso} />
          <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso"     value={lb}     onChange={setLb}     suffix="lb" error={errors.peso} />
          <Input label="Pies"     value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas" value={inches} onChange={setInches} suffix="pulg" />
        </div>
      )}

      <Input label="Porcentaje de grasa corporal" value={grasa} onChange={setGrasa} suffix="%" error={errors.grasa} />

      <Button onClick={calcular}>Calcular FFMI</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="FFMI normalizado" value={result.ffmiNormalizado} unit="" interpretation={result.categoria} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>FFMI sin normalizar</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)' }}>{result.ffmi}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Masa magra</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)' }}>{result.masaMagraKg} <span style={{ fontSize: '13px', fontFamily: 'var(--font-body)' }}>kg</span></div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: nivelColor[result.nivel] + '22', borderLeft: `3px solid ${nivelColor[result.nivel]}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong>{result.categoria}</strong> — El FFMI normalizado permite comparar la masa muscular independientemente de la altura. El límite natural máximo se considera en torno a 25.
          </div>
          <ShareButtons text={`Mi FFMI normalizado es ${result.ffmiNormalizado} (${result.categoria}). Calculado en CalcFit:`} url="https://www.calcfit.com/ffmi" />
        </div>
      )}
    </div>
  );
}
