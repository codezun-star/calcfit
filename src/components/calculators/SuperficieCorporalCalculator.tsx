import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularSuperficieCorporal } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SuperficieCorporalCalculator() {
  const [peso, setPeso]   = useState('70');
  const [altura, setAltura] = useState('170');
  const [res, setRes]     = useState<ReturnType<typeof calcularSuperficieCorporal> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const p = parseFloat(peso), a = parseFloat(altura);
    if (!p || p < 2 || p > 300) { setError('Introduce un peso entre 2 y 300 kg'); return; }
    if (!a || a < 40 || a > 230) { setError('Introduce una altura entre 40 y 230 cm'); return; }
    setError('');
    setRes(calcularSuperficieCorporal(p, a));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular superficie corporal</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Superficie corporal (Mosteller)</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.mosteller}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>m² · DuBois {res.duBois} m² · promedio {res.promedio} m²</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              La superficie corporal (BSA) se usa para ajustar dosis de medicamentos, quimioterapia e índices cardíacos. El valor medio en adultos ronda los 1,7 m².
            </p>
          </div>
          <ShareButtons text={`Mi superficie corporal es ${res.mosteller} m² (Mosteller). Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/superficie-corporal" />
        </div>
      )}
    </div>
  );
}
