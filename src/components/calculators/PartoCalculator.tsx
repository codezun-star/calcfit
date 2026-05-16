import { useState } from 'react';
import { calcularFechaParto } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function PartoCalculator() {
  const [fechaFUM, setFechaFUM] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularFechaParto> | null>(null);

  const calcular = () => {
    if (!fechaFUM) return;
    setResult(calcularFechaParto(new Date(fechaFUM + 'T00:00:00')));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de última menstruación (FUM)" value={fechaFUM} onChange={setFechaFUM} type="date" />
      <Button onClick={calcular}>Calcular fecha de parto</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Fecha probable de parto</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--acid)', lineHeight: 1.2, textTransform: 'capitalize' }}>{fmt(result.fechaParto)}</div>
            {result.semanasRestantes > 0 && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
                Aproximadamente {result.semanasRestantes} semanas restantes
              </div>
            )}
          </div>
          <ShareButtons text={`Mi fecha probable de parto es el ${fmt(result.fechaParto)}.`} url="https://www.calcfit.com/fecha-parto" />
        </div>
      )}
    </div>
  );
}
