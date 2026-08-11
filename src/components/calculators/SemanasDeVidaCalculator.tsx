import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularSemanasDeVida } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SemanasDeVidaCalculator() {
  const [fecha, setFecha]         = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularSemanasDeVida> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    if (!fecha) { setError('Introduce tu fecha de nacimiento'); return; }
    const nacimiento = new Date(fecha);
    if (isNaN(nacimiento.getTime()) || nacimiento >= new Date()) {
      setError('La fecha debe ser en el pasado'); return;
    }
    setError('');
    setResultado(calcularSemanasDeVida(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de nacimiento" value={fecha} onChange={setFecha} type="date" />

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular semanas de vida</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Semanas vividas</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>
                {resultado.totalSemanas.toLocaleString('es-ES')}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>semanas</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días totales</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>
                {resultado.totalDias.toLocaleString('es-ES')}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>días</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>En meses</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>
                {resultado.meses.toLocaleString('es-ES')}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>meses</div>
            </div>
          </div>

          <div style={{ background: '#f0f9f0', border: '1px solid var(--border)', padding: '16px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Próximo hito
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--ink)' }}>
                {resultado.proximaSemanaClave.toLocaleString('es-ES')}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>semanas</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              Faltan <strong style={{ color: 'var(--ink)' }}>{resultado.semanasHastaProxima}</strong> semanas para tu siguiente hito redondo.
            </p>
          </div>

          <ShareButtons
            text={`¡Llevo ${resultado.totalSemanas.toLocaleString('es-ES')} semanas vividas (${resultado.totalDias.toLocaleString('es-ES')} días)! Calcula las tuyas en CalcFit:`}
            url="https://www.calcfit.com/semanas-de-vida"
          />
        </div>
      )}
    </div>
  );
}
