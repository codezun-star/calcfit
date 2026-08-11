import { useState } from 'react';
import { calcularEdadGestacional } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function EdadGestacionalCalculator() {
  const [tipo, setTipo] = useState<'fur' | 'concepcion'>('fur');
  const [fecha, setFecha] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularEdadGestacional> | null>(null);
  const [error, setError] = useState('');

  const calcular = () => {
    if (!fecha) { setError('Ingresa la fecha'); return; }
    const d = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    if (d >= hoy) { setError('La fecha debe ser anterior a hoy'); return; }
    setError('');
    setResult(calcularEdadGestacional(tipo, d));
  };

  const fmtL = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['fur', 'concepcion'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTipo(t); setResult(null); }}
            style={{
              flex: 1, padding: '10px', border: '1px solid var(--border)', cursor: 'pointer',
              background: tipo === t ? 'var(--ink)' : 'transparent',
              color: tipo === t ? 'var(--acid)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase',
            }}
          >
            {t === 'fur' ? 'Desde la FUR' : 'Desde concepción'}
          </button>
        ))}
      </div>

      <Input
        label={tipo === 'fur' ? 'Fecha de última regla (FUR)' : 'Fecha de concepción estimada'}
        value={fecha}
        onChange={setFecha}
        type="date"
        error={error}
      />
      <Button onClick={calcular}>Calcular edad gestacional</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Edad gestacional</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>
              {result.semanas}<span style={{ fontSize: '28px' }}>sem</span> {result.diasExtra}<span style={{ fontSize: '28px' }}>días</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
              Trimestre {result.trimestre} · {result.porcentajeCompletado}% completado
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Fecha probable de parto</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{fmtL(result.fpp)}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Días para el parto</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{result.diasParaParto}</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Concepción estimada</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{fmtL(result.fechaConcepcionEstimada)}</div>
            </div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{result.etapa}</div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.hitoActual}</p>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ height: '8px', background: 'var(--border)', position: 'relative' }}>
              <div style={{ height: '100%', background: 'var(--acid)', width: `${result.porcentajeCompletado}%`, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>
              {result.porcentajeCompletado}% del embarazo completado
            </div>
          </div>

          <ShareButtons
            text={`Estoy en la semana ${result.semanas} + ${result.diasExtra} días de embarazo. Mi fecha probable de parto es el ${fmtL(result.fpp)}.`}
            url="https://www.calcfit.com/edad-gestacional"
          />
        </div>
      )}
    </div>
  );
}
