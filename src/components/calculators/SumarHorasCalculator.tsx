import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularSumaHoras } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SumarHorasCalculator() {
  const [h1, setH1] = useState('2');
  const [m1, setM1] = useState('30');
  const [op, setOp] = useState<'sumar' | 'restar'>('sumar');
  const [h2, setH2] = useState('1');
  const [m2, setM2] = useState('45');
  const [res, setRes] = useState<ReturnType<typeof calcularSumaHoras> | null>(null);

  function calcular() {
    setRes(calcularSumaHoras(parseInt(h1) || 0, parseInt(m1) || 0, op, parseInt(h2) || 0, parseInt(m2) || 0));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Horas (1)" value={h1} onChange={setH1} suffix="h" type="number" />
        <Input label="Minutos (1)" value={m1} onChange={setM1} suffix="min" type="number" />
      </div>
      <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
        <button onClick={() => setOp('sumar')} style={seg(op === 'sumar')}>Sumar (+)</button>
        <button onClick={() => setOp('restar')} style={seg(op === 'restar')}>Restar (−)</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Horas (2)" value={h2} onChange={setH2} suffix="h" type="number" />
        <Input label="Minutos (2)" value={m2} onChange={setM2} suffix="min" type="number" />
      </div>
      <Button onClick={calcular}>Calcular</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Resultado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.texto}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{res.totalMin} minutos en total</div>
          </div>
          <ShareButtons text={`El resultado es ${res.texto}. Suma y resta horas en CalcFit:`} url="https://www.calcfit.com/sumar-horas" />
        </div>
      )}
    </div>
  );
}
