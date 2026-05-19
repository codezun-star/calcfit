import { useState } from 'react';
import { calcularSueno } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

const CALIDAD_STYLE: Record<string, React.CSSProperties> = {
  'Mínimo':      { background: '#F87171', color: '#1a0000' },
  'Recomendado': { background: 'var(--acid)', color: 'var(--ink)' },
  'Óptimo':      { background: 'var(--acid)', color: 'var(--ink)' },
  'Excesivo':    { background: 'var(--border)', color: 'var(--muted)' },
};

export default function SuenoCalculator() {
  const [horaDespertar, setHoraDespertar] = useState('07:00');
  const [result, setResult] = useState<ReturnType<typeof calcularSueno> | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const calcular = () => {
    if (!horaDespertar) return;
    const res = calcularSueno(horaDespertar);
    setResult(res);
    setSelectedRow(null);
  };

  const selectedCiclo = result && selectedRow !== null ? result[selectedRow] : null;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.3px' }}>
          Hora a la que quiero despertar
        </label>
        <input
          type="time"
          value={horaDespertar}
          onChange={(e) => setHoraDespertar(e.target.value)}
          style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 0', fontSize: '32px', fontFamily: 'var(--font-display)', color: 'var(--ink)', outline: 'none', cursor: 'pointer', letterSpacing: '2px', width: '160px' }}
        />
      </div>

      <Button onClick={calcular}>Ver horarios ideales</Button>

      {result && (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', minWidth: '360px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', gap: '1px', background: 'var(--border)' }}>
            {['Hora de dormir', 'Ciclos', 'Horas', 'Calidad'].map((h) => (
              <div key={h} style={{ background: 'var(--cream)', padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {h}
              </div>
            ))}
          </div>

          {result.map((ciclo, i) => {
            const isSelected = selectedRow === i;
            const isRecomendado = ciclo.calidad === 'Recomendado' || ciclo.calidad === 'Óptimo';
            return (
              <div
                key={i}
                onClick={() => setSelectedRow(isSelected ? null : i)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px 100px',
                  gap: '1px',
                  background: 'var(--border)',
                  cursor: 'pointer',
                  opacity: isRecomendado ? 1 : 0.7,
                }}
              >
                <div style={{ background: isSelected ? 'var(--ink)' : 'var(--cream)', padding: '16px 12px', transition: 'background 0.12s' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: isSelected ? 'var(--acid)' : 'var(--ink)', letterSpacing: '1px' }}>
                    {ciclo.horaDormir}
                  </span>
                </div>
                <div style={{ background: isSelected ? '#111' : 'var(--cream)', padding: '16px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: isSelected ? '#888' : 'var(--ink)' }}>{ciclo.ciclos}</span>
                </div>
                <div style={{ background: isSelected ? '#111' : 'var(--cream)', padding: '16px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: isSelected ? '#888' : 'var(--ink)' }}>{ciclo.horas}h</span>
                </div>
                <div style={{ background: isSelected ? '#111' : 'var(--cream)', padding: '16px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ ...CALIDAD_STYLE[ciclo.calidad], fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {ciclo.calidad}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}

      {selectedCiclo && (
        <ShareButtons
          text={`Para despertar a las ${horaDespertar}, lo ideal es dormir a las ${selectedCiclo.horaDormir} (${selectedCiclo.ciclos} ciclos, ${selectedCiclo.horas} horas). Calculado con CalcFit:`}
          url="https://www.calcfit.com/sueno"
        />
      )}
    </div>
  );
}
