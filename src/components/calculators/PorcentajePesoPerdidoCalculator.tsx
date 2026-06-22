import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularPorcentajePesoPerdido } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function PorcentajePesoPerdidoCalculator() {
  const [inicial, setInicial] = useState('80');
  const [actual, setActual]   = useState('74');
  const [res, setRes]         = useState<ReturnType<typeof calcularPorcentajePesoPerdido> | null>(null);
  const [error, setError]     = useState('');

  function calcular() {
    const i = parseFloat(inicial), a = parseFloat(actual);
    if (!i || i < 25 || i > 400) { setError('Introduce un peso inicial válido (25–400 kg)'); return; }
    if (!a || a < 25 || a > 400) { setError('Introduce un peso actual válido (25–400 kg)'); return; }
    setError('');
    setRes(calcularPorcentajePesoPerdido(i, a));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso inicial" value={inicial} onChange={setInicial} suffix="kg" type="number" />
        <Input label="Peso actual" value={actual} onChange={setActual} suffix="kg" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular porcentaje</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{res.gano ? 'Peso ganado' : 'Peso perdido'}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{Math.abs(res.porcentaje)}%</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{Math.abs(res.diferenciaKg)} kg de tu peso inicial</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`He cambiado un ${Math.abs(res.porcentaje)}% de mi peso (${Math.abs(res.diferenciaKg)} kg). Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/porcentaje-peso-perdido" />
        </div>
      )}
    </div>
  );
}
