import { useState } from 'react';
import { calcularComplexionCorporal } from '../../lib/calculators';
import { toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function ComplexionCorporalCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo] = useState<'hombre' | 'mujer'>('hombre');
  const [altura, setAltura] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [muneca, setMuneca] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularComplexionCorporal> | null>(null);
  const [errors, setErrors] = useState<{ altura?: string; muneca?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    const munecaN  = parseFloat(muneca);
    if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    if (isNaN(munecaN)  || munecaN < 10  || munecaN > 30)    errs.muneca = 'Muñeca entre 10 y 30 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularComplexionCorporal(alturaCm, munecaN, sexo));
  };

  const tipoColor: Record<string, string> = {
    pequena: '#60A5FA', mediana: '#34D399', grande: '#FB923C',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Altura"            value={altura}  onChange={setAltura}  suffix="cm" error={errors.altura} />
          <Input label="Circ. muñeca"      value={muneca}  onChange={setMuneca}  suffix="cm" error={errors.muneca} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '20px' }}>
          <Input label="Pies"          value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas"      value={inches} onChange={setInches} suffix="pulg" />
          <Input label="Circ. muñeca" value={muneca}  onChange={setMuneca}  suffix="cm" error={errors.muneca} />
        </div>
      )}

      <div style={{ padding: '10px 12px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Mide la circunferencia de la muñeca con una cinta métrica alrededor de la articulación, entre el hueso y la mano.
      </div>

      <Button onClick={calcular}>Determinar complexión</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Complexión corporal" value={result.tipoNombre} unit="" interpretation={`Índice: ${result.indice}`} />
          <div style={{ padding: '16px', background: tipoColor[result.tipo] + '22', borderLeft: `3px solid ${tipoColor[result.tipo]}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.descripcion}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Pequeña', umbral: sexo === 'hombre' ? '> 10.4' : '> 11.0', activo: result.tipo === 'pequena' },
              { label: 'Mediana', umbral: sexo === 'hombre' ? '9.6 – 10.4' : '10.1 – 11.0', activo: result.tipo === 'mediana' },
              { label: 'Grande',  umbral: sexo === 'hombre' ? '< 9.6' : '< 10.1', activo: result.tipo === 'grande' },
            ].map(({ label, umbral, activo }) => (
              <div key={label} style={{ background: activo ? 'var(--ink)' : 'var(--cream)', padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: activo ? 'var(--acid)' : 'var(--muted)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: activo ? '#aaa' : 'var(--border)' }}>Índice {umbral}</div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi complexión corporal es ${result.tipoNombre} (índice ${result.indice}). Calculado en CalcFit:`} url="https://www.calcfit.com/complexion-corporal" />
        </div>
      )}
    </div>
  );
}
