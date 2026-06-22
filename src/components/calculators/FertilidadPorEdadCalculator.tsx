import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularFertilidadPorEdad } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function FertilidadPorEdadCalculator() {
  const [edad, setEdad] = useState('32');
  const [res, setRes]   = useState<ReturnType<typeof calcularFertilidadPorEdad> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const e = parseFloat(edad);
    if (isNaN(e) || e < 15 || e > 55) { setError('Introduce una edad válida (15–55 años)'); return; }
    setError('');
    setRes(calcularFertilidadPorEdad(e));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Edad de la mujer" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Estimar fertilidad</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Por ciclo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.probabilidadCiclo}%</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>de concebir cada mes</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>En 1 año</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.probabilidadAnual}%</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>reserva: {res.reserva}</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`A mi edad, la probabilidad de concebir es del ${res.probabilidadCiclo}% por ciclo. Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/fertilidad-por-edad" />
        </div>
      )}
    </div>
  );
}
