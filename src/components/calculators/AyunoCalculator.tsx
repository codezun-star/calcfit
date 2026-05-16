import { useState } from 'react';
import { calcularAyunoIntermitente, type ProtocoloAyuno } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function AyunoCalculator() {
  const [protocolo, setProtocolo] = useState<ProtocoloAyuno>('16:8');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [result, setResult] = useState<ReturnType<typeof calcularAyunoIntermitente> | null>(null);

  const calcular = () => {
    setResult(calcularAyunoIntermitente({ protocolo, horaInicioComida: horaInicio }));
  };

  const protocolos: { value: ProtocoloAyuno; label: string; desc: string }[] = [
    { value: '14:10', label: '14:10', desc: '14h ayuno · 10h comida — Principiantes' },
    { value: '16:8',  label: '16:8',  desc: '16h ayuno · 8h comida — El más popular' },
    { value: '18:6',  label: '18:6',  desc: '18h ayuno · 6h comida — Avanzado' },
    { value: '20:4',  label: '20:4',  desc: '20h ayuno · 4h comida — Guerrero (supervisión médica)' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>Protocolo de ayuno</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {protocolos.map(p => (
            <button
              key={p.value}
              onClick={() => setProtocolo(p.value)}
              style={{
                background: protocolo === p.value ? 'var(--ink)' : 'var(--cream)',
                border: 'none',
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: protocolo === p.value ? 'var(--acid)' : 'var(--ink)' }}>{p.label}</span>
              <span style={{ fontSize: '12px', color: protocolo === p.value ? '#888' : 'var(--muted)' }}>{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Hora de tu primera comida del día</p>
        <input
          type="time"
          value={horaInicio}
          onChange={e => setHoraInicio(e.target.value)}
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none' }}
        />
      </div>

      <Button onClick={calcular}>Calcular ventana</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Ventana de comida</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{horaInicio}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>hasta las <strong style={{ color: 'white' }}>{result.horaFinComida}</strong></div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{result.horasComida} horas para comer</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Ventana de ayuno</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'white', lineHeight: 1 }}>{result.horaInicioAyuno}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>hasta las <strong style={{ color: 'white' }}>{result.horaFinAyuno}</strong></div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{result.horasAyuno} horas de ayuno</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {result.beneficios.map((b, i) => (
              <div key={i} style={{ background: 'var(--cream)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--acid)', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{b}</span>
              </div>
            ))}
          </div>

          <ShareButtons text={`Hago ayuno intermitente ${protocolo}: como de ${horaInicio} a ${result.horaFinComida}. Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/ayuno-intermitente" />
        </div>
      )}
    </div>
  );
}
