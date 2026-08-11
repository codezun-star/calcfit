import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularSalDiaria } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SalDiariaCalculator() {
  const [sal, setSal]     = useState('8');
  const [res, setRes]     = useState<ReturnType<typeof calcularSalDiaria> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const s = parseFloat(sal);
    if (isNaN(s) || s < 0 || s > 60) { setError('Introduce los gramos de sal (0–60 g)'); return; }
    setError('');
    setRes(calcularSalDiaria(s));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '240px' }}>
        <Input label="Sal que consumes al día" value={sal} onChange={setSal} suffix="g" type="number" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        Si no lo sabes con exactitud, la media en muchos países está entre 8 y 12 g/día.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Comparar con la OMS</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>% del límite OMS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: res.porcentaje > 100 ? '#f87171' : 'var(--acid)', lineHeight: 1 }}>{res.porcentaje}%</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>límite: 5 g de sal/día</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Sodio</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.sodioConsumidoMg}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>mg · límite 2000 mg</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`Consumo el ${res.porcentaje}% del límite de sal de la OMS. Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/sal-diaria" />
        </div>
      )}
    </div>
  );
}
