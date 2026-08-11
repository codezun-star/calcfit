import { useState } from 'react';
import { calcularSemanaEmbarazo } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

export default function EmbarazoCalculator() {
  const [fechaFUM, setFechaFUM] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularSemanaEmbarazo> | null>(null);

  const calcular = () => {
    if (!fechaFUM) return;
    setResult(calcularSemanaEmbarazo(new Date(fechaFUM + 'T00:00:00')));
  };

  const fmt = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Fecha de última menstruación (FUM)" value={fechaFUM} onChange={setFechaFUM} type="date" />
      <Button onClick={calcular}>Calcular semana de embarazo</Button>

      {result && (
        <>
          <ResultCard label={`Trimestre ${result.trimestre}`} value={result.semanas} unit={`sem + ${result.dias} días`} interpretation={`Fecha probable de parto: ${fmt(result.fechaParto)}`} />
          <ShareButtons text={`Estoy en la semana ${result.semanas} de embarazo (trimestre ${result.trimestre}).`} url="https://www.calcfit.com/semana-embarazo" />
        </>
      )}
    </div>
  );
}
