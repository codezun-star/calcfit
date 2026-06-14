import { useState } from 'react';
import Button from '../ui/Button';
import { calcularVitaminaDSolar } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

type TipoPiel = 1 | 2 | 3 | 4 | 5 | 6;
type Latitud = 'tropical' | 'subtropical' | 'templado' | 'frio';
type Estacion = 'verano' | 'primavera' | 'otono' | 'invierno';
type Superficie = 'brazos' | 'brazos_piernas' | 'bikini';

const PIELES: { val: TipoPiel; label: string; color: string }[] = [
  { val: 1, label: 'Tipo I — Muy clara', color: '#fde8d8' },
  { val: 2, label: 'Tipo II — Clara',    color: '#f3c9a0' },
  { val: 3, label: 'Tipo III — Oliva',   color: '#c8956c' },
  { val: 4, label: 'Tipo IV — Morena',   color: '#9b6b45' },
  { val: 5, label: 'Tipo V — Oscura',    color: '#6b3f1e' },
  { val: 6, label: 'Tipo VI — Muy oscura', color: '#3b1c0c' },
];

const btnStyle = (active: boolean) => ({
  padding: '6px 14px', border: '1px solid',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
  background: active ? 'var(--ink)' : 'transparent',
  color: active ? 'var(--acid)' : 'var(--muted)',
  fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
  letterSpacing: '1px', cursor: 'pointer',
});

export default function VitaminaDCalculator() {
  const [tipoPiel, setTipoPiel]     = useState<TipoPiel>(3);
  const [latitud, setLatitud]       = useState<Latitud>('templado');
  const [estacion, setEstacion]     = useState<Estacion>('verano');
  const [superficie, setSuperficie] = useState<Superficie>('brazos');
  const [resultado, setResultado]   = useState<ReturnType<typeof calcularVitaminaDSolar> | null>(null);

  function calcular() {
    setResultado(calcularVitaminaDSolar(tipoPiel, latitud, estacion, superficie));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Tipo de piel */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Tipo de piel (escala Fitzpatrick)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {PIELES.map(({ val, label, color }) => (
            <button key={val} onClick={() => setTipoPiel(val)} style={{
              padding: '10px 14px', border: '1px solid',
              borderColor: tipoPiel === val ? 'var(--ink)' : 'var(--border)',
              background: tipoPiel === val ? 'var(--ink)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '2px', background: color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: tipoPiel === val ? 'var(--acid)' : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Latitud */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Zona geográfica
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['tropical', 'Tropical (<23°)'], ['subtropical', 'Subtropical (23–35°)'], ['templado', 'Templado (35–55°)'], ['frio', 'Frío (>55°)']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setLatitud(val)} style={btnStyle(latitud === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Estación */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Estación del año
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['verano', 'Verano'], ['primavera', 'Primavera'], ['otono', 'Otoño'], ['invierno', 'Invierno']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setEstacion(val)} style={btnStyle(estacion === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Superficie */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Superficie expuesta
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['brazos', 'Solo brazos'], ['brazos_piernas', 'Brazos + piernas'], ['bikini', 'Bañador/bikini']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setSuperficie(val)} style={btnStyle(superficie === val)}>{label}</button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular exposición</Button>

      {resultado && (
        <div>
          {resultado.advertencia && (
            <div style={{ background: '#fff7ed', border: '1px solid #fb923c', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: '#9a3412', lineHeight: 1.6 }}>{resultado.advertencia}</p>
            </div>
          )}

          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tiempo de exposición</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>
                {resultado.minutosNecesarios > 0 ? resultado.minutosNecesarios : '—'}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>minutos</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Vitamina D estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--acid)', lineHeight: 1 }}>
                {resultado.vitaminaDUI > 0 ? resultado.vitaminaDUI.toLocaleString() : '0'}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>UI aproximadas</div>
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px', marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
          <ShareButtons
            text={`Necesito ${resultado.minutosNecesarios} min de sol para sintetizar vitamina D (~${resultado.vitaminaDUI} UI). Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/vitamina-d"
          />
        </div>
      )}
    </div>
  );
}
