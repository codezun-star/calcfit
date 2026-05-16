import { useState } from 'react';
import { calcularProteinasDiarias } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Nivel = 'sedentario' | 'amateur' | 'atleta';

export default function ProteinasCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [nivel, setNivel] = useState<Nivel>('amateur');
  const [result, setResult] = useState<ReturnType<typeof calcularProteinasDiarias> | null>(null);

  const calcular = () => {
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    if (isNaN(pesoKg) || pesoKg < 20) return;
    setResult(calcularProteinasDiarias({ pesoKg, nivel }));
  };

  const btnBase: React.CSSProperties = { padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)' };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };

  const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));

  const equivalencias = result ? [
    { alimento: 'Pechugas de pollo (120g c/u)', cantidad: Math.round(result.optimo / 31) },
    { alimento: 'Huevos enteros (6g c/u)',       cantidad: Math.round(result.optimo / 6)  },
    { alimento: 'Atún en lata (25g/lata)',        cantidad: Math.round(result.optimo / 25) },
  ] : [];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />
      {units === 'metric'
        ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" />
        : <Input label="Peso" value={lb} onChange={setLb} suffix="lb" />
      }
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Nivel de actividad</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          {([
            { key: 'sedentario', label: 'Sedentario' },
            { key: 'amateur',    label: 'Deportista' },
            { key: 'atleta',     label: 'Atleta' },
          ] as const).map((n) => (
            <button key={n.key} style={nivel === n.key ? btnActive : btnBase} onClick={() => setNivel(n.key)}>
              {n.label}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={calcular}>Calcular proteínas</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Mínimo</div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: '#888', lineHeight: 1 }}>{result.minimo}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#999', marginLeft: '4px' }}>g/día</span>
              </div>
            </div>
            <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Óptimo</div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{result.optimo}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginLeft: '4px' }}>g/día</span>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {result.optimo}g equivale a…
            </div>
            {equivalencias.map((eq) => (
              <div key={eq.alimento} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{eq.alimento}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>{eq.cantidad}</span>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Necesito entre ${result.minimo}g y ${result.optimo}g de proteína al día.`}
            url="https://www.calcfit.com/proteinas"
          />
        </div>
      )}
    </div>
  );
}
