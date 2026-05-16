import { useState } from 'react';
import { calcularVolumenEntrenamiento, type NivelExperiencia } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

const NIVELES: { key: NivelExperiencia; label: string; desc: string }[] = [
  { key: 'principiante', label: 'Principiante', desc: 'Menos de 1 año de entrenamiento consistente' },
  { key: 'intermedio',   label: 'Intermedio',   desc: '1–3 años de entrenamiento consistente' },
  { key: 'avanzado',     label: 'Avanzado',     desc: 'Más de 3 años de entrenamiento consistente' },
];

export default function VolumenEntrenamientoCalculator() {
  const [nivel, setNivel]   = useState<NivelExperiencia>('intermedio');
  const [dias, setDias]     = useState(4);
  const [result, setResult] = useState<ReturnType<typeof calcularVolumenEntrenamiento> | null>(null);

  const calcular = () => {
    setResult(calcularVolumenEntrenamiento(nivel, dias));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Nivel de experiencia</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NIVELES.map(n => (
            <button key={n.key} onClick={() => setNivel(n.key)} style={{ textAlign: 'left', padding: '12px 14px', border: '1px solid', borderColor: nivel === n.key ? 'var(--ink)' : 'var(--border)', background: nivel === n.key ? 'var(--ink)' : 'transparent', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: nivel === n.key ? 'var(--acid)' : 'var(--ink)', marginBottom: '2px' }}>{n.label}</div>
              <div style={{ fontSize: '12px', color: nivel === n.key ? '#aaa' : 'var(--muted)' }}>{n.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Días de entrenamiento por semana: <span style={{ color: 'var(--ink)' }}>{dias}</span></div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[2, 3, 4, 5, 6].map(d => (
            <button key={d} onClick={() => setDias(d)} style={{ flex: 1, padding: '10px', border: '1px solid', borderColor: dias === d ? 'var(--ink)' : 'var(--border)', background: dias === d ? 'var(--ink)' : 'transparent', color: dias === d ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-display)', fontSize: '20px', cursor: 'pointer' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular volumen semanal</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '16px 20px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{result.totalSetsSemana}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa' }}>series/semana (total)</span>
          </div>

          <div style={{ padding: '12px 16px', background: '#CAFF0015', borderLeft: '3px solid var(--acid)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            {result.recomendacion}
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '380px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Grupo muscular', 'MEV (mín.)', 'Recomendado', 'MRV (máx.)'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.grupos.map(g => (
                  <tr key={g.nombre} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 8px', color: 'var(--ink)', fontWeight: 500 }}>{g.nombre}</td>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>{g.mev} series</td>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{g.recomendado}</td>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>{g.mrv} series</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ShareButtons text={`Mi volumen de entrenamiento semanal recomendado es ${result.totalSetsSemana} series (nivel ${nivel}). CalcFit:`} url="https://www.calcfit.com/volumen-entrenamiento" />
        </div>
      )}
    </div>
  );
}
