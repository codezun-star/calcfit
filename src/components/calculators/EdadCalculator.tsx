import { useState } from 'react';
import { calcularEdad } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function EdadCalculator() {
  const [fecha, setFecha] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularEdad> | null>(null);

  const calcular = () => {
    if (!fecha) return;
    setResult(calcularEdad(new Date(fecha + 'T00:00:00')));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'long' });

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de nacimiento" value={fecha} onChange={setFecha} type="date" />
      <Button onClick={calcular}>Calcular edad</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Tu edad exacta</div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { val: result.anios, label: 'años' },
                { val: result.meses, label: 'meses' },
                { val: result.dias,  label: 'días' },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{item.val}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666', marginLeft: '4px' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total de días vividos</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)' }}>{result.totalDias.toLocaleString('es')}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Próximo cumpleaños</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{fmt(result.proximoCumple)}</div>
            </div>
          </div>
          <ShareButtons text={`Tengo exactamente ${result.anios} años, ${result.meses} meses y ${result.dias} días.`} url="https://www.calcfit.com/edad" />
        </div>
      )}
    </div>
  );
}
