import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularFechaConcepcion } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function FechaConcecionCalculator() {
  const [tipo, setTipo]           = useState<'parto' | 'regla'>('regla');
  const [fecha, setFecha]         = useState('');
  const [ciclo, setCiclo]         = useState('28');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFechaConcepcion> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    if (!fecha) { setError('Introduce una fecha'); return; }
    const c = parseInt(ciclo);
    if (tipo === 'regla' && (isNaN(c) || c < 21 || c > 45)) {
      setError('El ciclo debe estar entre 21 y 45 días'); return;
    }
    setError('');
    setResultado(calcularFechaConcepcion(tipo, fecha, c));
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px',
    textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Calcular desde
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setTipo('regla')}  style={btnStyle(tipo === 'regla')}>Última regla</button>
          <button onClick={() => setTipo('parto')} style={btnStyle(tipo === 'parto')}>Fecha de parto</button>
        </div>
      </div>

      <Input
        label={tipo === 'regla' ? 'Fecha de última menstruación' : 'Fecha probable de parto'}
        value={fecha} onChange={setFecha} type="date"
      />

      {tipo === 'regla' && (
        <div style={{ maxWidth: '200px' }}>
          <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" type="number" />
        </div>
      )}

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Estimar fecha de concepción</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Concepción estimada
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 28px)', color: 'var(--acid)', lineHeight: 1.3, marginBottom: '12px' }}>
              {resultado.fechaConcepcionEstimada}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ventana de concepción</div>
                <div style={{ fontSize: '12px', color: '#bbb' }}>{resultado.ventanaInicio}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>→</div>
                <div style={{ fontSize: '12px', color: '#bbb' }}>{resultado.ventanaFin}</div>
              </div>
              {resultado.semanasActuales > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Semanas transcurridas</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'white', lineHeight: 1 }}>{resultado.semanasActuales}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>semanas</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{resultado.explicacion}</p>
          </div>

          <ShareButtons
            text={`Estimé la fecha de concepción usando CalcFit:`}
            url="https://www.calcfit.com/fecha-concepcion"
          />
        </div>
      )}
    </div>
  );
}
