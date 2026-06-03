import { useState } from 'react';
import { calcularVentanaFertil } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function VentanaFertilCalculator() {
  const [fechaFUM, setFechaFUM] = useState('');
  const [ciclo, setCiclo] = useState('28');
  const [result, setResult] = useState<ReturnType<typeof calcularVentanaFertil> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    if (!fechaFUM) errs.fecha = 'Ingresa la fecha de tu última menstruación';
    const dur = parseInt(ciclo, 10);
    if (isNaN(dur) || dur < 21 || dur > 45) errs.ciclo = 'Ciclo entre 21 y 45 días';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularVentanaFertil(new Date(fechaFUM + 'T00:00:00'), dur));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
  const fmtL = (d: Date) => d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <Input label="Fecha de última menstruación (FUM)" value={fechaFUM} onChange={setFechaFUM} type="date" error={errors.fecha} />
        <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" error={errors.ciclo} />
      </div>
      <Button onClick={calcular}>Calcular ventana fértil</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              {result.enVentanaAhora ? '🟢 ESTÁS EN TU VENTANA FÉRTIL' : 'Próxima ventana fértil'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--acid)', lineHeight: 1.2 }}>
              {fmtL(result.inicioVentana)} → {fmtL(result.finVentana)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
              Ovulación estimada: {fmtL(result.ovulacion)}
              {result.diasHastaOvulacion > 0 && ` · en ${result.diasHastaOvulacion} días`}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {result.diasFertiles.map((d, i) => (
              <div key={i} style={{ background: 'var(--cream)', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{fmt(d.fecha)}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: d.color, lineHeight: 1 }}>{d.probabilidad}%</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.3 }}>{d.etiqueta}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Próximo ciclo</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', fontWeight: 600 }}>{fmtL(result.proximoCiclo)}</div>
          </div>

          <ShareButtons
            text={`Mi ventana fértil es del ${fmt(result.inicioVentana)} al ${fmt(result.finVentana)}. Calculado en CalcFit:`}
            url="https://www.calcfit.com/ventana-fertil"
          />
        </div>
      )}
    </div>
  );
}
