import { useState } from 'react';
import Button from '../ui/Button';
import { calcularRecuperacionMuscular, type IntensidadEntrenamiento } from '../../lib/calculators';

type NivelExp = 'principiante' | 'intermedio' | 'avanzado';

const GRUPOS = ['pecho', 'espalda', 'piernas', 'hombros', 'biceps', 'triceps', 'gluteos', 'core'];

export default function RecuperacionMuscularCalculator() {
  const [grupo, setGrupo]         = useState('piernas');
  const [volumen, setVolumen]     = useState('12');
  const [intensidad, setIntensidad] = useState<IntensidadEntrenamiento>('moderado');
  const [nivel, setNivel]         = useState<NivelExp>('intermedio');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularRecuperacionMuscular> | null>(null);

  function calcular() {
    setResultado(calcularRecuperacionMuscular(grupo, parseInt(volumen) || 0, intensidad, nivel));
  }

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
    letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto' }}>
      {/* Grupo muscular */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Grupo muscular entrenado
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {GRUPOS.map(g => (
            <button key={g} onClick={() => setGrupo(g)} style={btnStyle(grupo === g)}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Volumen */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Volumen (series totales)
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['6', '9', '12', '15', '18', '21', '25'].map(n => (
            <button key={n} onClick={() => setVolumen(n)} style={btnStyle(volumen === n)}>{n} series</button>
          ))}
        </div>
      </div>

      {/* Intensidad */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Intensidad (RPE)
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['ligero', 'Ligero (RPE ≤6)'], ['moderado', 'Moderado (RPE 7–8)'], ['intenso', 'Intenso (RPE 9)'], ['muy_intenso', 'Máximo (RPE 10)']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setIntensidad(val)} style={btnStyle(intensidad === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Experiencia */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Nivel de experiencia
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {([['principiante', 'Principiante'], ['intermedio', 'Intermedio'], ['avanzado', 'Avanzado']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setNivel(val)} style={btnStyle(nivel === val)}>{label}</button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular recuperación</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Recuperación</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.horasRecuperacion}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>horas</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días de descanso</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.diasRecuperacion}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>días</div>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '12px' }}>Estrategias de recuperación</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {resultado.estrategias.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 14px', border: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--acid)', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{e}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '12px' }}>Señales de recuperación incompleta</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {resultado.senalesPorRecuperar.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#F87171', flexShrink: 0 }}>×</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
