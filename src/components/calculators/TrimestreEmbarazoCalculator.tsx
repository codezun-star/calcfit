import { useState } from 'react';
import { calcularTrimestreEmbarazo } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function TrimestreEmbarazoCalculator() {
  const [semanas, setSemanas] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularTrimestreEmbarazo> | null>(null);
  const [error, setError] = useState('');

  const calcular = () => {
    const s = parseInt(semanas, 10);
    if (isNaN(s) || s < 1 || s > 42) { setError('Semanas entre 1 y 42'); return; }
    setError('');
    setResult(calcularTrimestreEmbarazo(s));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Semana de gestación actual" value={semanas} onChange={setSemanas} suffix="sem." error={error} />
      <Button onClick={calcular}>Ver mi trimestre</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px', borderTop: `4px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Trimestre</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: result.color, lineHeight: 1 }}>{result.trimestre}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginTop: '6px' }}>
              Semanas {result.semanaInicioTrimestre}–{result.semanaFinTrimestre} · Quedan {result.semanasRestantesTrimestre} semanas en este trimestre
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Hitos del bebé este trimestre</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {result.hitosBebe.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', background: 'var(--cream)', padding: '10px 14px', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: result.color, minWidth: '52px' }}>S{h.semana}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{h.descripcion}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Síntomas y cambios comunes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.hitosEmbarazada.map((h, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--ink)', padding: '4px 10px' }}>{h}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Checklist médico</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {result.checklistMedico.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: result.color, fontFamily: 'var(--font-display)', fontSize: '16px', lineHeight: 1.4 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Estoy en el trimestre ${result.trimestre} del embarazo (semana ${semanas}). Calculado en CalcFit:`}
            url="https://www.calcfit.com/trimestre-embarazo"
          />
        </div>
      )}
    </div>
  );
}
