import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularCaloriasCorriendo } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function CaloriasCorriendoCalculator() {
  const [peso, setPeso]           = useState('');
  const [distancia, setDistancia] = useState('');
  const [tiempo, setTiempo]       = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularCaloriasCorriendo> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const p = parseFloat(peso), d = parseFloat(distancia), t = parseFloat(tiempo);
    if (!peso || isNaN(p) || p < 30 || p > 250) { setError('Introduce un peso válido (30–250 kg)'); return; }
    if (!distancia || isNaN(d) || d <= 0 || d > 100) { setError('Introduce una distancia válida (0–100 km)'); return; }
    if (!tiempo || isNaN(t) || t <= 0 || t > 600) { setError('Introduce un tiempo válido (1–600 min)'); return; }
    setError('');
    setResultado(calcularCaloriasCorriendo(p, d, t));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Distancia" value={distancia} onChange={setDistancia} suffix="km" type="number" />
        <Input label="Tiempo" value={tiempo} onChange={setTiempo} suffix="min" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular calorías</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Calorías quemadas</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.calorias}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>kcal</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', marginBottom: '1px' }}>
            {[
              { l: 'Velocidad', v: `${resultado.velocidadKmH}`, u: 'km/h' },
              { l: 'Ritmo', v: resultado.ritmo, u: 'min/km' },
              { l: 'Intensidad', v: `${resultado.met}`, u: 'MET' },
            ].map((x, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', padding: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{x.l}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)', lineHeight: 1 }}>{x.v}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{x.u}</div>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Equivale a</div>
            {resultado.equivalencias.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{e.alimento}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--acid)', background: 'var(--ink)', padding: '1px 6px' }}>{e.cantidad}</span>
              </div>
            ))}
          </div>
          <ShareButtons text={`Quemé ${resultado.calorias} kcal corriendo. Calcula las tuyas en CalcFit:`} url="https://www.calcfit.com/calorias-corriendo" />
        </div>
      )}
    </div>
  );
}
