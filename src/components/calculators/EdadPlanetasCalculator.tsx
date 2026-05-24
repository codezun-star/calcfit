import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularEdadPlanetas } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function EdadPlanetasCalculator() {
  const [edad, setEdad]           = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularEdadPlanetas> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const e = parseFloat(edad);
    if (!edad || isNaN(e) || e < 1 || e > 150) { setError('Introduce una edad válida (1–150 años)'); return; }
    setError('');
    setResultado(calcularEdadPlanetas(e));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Tu edad en la Tierra" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular mi edad en otros planetas</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '16px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Tu edad en cada planeta del Sistema Solar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {resultado.planetas.map((p, i) => (
                <div key={p.nombre} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--acid)', minWidth: '80px' }}>
                    {p.edad}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'white', fontWeight: 600 }}>{p.nombre}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#666', marginTop: '2px' }}>
                      año orbital: {p.periodo} años terrestres
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              La "edad en otro planeta" es la cantidad de años orbitales del planeta que habrían transcurrido desde tu nacimiento. Un año de Mercurio dura 88 días terrestres; un año de Neptuno dura 165 años terrestres.
            </p>
          </div>

          <ShareButtons
            text={`¡En Marte tendría ${resultado.planetas.find(p => p.nombre === 'Marte')?.edad} años y en Júpiter solo ${resultado.planetas.find(p => p.nombre === 'Júpiter')?.edad}! Calcula tu edad en CalcFit:`}
            url="https://www.calcfit.com/edad-planetas"
          />
        </div>
      )}
    </div>
  );
}
