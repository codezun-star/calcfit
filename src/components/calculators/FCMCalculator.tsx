import { useState } from 'react';
import { calcularFCM } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';
import ZonasCardiaca from './ZonasCardiaca';

export default function FCMCalculator() {
  const [edad, setEdad] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularFCM> | null>(null);

  const calcular = () => {
    const edadN = parseInt(edad, 10);
    if (isNaN(edadN) || edadN < 10 || edadN > 100) return;
    setResult(calcularFCM(edadN));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Edad" value={edad} onChange={setEdad} suffix="años" />
      <Button onClick={calcular}>Calcular frecuencia cardíaca</Button>

      {result && (
        <>
          <ResultCard label="Frecuencia cardíaca máxima" value={result.fcm} unit="ppm" interpretation="Fórmula: 220 − edad" />
          <ZonasCardiaca fcm={result.fcm} zonas={result.zonas} />
          <ShareButtons text={`Mi frecuencia cardíaca máxima es ${result.fcm} ppm. Conoce tus zonas de entrenamiento:`} url="https://www.calcfit.com/frecuencia-cardiaca" />
        </>
      )}
    </div>
  );
}
