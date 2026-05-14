import { useState } from 'react';
import { calcularIMC } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import { useHistory } from '../../lib/useHistory';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import HistoryTable from '../ui/HistoryTable';
import ShareButtons from '../ui/ShareButtons';
import GaugeIMC from './GaugeIMC';

export default function IMCCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [lb, setLb] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularIMC> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; altura?: string }>({});
  const { addEntry } = useHistory('imc-history');

  const calcular = () => {
    const newErrors: typeof errors = {};
    let pesoKg: number, alturaCm: number;

    if (units === 'metric') {
      pesoKg   = parseFloat(peso);
      alturaCm = parseFloat(altura);
      if (!peso || isNaN(pesoKg) || pesoKg < 20 || pesoKg > 300)
        newErrors.peso = 'Peso entre 20 y 300 kg';
      if (!altura || isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250)
        newErrors.altura = 'Altura entre 100 y 250 cm';
    } else {
      pesoKg   = toKg(parseFloat(lb));
      alturaCm = toCm(parseFloat(ft), parseFloat(inches));
      if (!lb || isNaN(pesoKg) || pesoKg < 20)  newErrors.peso   = 'Peso inválido';
      if (!ft || isNaN(alturaCm) || alturaCm < 100) newErrors.altura = 'Altura inválida';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const res = calcularIMC(pesoKg!, alturaCm!);
    setResult(res);
    addEntry(res.imc);
  };

  const rangoColor: Record<string, string> = {
    bajo:       '#60A5FA',
    normal:     '#34D399',
    sobrepeso:  '#CAFF00',
    obesidad:   '#F87171',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <Input label="Peso" value={lb} onChange={setLb} suffix="lb" error={errors.peso} />
          <Input label="Pies" value={ft} onChange={setFt} suffix="pies" error={errors.altura} />
          <Input label="Pulgadas" value={inches} onChange={setInches} suffix="pulg" />
        </div>
      )}

      <Button onClick={calcular}>Calcular IMC</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GaugeIMC imc={result.imc} />
          <ResultCard
            label="Tu IMC"
            value={result.imc}
            unit="kg/m²"
            interpretation={result.categoria}
          />
          <div style={{
            padding: '12px 16px',
            background: rangoColor[result.rango] + '22',
            borderLeft: `3px solid ${rangoColor[result.rango]}`,
            fontSize: '12px',
            color: 'var(--ink)',
            lineHeight: 1.6,
          }}>
            <strong>{result.categoria}</strong>
            {result.rango === 'normal' && ' — Tu peso está dentro del rango saludable según la OMS.'}
            {result.rango === 'bajo' && ' — Considera consultar con un profesional de la salud.'}
            {result.rango === 'sobrepeso' && ' — Pequeños cambios en dieta y ejercicio pueden ayudar.'}
            {result.rango === 'obesidad' && ' — Se recomienda consulta médica especializada.'}
          </div>
          <ShareButtons
            text={`Mi IMC es ${result.imc} (${result.categoria}). Calculé el mío en CalcFit:`}
            url="https://www.calcfit.com/imc"
          />
          <HistoryTable storageKey="imc-history" unit="kg/m²" />
        </div>
      )}
    </div>
  );
}
