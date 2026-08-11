import { useState, useEffect, useRef } from 'react';
import { evaluarKickCounter } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function KickCounterCalculator() {
  const [semanas, setSemanas] = useState('');
  const [sesionActiva, setSesionActiva] = useState(false);
  const [patadas, setPatadas] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [inicioMs, setInicioMs] = useState<number | null>(null);
  const [result, setResult] = useState<ReturnType<typeof evaluarKickCounter> | null>(null);
  const [errorSem, setErrorSem] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (sesionActiva && inicioMs) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - inicioMs) / 60000);
        setMinutos(elapsed);
        const s = parseInt(semanas, 10) || 28;
        const r = evaluarKickCounter(patadas, elapsed, s);
        setResult(r);
        if (r.alcanzado || r.alerta) {
          clearInterval(intervalRef.current!);
          setSesionActiva(false);
        }
      }, 10000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sesionActiva, inicioMs, patadas, semanas]);

  const iniciar = () => {
    const s = parseInt(semanas, 10);
    if (isNaN(s) || s < 1 || s > 42) { setErrorSem('Semanas entre 1 y 42'); return; }
    setErrorSem('');
    setPatadas(0);
    setMinutos(0);
    setResult(null);
    setInicioMs(Date.now());
    setSesionActiva(true);
  };

  const registrarPatada = () => {
    if (!sesionActiva) return;
    const nuevas = patadas + 1;
    setPatadas(nuevas);
    const elapsed = inicioMs ? Math.floor((Date.now() - inicioMs) / 60000) : 0;
    const s = parseInt(semanas, 10) || 28;
    const r = evaluarKickCounter(nuevas, elapsed, s);
    setResult(r);
    if (r.alcanzado) {
      clearInterval(intervalRef.current!);
      setSesionActiva(false);
    }
  };

  const resetear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSesionActiva(false);
    setPatadas(0);
    setMinutos(0);
    setResult(null);
    setInicioMs(null);
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Semana de gestación actual" value={semanas} onChange={setSemanas} suffix="sem." error={errorSem} />

      {!sesionActiva && patadas === 0 && (
        <Button onClick={iniciar}>Iniciar sesión de conteo</Button>
      )}

      {sesionActiva && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '12px' }}>
              Sesión activa · {minutos} min transcurridos
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{patadas}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginTop: '6px' }}>
              de {result?.objetivo ?? 10} movimientos objetivo
            </div>
          </div>

          <button
            onClick={registrarPatada}
            style={{
              padding: '28px', background: 'var(--cream)', border: '2px solid var(--acid)', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', letterSpacing: '1px',
              transition: 'background 0.1s',
            }}
          >
            REGISTRAR MOVIMIENTO
          </button>
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--cream)', padding: '14px 16px', borderTop: `3px solid ${result.color}` }}>
            {result.alerta && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: '#F87171', color: 'white', padding: '6px 10px', marginBottom: '10px', textTransform: 'uppercase' }}>
                ⚠ ALERTA — Contacta a tu médico
              </div>
            )}
            <p style={{ fontSize: '14px', fontWeight: 600, color: result.color, marginBottom: '4px' }}>
              {result.alcanzado ? '¡Objetivo alcanzado!' : result.alerta ? 'Movimientos insuficientes' : 'Sesión en progreso'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{result.mensaje}</p>
            {result.cantidad > 0 && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{result.velocidad}</p>
            )}
          </div>

          {(result.alcanzado || result.alerta) && (
            <Button onClick={resetear} variant="ghost">Nueva sesión</Button>
          )}
        </div>
      )}

      {!sesionActiva && patadas > 0 && !result?.alcanzado && (
        <Button onClick={resetear} variant="ghost">Reiniciar</Button>
      )}
    </div>
  );
}
