import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularPasosCalorias } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function PasosCaloriasCalculator() {
  const [pasos, setPasos]   = useState('10000');
  const [peso, setPeso]     = useState('70');
  const [altura, setAltura] = useState('170');
  const [res, setRes]       = useState<ReturnType<typeof calcularPasosCalorias> | null>(null);
  const [error, setError]   = useState('');

  function calcular() {
    const s = parseFloat(pasos), p = parseFloat(peso), a = parseFloat(altura);
    if (!s || s < 100 || s > 100000) { setError('Introduce los pasos (100–100.000)'); return; }
    if (!p || p < 25 || p > 250) { setError('Introduce un peso entre 25 y 250 kg'); return; }
    if (!a || a < 80 || a > 230) { setError('Introduce una altura entre 80 y 230 cm'); return; }
    setError('');
    setRes(calcularPasosCalorias(s, p, a));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Pasos del día" value={pasos} onChange={setPasos} suffix="pasos" type="number" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular calorías</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Calorías</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.calorias}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kcal quemadas</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Distancia</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.distanciaKm}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>km · ~{res.minutos} min</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Has alcanzado el <strong style={{ color: 'var(--ink)' }}>{res.porcentajeObjetivo}%</strong> del objetivo de 10.000 pasos diarios.
            </p>
          </div>
          <ShareButtons text={`Caminé ${pasos} pasos (${res.distanciaKm} km) y quemé ${res.calorias} kcal. Calcula los tuyos en CalcFit:`} url="https://www.calcfit.com/pasos-calorias" />
        </div>
      )}
    </div>
  );
}
