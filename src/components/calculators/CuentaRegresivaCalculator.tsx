import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularCuentaRegresiva } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function CuentaRegresivaCalculator() {
  const [fecha, setFecha]       = useState('');
  const [evento, setEvento]     = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularCuentaRegresiva> | null>(null);
  const [error, setError]       = useState('');
  const [tick, setTick]         = useState(0);

  useEffect(() => {
    if (!resultado) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [resultado]);

  const vivo = resultado && !resultado.pasado ? calcularCuentaRegresiva(fecha) : resultado;

  function calcular() {
    if (!fecha) { setError('Introduce una fecha futura'); return; }
    const r = calcularCuentaRegresiva(fecha);
    setError('');
    setResultado(r);
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input label="Fecha objetivo" value={fecha} onChange={setFecha} type="date" />
        <Input label="Nombre del evento (opcional)" value={evento} onChange={setEvento} placeholder="Ej: Mi boda, Vacaciones…" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Iniciar cuenta regresiva</Button>

      {vivo && (
        <div style={{ marginTop: '8px' }}>
          {evento && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {evento}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
            {vivo.fechaFormateada}
          </div>

          {vivo.pasado ? (
            <div style={{ background: 'var(--ink)', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#F87171', marginBottom: '8px' }}>Fecha ya pasada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>
                {vivo.dias}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>días desde esa fecha</div>
            </div>
          ) : (
            <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px' }}>
              {[
                { val: vivo.dias,    label: 'Días' },
                { val: vivo.horas,   label: 'Horas' },
                { val: vivo.minutos, label: 'Min' },
                { val: vivo.segundos,label: 'Seg' },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 8vw, 64px)', color: 'var(--acid)', lineHeight: 1 }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!vivo.pasado && (
            <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '14px 16px', marginTop: '1px' }}>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Total: <strong style={{ color: 'var(--ink)' }}>{vivo.totalSegundos.toLocaleString('es-ES')}</strong> segundos restantes
              </p>
            </div>
          )}

          <ShareButtons
            text={`Faltan ${vivo.dias} días${evento ? ` para "${evento}"` : ''} según mi cuenta regresiva en CalcFit:`}
            url="https://www.calcfit.com/cuenta-regresiva"
          />
        </div>
      )}
    </div>
  );
}
