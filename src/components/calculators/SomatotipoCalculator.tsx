import { useState } from 'react';
import { calcularSomatotipo } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function SomatotipoCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo] = useState<'hombre' | 'mujer'>('hombre');
  const [peso, setPeso]     = useState('');
  const [lb, setLb]         = useState('');
  const [altura, setAltura] = useState('');
  const [ft, setFt]         = useState('');
  const [inches, setInches] = useState('');
  const [muneca, setMuneca] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularSomatotipo> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const pesoKg   = units === 'metric' ? parseFloat(peso)   : toKg(parseFloat(lb));
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const munecaN  = parseFloat(muneca);
    if (isNaN(pesoKg)   || pesoKg < 20 || pesoKg > 300)     errs.peso   = 'Peso entre 20 y 300 kg';
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (isNaN(munecaN)  || munecaN < 10  || munecaN > 30)    errs.muneca = 'Muñeca entre 10 y 30 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularSomatotipo(pesoKg, alturaCm, munecaN, sexo));
  };

  const tipoColor: Record<string, string> = {
    ectomorfo: '#60A5FA', mesomorfo: '#34D399', endomorfo: '#FB923C',
    ecto_meso: '#34D399', endo_meso: '#FB923C',
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
          <Input label="Peso"          value={peso}   onChange={setPeso}   suffix="kg" error={errors.peso} />
          <Input label="Altura"        value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
          <Input label="Circ. muñeca" value={muneca} onChange={setMuneca} suffix="cm" error={errors.muneca} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso"          value={lb}     onChange={setLb}     suffix="lb"   error={errors.peso} />
          <Input label="Pies"          value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas"      value={inches} onChange={setInches} suffix="pulg" />
          <Input label="Circ. muñeca" value={muneca} onChange={setMuneca} suffix="cm"   error={errors.muneca} />
        </div>
      )}

      <Button onClick={calcular}>Calcular somatotipo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Somatotipo" value={result.tipoNombre} unit="" interpretation={result.descripcion} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {[
              { label: 'Ectomorfo', val: result.puntaje.ecto, color: '#60A5FA' },
              { label: 'Mesomorfo', val: result.puntaje.meso, color: '#34D399' },
              { label: 'Endomorfo', val: result.puntaje.endo, color: '#FB923C' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                <div style={{ height: '80px', background: 'var(--border)', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${Math.round(val * 100)}%`, background: color, transition: 'height 0.4s ease' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', marginTop: '4px' }}>{Math.round(val * 100)}%</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Dieta recomendada</div>
              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>{result.recomendaciones.dieta}</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Entrenamiento recomendado</div>
              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>{result.recomendaciones.entreno}</p>
            </div>
          </div>
          <ShareButtons text={`Mi somatotipo es ${result.tipoNombre}. Calculado en CalcFit:`} url="https://www.calcfit.com/somatotipo" />
        </div>
      )}
    </div>
  );
}
