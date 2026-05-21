import { useState } from 'react';
import { calcularEscalaBorg } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Escala = 'borg6_20' | 'cr10';

const pillStyle = (active: boolean) => ({
  padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  border: '1px solid', borderRadius: '2px', cursor: 'pointer',
  background: active ? 'var(--ink)' : 'transparent',
  color:      active ? 'var(--acid)' : 'var(--muted)',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
});

const BORG_LABELS: Record<number, string> = {
  6: 'Sin esfuerzo', 7: '', 8: '', 9: 'Muy ligero', 10: '',
  11: 'Ligero', 12: '', 13: 'Algo duro', 14: '', 15: 'Duro',
  16: '', 17: 'Muy duro', 18: '', 19: 'Extremadamente duro', 20: 'Máximo',
};

const CR10_LABELS: Record<number, string> = {
  0: 'Reposo', 1: 'Muy ligero', 2: 'Ligero', 3: 'Moderado',
  4: 'Algo duro', 5: 'Duro', 6: '', 7: 'Muy duro', 8: '', 9: 'Muy muy duro', 10: 'Máximo',
};

export default function EscalaBorgCalculator() {
  const [escala,  setEscala]  = useState<Escala>('borg6_20');
  const [rpe,     setRpe]     = useState(13);
  const [result,  setResult]  = useState<ReturnType<typeof calcularEscalaBorg> | null>(null);

  const minVal = escala === 'borg6_20' ? 6 : 0;
  const maxVal = escala === 'borg6_20' ? 20 : 10;
  const labels  = escala === 'borg6_20' ? BORG_LABELS : CR10_LABELS;

  const handleEscala = (e: Escala) => {
    setEscala(e);
    setRpe(e === 'borg6_20' ? 13 : 5);
    setResult(null);
  };

  const calcular = () => {
    setResult(calcularEscalaBorg(rpe, escala));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        La escala de Borg mide el esfuerzo percibido durante el ejercicio. La escala original va de 6 a 20 (RPE × 10 ≈ %FC máx). La CR10 va de 0 a 10.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Escala</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleEscala('borg6_20')} style={pillStyle(escala === 'borg6_20')}>Borg 6-20</button>
          <button onClick={() => handleEscala('cr10')}     style={pillStyle(escala === 'cr10')}>CR10 (0-10)</button>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Esfuerzo percibido (RPE)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>{rpe}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>{labels[rpe] ?? ''}</span>
          </div>
        </div>
        <input
          type="range" min={minVal} max={maxVal} value={rpe}
          onChange={e => { setRpe(parseInt(e.target.value)); setResult(null); }}
          style={{ width: '100%', accentColor: 'var(--acid)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', marginTop: '4px' }}>
          <span>{minVal} Sin esfuerzo</span><span>{maxVal} Máximo</span>
        </div>
      </div>

      <Button onClick={calcular}>Interpretar RPE</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Intensidad</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: result.color, lineHeight: 1 }}>{result.intensidad}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>% FC máx estimado</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{result.porcentajeFCmax}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginLeft: '4px' }}>%</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: `3px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Zona de entrenamiento</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{result.zonaEntrenamiento}</div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi esfuerzo percibido (RPE ${rpe}) corresponde a intensidad ${result.intensidad} (~${result.porcentajeFCmax}% FC máx). Interpreta el tuyo en CalcFit:`}
            url="https://www.calcfit.com/escala-borg"
          />
        </div>
      )}
    </div>
  );
}
