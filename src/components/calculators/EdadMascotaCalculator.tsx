import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularEdadMascota } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function EdadMascotaCalculator() {
  const [edad, setEdad]       = useState('3');
  const [especie, setEspecie] = useState<'perro' | 'gato'>('perro');
  const [tamano, setTamano]   = useState<'pequeno' | 'mediano' | 'grande'>('mediano');
  const [res, setRes]         = useState<ReturnType<typeof calcularEdadMascota> | null>(null);
  const [error, setError]     = useState('');

  function calcular() {
    const e = parseFloat(edad);
    if (isNaN(e) || e <= 0 || e > 30) { setError('Introduce una edad válida (0–30 años)'); return; }
    setError('');
    setRes(calcularEdadMascota(e, especie, tamano));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Especie</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setEspecie('perro')} style={seg(especie === 'perro')}>Perro</button>
          <button onClick={() => setEspecie('gato')} style={seg(especie === 'gato')}>Gato</button>
        </div>
      </div>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Edad de tu mascota" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>
      {especie === 'perro' && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tamaño del perro</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setTamano('pequeno')} style={seg(tamano === 'pequeno')}>Pequeño</button>
            <button onClick={() => setTamano('mediano')} style={seg(tamano === 'mediano')}>Mediano</button>
            <button onClick={() => setTamano('grande')} style={seg(tamano === 'grande')}>Grande</button>
          </div>
        </div>
      )}
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular edad humana</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Edad en años humanos</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: 'var(--acid)', lineHeight: 1 }}>{res.edadHumana}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>años · etapa: {res.etapa}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              El primer año equivale a unos 15 años humanos y el segundo a unos 9 más. A partir de ahí, los {especie === 'gato' ? 'gatos suman ~4 años por año' : 'perros suman entre 4 y 6 años por año según su tamaño'}.
            </p>
          </div>
          <ShareButtons text={`Mi ${especie} tiene ${res.edadHumana} años humanos. Calcula la edad del tuyo en CalcFit:`} url="https://www.calcfit.com/edad-perro" />
        </div>
      )}
    </div>
  );
}
