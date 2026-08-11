import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularCuandoTestEmbarazo } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function CuandoTestEmbarazoCalculator() {
  const [ultimaRegla, setUltimaRegla] = useState('');
  const [ciclo, setCiclo]             = useState('28');
  const [resultado, setResultado]     = useState<ReturnType<typeof calcularCuandoTestEmbarazo> | null>(null);
  const [error, setError]             = useState('');

  function calcular() {
    if (!ultimaRegla) { setError('Introduce la fecha de tu última menstruación'); return; }
    const c = parseInt(ciclo);
    if (isNaN(c) || c < 21 || c > 45) { setError('La duración del ciclo debe estar entre 21 y 45 días'); return; }
    setError('');
    setResultado(calcularCuandoTestEmbarazo(ultimaRegla, c));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de última menstruación" value={ultimaRegla} onChange={setUltimaRegla} type="date" />
      <div style={{ maxWidth: '200px' }}>
        <Input label="Duración del ciclo" value={ciclo} onChange={setCiclo} suffix="días" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular día del test</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Ovulación estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--acid)', lineHeight: 1.3 }}>{resultado.fechaOvulacion}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Test mínimo (10 DPO)</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#FB923C', lineHeight: 1.3 }}>{resultado.diaTestMinimo}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Test óptimo (14 DPO)</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#34D399', lineHeight: 1.3 }}>{resultado.diaTestOptimo}</div>
            </div>
          </div>

          <div style={{
            background: resultado.puedeHacerTest ? '#f0fdf4' : '#f9f6f0',
            border: `1px solid ${resultado.puedeHacerTest ? '#bbf7d0' : 'var(--border)'}`,
            padding: '16px',
            marginBottom: '1px',
          }}>
            {!resultado.puedeHacerTest && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>
                Faltan <strong style={{ color: 'var(--ink)' }}>{resultado.diasHastaTestOptimo}</strong> días para el test óptimo
              </div>
            )}
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{resultado.explicacion}</p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '14px 16px', background: '#fffbeb' }}>
            <p style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.7 }}>
              <strong>Consejo:</strong> Realiza el test con la primera orina de la mañana, cuando la concentración de la hormona hCG es mayor. Los tests de farmacia detectan niveles desde 20–25 mUI/mL.
            </p>
          </div>

          <ShareButtons
            text={`Calculé el día óptimo para mi test de embarazo en CalcFit:`}
            url="https://www.calcfit.com/cuando-test-embarazo"
          />
        </div>
      )}
    </div>
  );
}
