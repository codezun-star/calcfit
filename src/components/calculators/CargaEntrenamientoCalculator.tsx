import { useState } from 'react';
import { calcularCargaEntrenamiento, type SesionRPE } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

interface SesionUI {
  rpe:         number;
  duracionMin: string;
}

const RPE_DESC: Record<number, string> = {
  1: 'Muy leve', 2: 'Leve', 3: 'Moderado', 4: 'Algo esforzado', 5: 'Esforzado',
  6: 'Duro', 7: 'Muy duro', 8: 'Extremo', 9: 'Casi máximo', 10: 'Máximo',
};

export default function CargaEntrenamientoCalculator() {
  const [sesiones, setSesiones] = useState<SesionUI[]>([
    { rpe: 5, duracionMin: '' },
    { rpe: 5, duracionMin: '' },
  ]);
  const [result, setResult] = useState<ReturnType<typeof calcularCargaEntrenamiento> | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const addSesion = () => {
    if (sesiones.length < 7) setSesiones(prev => [...prev, { rpe: 5, duracionMin: '' }]);
  };

  const removeSesion = (i: number) => {
    setSesiones(prev => prev.filter((_, idx) => idx !== i));
    setResult(null);
  };

  const updateSesion = (i: number, field: keyof SesionUI, value: string | number) => {
    setSesiones(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const calcular = () => {
    const sesValidas: SesionRPE[] = sesiones
      .filter(s => s.duracionMin !== '' && !isNaN(parseFloat(s.duracionMin)) && parseFloat(s.duracionMin) > 0)
      .map(s => ({ rpe: s.rpe, duracionMin: parseFloat(s.duracionMin) }));

    if (sesValidas.length === 0) {
      setErrorMsg('Introduce la duración de al menos una sesión.');
      return;
    }
    setErrorMsg('');
    setResult(calcularCargaEntrenamiento(sesValidas));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Método Foster (2001): la carga de cada sesión = RPE × duración (minutos). La monotonía mide la variabilidad de la carga entre días — si es ≥ 2, hay riesgo de sobreentrenamiento.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sesiones.map((s, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Sesión {i + 1}
              </span>
              {sesiones.length > 1 && (
                <button onClick={() => removeSesion(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '16px', cursor: 'pointer', lineHeight: 1 }}>×</button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>
                  RPE: <strong style={{ color: 'var(--ink)' }}>{s.rpe} — {RPE_DESC[s.rpe]}</strong>
                </div>
                <input
                  type="range" min={1} max={10} value={s.rpe}
                  onChange={e => updateSesion(i, 'rpe', parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--acid)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)' }}>
                  <span>1 Leve</span><span>10 Máximo</span>
                </div>
              </div>

              <div style={{ minWidth: '100px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Duración</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <input
                    type="number" value={s.duracionMin}
                    onChange={e => updateSesion(i, 'duracionMin', e.target.value)}
                    placeholder="min"
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '4px 0', fontSize: '20px', fontFamily: 'var(--font-display)', color: 'var(--ink)', outline: 'none', width: '60px' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>min</span>
                </div>
              </div>
            </div>

            {s.duracionMin !== '' && !isNaN(parseFloat(s.duracionMin)) && parseFloat(s.duracionMin) > 0 && (
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                UA sesión: <strong style={{ color: 'var(--ink)' }}>{Math.round(s.rpe * parseFloat(s.duracionMin))}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {sesiones.length < 7 && (
          <button
            onClick={addSesion}
            style={{ padding: '10px 20px', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer', letterSpacing: '1px' }}
          >
            + Añadir sesión
          </button>
        )}
        <Button onClick={calcular}>Calcular carga</Button>
      </div>

      {errorMsg && <p style={{ color: '#F87171', fontSize: '13px' }}>{errorMsg}</p>}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Carga semanal</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.cargaSemanalUA}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginLeft: '6px' }}>UA</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Categoría</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: result.color, lineHeight: 1.1 }}>{result.categoria}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Prom. diario',  valor: `${result.promedioDiario} UA` },
              { label: 'Monotonía',     valor: result.monotonia.toFixed(2), warning: result.monotonia >= 2 },
              { label: 'Strain',        valor: String(result.strain) },
            ].map(c => (
              <div key={c.label} style={{ background: 'var(--cream)', padding: '10px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: ('warning' in c && c.warning) ? '#F87171' : 'var(--ink)' }}>{c.valor}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi carga semanal de entrenamiento es ${result.cargaSemanalUA} UA (${result.categoria}). Calcula la tuya con CalcFit:`}
            url="https://www.calcfit.com/carga-entrenamiento"
          />
        </div>
      )}
    </div>
  );
}
