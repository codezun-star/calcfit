import { useState } from 'react';
import { calcularPesoIdeal } from '../../lib/calculators';
import { toCm, toLb } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

export default function PesoIdealCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [altura, setAltura] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [result, setResult] = useState<ReturnType<typeof calcularPesoIdeal> | null>(null);

  const calcular = () => {
    const alturaCm = units === 'metric' ? parseFloat(altura) : toCm(parseFloat(ft), parseFloat(inches));
    if (isNaN(alturaCm) || alturaCm < 100) return;
    setResult(calcularPesoIdeal(alturaCm, sexo));
  };

  const btnBase: React.CSSProperties = { padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)' };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric' ? (
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Pies" value={ft} onChange={setFt} suffix="pies" />
          <Input label="Pulgadas" value={inches} onChange={setInches} suffix="pulg" />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Sexo</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          <button style={sexo === 'hombre' ? btnActive : btnBase} onClick={() => setSexo('hombre')}>Hombre</button>
          <button style={sexo === 'mujer'  ? btnActive : btnBase} onClick={() => setSexo('mujer')}>Mujer</button>
        </div>
      </div>

      <Button onClick={calcular}>Calcular peso ideal</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Promedio de 5 fórmulas</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.promedio}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>kg{units === 'imperial' && ` · ${toLb(result.promedio)} lb`}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {(['devine', 'robinson', 'miller', 'hamwi', 'broca'] as const).map((f) => (
              <div key={f} style={{ background: 'var(--cream)', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'capitalize', marginBottom: '4px' }}>{f}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>{result[f]}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)' }}>kg</div>
              </div>
            ))}
          </div>

          <ShareButtons text={`Mi peso ideal es ${result.promedio} kg según 5 fórmulas médicas.`} url="https://www.calcfit.com/peso-ideal" />
        </div>
      )}
    </div>
  );
}
