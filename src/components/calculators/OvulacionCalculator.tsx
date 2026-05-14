import { useState } from 'react';
import { calcularOvulacion } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function OvulacionCalculator() {
  const [fechaFUM, setFechaFUM] = useState('');
  const [ciclo, setCiclo] = useState('28');
  const [result, setResult] = useState<ReturnType<typeof calcularOvulacion> | null>(null);

  const calcular = () => {
    if (!fechaFUM) return;
    const fecha = new Date(fechaFUM + 'T00:00:00');
    const duracion = parseInt(ciclo, 10) || 28;
    setResult(calcularOvulacion({ ultimaMenstruacion: fecha, duracionCiclo: duracion }));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de última menstruación" value={fechaFUM} onChange={setFechaFUM} type="date" />
      <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" />
      <Button onClick={calcular}>Calcular ovulación</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Día de ovulación</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--acid)', lineHeight: 1.1 }}>{fmt(result.ovulacion)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inicio período fértil</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{fmt(result.inicioFertil)}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Fin período fértil</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{fmt(result.finFertil)}</div>
            </div>
          </div>
          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Días fértiles ({result.diasFertiles.length} días)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.diasFertiles.map((d, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--acid)', color: 'var(--ink)', padding: '3px 8px' }}>
                  {d.getDate()}/{d.getMonth() + 1}
                </span>
              ))}
            </div>
          </div>
          <ShareButtons text={`Mi próxima ovulación es el ${fmt(result.ovulacion)}.`} url="https://www.calcfit.com/ovulacion" />
        </div>
      )}
    </div>
  );
}
