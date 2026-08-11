import { useState } from 'react';
import { calcularRitmoMaraton } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function RitmoMaratonCalculator() {
  const [horas, setHoras]       = useState('');
  const [minutos, setMinutos]   = useState('');
  const [segundos, setSegundos] = useState('');
  const [result, setResult]     = useState<ReturnType<typeof calcularRitmoMaraton> | null>(null);
  const [error, setError]       = useState('');

  const inputStyle = {
    background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
    padding: '10px 0', fontSize: '32px', fontFamily: 'var(--font-display)',
    color: 'var(--ink)', outline: 'none', width: '80px', textAlign: 'center' as const,
  };

  const calcular = () => {
    const h = parseInt(horas) || 0;
    const m = parseInt(minutos) || 0;
    const s = parseInt(segundos) || 0;
    const total = h * 3600 + m * 60 + s;
    if (total < 3600 || total > 21600) {
      setError('Introduce un tiempo entre 1:00:00 y 6:00:00');
      return;
    }
    setError('');
    setResult(calcularRitmoMaraton(h, m, s));
  };

  const KM_LABELS: Record<number, string> = {
    5: 'km 5', 10: 'km 10', 15: 'km 15', 20: 'km 20',
    21.1: 'Media', 25: 'km 25', 30: 'km 30', 35: 'km 35',
    40: 'km 40', 42.195: 'Meta',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Introduce tu tiempo objetivo de maratón (42,195 km) y obtendrás tu ritmo por kilómetro, velocidad y los splits de paso.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Tiempo objetivo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <input type="number" value={horas} onChange={e => setHoras(e.target.value)} placeholder="00" min={0} max={6} style={inputStyle} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>horas</div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--muted)', paddingBottom: '16px' }}>:</span>
          <div style={{ textAlign: 'center' }}>
            <input type="number" value={minutos} onChange={e => setMinutos(e.target.value)} placeholder="00" min={0} max={59} style={inputStyle} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>min</div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--muted)', paddingBottom: '16px' }}>:</span>
          <div style={{ textAlign: 'center' }}>
            <input type="number" value={segundos} onChange={e => setSegundos(e.target.value)} placeholder="00" min={0} max={59} style={inputStyle} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>seg</div>
          </div>
        </div>
        {error && <p style={{ fontSize: '12px', color: '#F87171', marginTop: '8px' }}>{error}</p>}
      </div>

      <Button onClick={calcular}>Calcular ritmo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Ritmo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--acid)', lineHeight: 1 }}>{result.ritmoStr.replace(' min/km', '')}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa' }}>min/km</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Velocidad</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#ccc', lineHeight: 1 }}>{result.velocidadKmh}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa' }}>km/h</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Media maratón</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#ccc', lineHeight: 1 }}>{result.tiempoMediaMaraton}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Tiempo total</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--acid)', lineHeight: 1 }}>{result.tiempoTotal}</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '340px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Punto', 'Tiempo acum.', 'Ritmo'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.splits.map(split => (
                  <tr key={split.km} style={{ borderBottom: '1px solid var(--border)', background: split.km === 42.195 ? 'var(--cream)' : 'transparent' }}>
                    <td style={{ padding: '10px 8px', fontWeight: split.km === 21.1 || split.km === 42.195 ? 700 : 400, color: 'var(--ink)' }}>
                      {KM_LABELS[split.km] ?? `km ${split.km}`}
                    </td>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-display)', fontSize: '18px', color: split.km === 42.195 ? 'var(--ink)' : 'var(--muted)' }}>{split.tiempoAcumulado}</td>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>{split.ritmo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ShareButtons
            text={`Mi objetivo de maratón es ${result.tiempoTotal} a un ritmo de ${result.ritmoStr}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/ritmo-maraton"
          />
        </div>
      )}
    </div>
  );
}
