import { useState } from 'react';
import { calcularDiasFechas } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function DiasFechasCalculator() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularDiasFechas> | null>(null);

  const calcular = () => {
    if (!fechaInicio || !fechaFin) return;
    setResult(calcularDiasFechas(new Date(fechaInicio + 'T00:00:00'), new Date(fechaFin + 'T00:00:00')));
  };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Input label="Fecha de inicio" value={fechaInicio} onChange={setFechaInicio} type="date" />
        <Input label="Fecha de fin" value={fechaFin} onChange={setFechaFin} type="date" />
      </div>
      <Button onClick={calcular}>Calcular días</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Diferencia total</div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.dias}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666', marginLeft: '4px' }}>días</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { val: result.semanas, label: 'semanas' },
              { val: result.meses,   label: 'meses' },
              { val: result.anios,   label: 'años' },
            ].map((item) => (
              <div key={item.label} style={{ background: 'var(--cream)', padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{item.val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Entre esas dos fechas hay ${result.dias} días (${result.semanas} semanas).`} url="https://www.calcfit.com/dias-fechas" />
        </div>
      )}
    </div>
  );
}
