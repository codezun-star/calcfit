import { useState } from 'react';
import { calcularAguaDiaria } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

type Actividad = 'sedentario' | 'ligero' | 'moderado' | 'activo';
type Clima = 'templado' | 'calido' | 'muy_calido';

export default function AguaCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [actividad, setActividad] = useState<Actividad>('moderado');
  const [clima, setClima] = useState<Clima>('templado');
  const [result, setResult] = useState<ReturnType<typeof calcularAguaDiaria> | null>(null);

  const calcular = () => {
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    if (isNaN(pesoKg) || pesoKg < 20) return;
    setResult(calcularAguaDiaria({ pesoKg, actividad, clima }));
  };

  const selStyle: React.CSSProperties = { width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />
      {units === 'metric'
        ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" />
        : <Input label="Peso" value={lb} onChange={setLb} suffix="lb" />
      }
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Nivel de actividad</p>
        <select value={actividad} onChange={(e) => setActividad(e.target.value as Actividad)} style={selStyle}>
          <option value="sedentario">Sedentario</option>
          <option value="ligero">Ligero (1-3 días/sem)</option>
          <option value="moderado">Moderado (3-5 días/sem)</option>
          <option value="activo">Activo (6-7 días/sem)</option>
        </select>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Clima habitual</p>
        <select value={clima} onChange={(e) => setClima(e.target.value as Clima)} style={selStyle}>
          <option value="templado">Templado</option>
          <option value="calido">Cálido</option>
          <option value="muy_calido">Muy cálido / húmedo</option>
        </select>
      </div>
      <Button onClick={calcular}>Calcular agua diaria</Button>

      {result && (
        <>
          <ResultCard label="Agua diaria recomendada" value={result.litros} unit="litros" interpretation={`${result.vasos} vasos de 250ml al día`} />
          <ShareButtons text={`Necesito tomar ${result.litros}L de agua al día.`} url="https://www.calcfit.com/agua-diaria" />
        </>
      )}
    </div>
  );
}
