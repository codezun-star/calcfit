import { useState } from 'react';
import { calcularProbabilidadEmbarazo } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function ProbabilidadEmbarazoCalculator() {
  const [diasFUR, setDiasFUR] = useState('');
  const [ciclo, setCiclo] = useState('28');
  const [relaciones, setRelaciones] = useState<'una' | 'repetidas' | 'ninguna'>('una');
  const [result, setResult] = useState<ReturnType<typeof calcularProbabilidadEmbarazo> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const d = parseInt(diasFUR, 10);
    const c = parseInt(ciclo, 10);
    if (isNaN(d) || d < 1 || d > 45) errs.dias = 'Día del ciclo entre 1 y 45';
    if (isNaN(c) || c < 21 || c > 45) errs.ciclo = 'Ciclo entre 21 y 45 días';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularProbabilidadEmbarazo(d, c, relaciones));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
        <Input label="Día del ciclo actual" value={diasFUR} onChange={setDiasFUR} suffix="día" error={errors.dias} />
        <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" error={errors.ciclo} />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Relaciones en este día</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([
            { v: 'una', label: 'Una relación' },
            { v: 'repetidas', label: 'Relaciones repetidas' },
            { v: 'ninguna', label: 'Ninguna' },
          ] as const).map(opt => (
            <button
              key={opt.v}
              onClick={() => setRelaciones(opt.v)}
              style={{
                padding: '8px 14px', border: '1px solid var(--border)', cursor: 'pointer',
                background: relaciones === opt.v ? 'var(--ink)' : 'transparent',
                color: relaciones === opt.v ? 'var(--acid)' : 'var(--muted)',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
              }}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular probabilidad</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px', borderTop: `4px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Probabilidad de embarazo</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: result.color, lineHeight: 1 }}>{result.probabilidadPct}<span style={{ fontSize: '32px' }}>%</span></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginTop: '6px' }}>{result.etapa}</div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{result.etapa}</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{result.descripcion}</p>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Probabilidades por día (relación única)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {[
                { d: -5, p: '10%' }, { d: -4, p: '14%' }, { d: -3, p: '22%' }, { d: -2, p: '27%' },
                { d: -1, p: '33%' }, { d: 0,  p: '15%' }, { d: 1,  p: '5%' },  { d: 2,  p: '2%' },
              ].map(r => (
                <div key={r.d} style={{
                  padding: '6px', textAlign: 'center',
                  background: r.d === result.diasDesdeOvulacion ? 'var(--acid)' : 'var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: r.d === result.diasDesdeOvulacion ? 'var(--ink)' : 'var(--muted)' }}>
                    {r.d > 0 ? `+${r.d}` : r.d === 0 ? 'OVU' : `${r.d}`}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: r.d === result.diasDesdeOvulacion ? 'var(--ink)' : 'var(--ink)' }}>{r.p}</div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`En el día ${diasFUR} de mi ciclo, mi probabilidad de embarazo es del ${result.probabilidadPct}%. Calculado en CalcFit:`}
            url="https://www.calcfit.com/probabilidad-embarazo"
          />
        </div>
      )}
    </div>
  );
}
