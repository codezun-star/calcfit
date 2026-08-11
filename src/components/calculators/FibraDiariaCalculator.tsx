import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularFibraDiaria, type ObjetivoFibra } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

const OBJETIVOS: { val: ObjetivoFibra; label: string; desc: string }[] = [
  { val: 'digestivo',      label: 'Digestivo',      desc: 'Mejorar tránsito intestinal' },
  { val: 'cardiovascular', label: 'Cardiovascular', desc: 'Reducir colesterol LDL' },
  { val: 'peso',           label: 'Control de peso', desc: 'Aumentar saciedad' },
];

export default function FibraDiariaCalculator() {
  const [edad, setEdad]           = useState('');
  const [sexo, setSexo]           = useState<'hombre' | 'mujer'>('hombre');
  const [objetivo, setObjetivo]   = useState<ObjetivoFibra>('digestivo');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFibraDiaria> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const e = parseInt(edad);
    if (!edad || isNaN(e) || e < 5 || e > 100) { setError('Introduce una edad válida (5–100 años)'); return; }
    setError('');
    setResultado(calcularFibraDiaria(e, sexo, objetivo));
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
      <div style={{ maxWidth: '180px' }}>
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['hombre', 'mujer'] as const).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={btnStyle(sexo === s)}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Objetivo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {OBJETIVOS.map(o => (
            <button key={o.val} onClick={() => setObjetivo(o.val)} style={{
              ...btnStyle(objetivo === o.val),
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '10px 14px', textTransform: 'none',
            }}>
              <span style={{ fontWeight: 600 }}>{o.label}</span>
              <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>{o.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular fibra diaria</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total diario</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.gramosDiarios}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/día</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Soluble</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.gramosSolubles}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/día</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Insoluble</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.gramosInsolubles}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/día</div>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 16px', marginBottom: '1px' }}>
            <p style={{ fontSize: '13px', color: '#166534', lineHeight: 1.7 }}>{resultado.beneficio}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            {[
              { titulo: 'Fibra soluble', fuentes: resultado.fuentesSolubles },
              { titulo: 'Fibra insoluble', fuentes: resultado.fuentesInsolubles },
            ].map(grupo => (
              <div key={grupo.titulo} style={{ border: '1px solid var(--border)', padding: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  {grupo.titulo}
                </div>
                {grupo.fuentes.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{f.alimento}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--acid)', background: 'var(--ink)', padding: '1px 6px', flexShrink: 0, marginLeft: '6px' }}>
                      {f.gramosPorRacion}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{resultado.recomendacion}</p>
          </div>

          <ShareButtons
            text={`Necesito ${resultado.gramosDiarios} g de fibra al día según mi perfil. Calcula la tuya en CalcFit:`}
            url="https://www.calcfit.com/fibra-diaria"
          />
        </div>
      )}
    </div>
  );
}
