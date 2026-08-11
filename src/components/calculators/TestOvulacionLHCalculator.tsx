import { useState } from 'react';
import { calcularTestOvulacionLH } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function TestOvulacionLHCalculator() {
  const [fechaFUM, setFechaFUM] = useState('');
  const [ciclo, setCiclo] = useState('28');
  const [result, setResult] = useState<ReturnType<typeof calcularTestOvulacionLH> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    if (!fechaFUM) errs.fecha = 'Ingresa la fecha de tu última menstruación';
    const dur = parseInt(ciclo, 10);
    if (isNaN(dur) || dur < 21 || dur > 45) errs.ciclo = 'Ciclo entre 21 y 45 días';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularTestOvulacionLH(new Date(fechaFUM + 'T00:00:00'), dur));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <Input label="Fecha de última menstruación (FUM)" value={fechaFUM} onChange={setFechaFUM} type="date" error={errors.fecha} />
        <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" error={errors.ciclo} />
      </div>
      <Button onClick={calcular}>Calcular días de test LH</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Empieza a testear desde</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--acid)', lineHeight: 1.2 }}>
              {fmt(result.fechaInicioTest)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
              Día {result.diaInicioTest} del ciclo · Ovulación estimada día {result.diaOvulacion}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {result.diasTest.map((d, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px',
                background: d.recomendado ? 'var(--acid)' : 'var(--cream)',
                borderLeft: d.dia === result.diaOvulacion ? '4px solid #F43F5E' : '4px solid transparent',
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: d.recomendado ? 'var(--ink)' : 'var(--ink)' }}>
                    {fmt(d.fecha)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: d.recomendado ? '#333' : 'var(--muted)', marginLeft: '8px' }}>
                    Día {d.dia}
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: d.recomendado ? '#333' : 'var(--muted)', textTransform: 'uppercase' }}>
                  {d.etiqueta}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Instrucciones</div>
            {result.instrucciones.map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--acid)', minWidth: '20px' }}>{i + 1}.</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{ins}</span>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Debo empezar a testear mi ovulación desde el ${fmt(result.fechaInicioTest)}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/test-ovulacion"
          />
        </div>
      )}
    </div>
  );
}
