import { useState } from 'react';
import { calcularTiempoPostparto } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function TiempoPostpartoCalculator() {
  const [fechaParto, setFechaParto] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularTiempoPostparto> | null>(null);
  const [error, setError] = useState('');

  const calcular = () => {
    if (!fechaParto) { setError('Ingresa la fecha de tu parto'); return; }
    const d = new Date(fechaParto + 'T00:00:00');
    const hoy = new Date();
    if (d > hoy) { setError('La fecha de parto debe ser anterior a hoy'); return; }
    setError('');
    setResult(calcularTiempoPostparto(d));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de tu parto" value={fechaParto} onChange={setFechaParto} type="date" error={error} />
      <Button onClick={calcular}>Ver mi etapa postparto</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{result.etapaActual.nombre}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>
              {result.semanasPostparto}<span style={{ fontSize: '24px' }}>sem</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
              {result.diasPostparto} días desde el parto
            </div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{result.etapaActual.nombre}</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{result.etapaActual.descripcion}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Síntomas comunes ahora</div>
              {result.etapaActual.sintomas.map((s, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.4 }}>· {s}</div>
              ))}
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Consejos para esta etapa</div>
              {result.etapaActual.consejos.map((c, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.4 }}>→ {c}</div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Próximo control</div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{result.proxControl}</p>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Cicatrización</div>
            <p style={{ fontSize: '13px', color: 'var(--ink)' }}>{result.progresoCicatrizacion}</p>
          </div>

          <div style={{ background: '#FFF5F5', border: '1px solid #F87171', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#F87171', textTransform: 'uppercase', marginBottom: '8px' }}>Señales de alarma — consulta al médico</div>
            {result.alertas.map((a, i) => (
              <div key={i} style={{ fontSize: '12px', color: '#7F1D1D', marginBottom: '4px', lineHeight: 1.4 }}>⚠ {a}</div>
            ))}
          </div>

          <ShareButtons
            text={`Estoy en la semana ${result.semanasPostparto} del postparto. ${result.etapaActual.nombre}. CalcFit:`}
            url="https://www.calcfit.com/tiempo-postparto"
          />
        </div>
      )}
    </div>
  );
}
